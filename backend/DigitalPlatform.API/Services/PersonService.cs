using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;
using DigitalPlatform.API.Models.Data.Person;
using HotChocolate.Resolvers;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace DigitalPlatform.API.Services
{
    public class PersonService(
        IDaprService daprService,
        IDaprCacheService daprCacheService,
        IConfiguration configuration,
        ICryptographyService cryptographyService,
        ILogger<PersonService> logger,
        IOtpService otpService) : IPersonService
    {
        // This dictionary holds the locks for each unique crmId.
        private static readonly ConcurrentDictionary<string, SemaphoreSlim> locks = new();
        public async Task<Person> GetPerson(string crmId, string sessionKey)
        {
            string cacheKey = $"Person_{crmId}";
            // Get or create a lock for the specific crmId so that we can avoid multiple requests for the same crmId.
            var semaphore = locks.GetOrAdd(cacheKey, k => new SemaphoreSlim(1, 1));
            logger.LogDebug("{timestamp} Semaphore WaitAsync: {CrmId}", DateTime.Now.ToString("o"), crmId);
            await semaphore.WaitAsync(); // Wait for the lock to be released.
            try
            {
                logger.LogDebug("{timestamp} Getting person with CRM ID: {CrmId}", DateTime.Now.ToString("o"), crmId);
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();

                string endpoint = configuration[ConfigDescriptors.PERSON_API_GET_PERSON_URL] ?? "";
                var result = await daprCacheService.GetOrCreateAsync(crmId, async () =>
                {
                    var url = configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint;
                    PersonV2Response data = await daprService.InvokeDaprGetMethodAsync<PersonV2Response>(url, $"{endpoint}{crmId}");
                    return cryptographyService.Encrypt(data);
                });

                stopwatch.Stop();
                logger.LogDebug("{timestamp} Time taken to get person with CRM ID {CrmId}: {ElapsedMilliseconds} ms", DateTime.Now.ToString("o"), crmId, stopwatch.ElapsedMilliseconds);
                if (result != null)
                {
                    PersonV2Response personV2Response = cryptographyService.Decrypt<PersonV2Response>(result);

                    Person person = new(personV2Response);

                    if (!string.IsNullOrEmpty(sessionKey))
                    {
                        var otpCheckResult = await otpService.CheckOtpAsync(new() { CrmId = crmId, Key = sessionKey });
                        if (otpCheckResult.IsVerified)
                        {
                            person.IsMasked = false;
                        }
                    }


                    return person;
                }

                throw new InvalidDataException("Person not found");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                return null!;
            }
            finally
            {
                semaphore.Release(); // Always release the lock regardless of error status.
                logger.LogDebug("{timestamp} Semaphore Release: {CrmId}", DateTime.Now.ToString("o"), crmId);
            }
        }

        public async Task<Person> UpdatePerson(PersonUpdateMutation person, string sessionKey, ClaimsPrincipal claimsPrincipal, IResolverContext context)
        {
            try
            {
                // Get the CRM ID from the claims
                var crmId = claimsPrincipal?.FindFirstValue(JwtClaims.crmId);

                // If the user is not authenticated, return an error
                if (string.IsNullOrEmpty(crmId))
                {
                    context.ReportError(ErrorBuilder.New()
                        .SetMessage("User not authenticated")
                        .SetExtension("type", "unauthenticated")
                        .Build());

                    logger.LogError("User not authenticated");
                    return null!;
                }

                // Get the existing person
                logger.LogInformation("Getting person with CRM ID: {CrmId}", crmId);
                var existingPerson = await GetPerson(crmId, sessionKey);

                // If the person does not exist, return an error
                if (existingPerson == null)
                {
                    context.ReportError(ErrorBuilder.New()
                        .SetMessage("Person not found")
                        .SetExtension("type", "invalid-person")
                        .Build());

                    logger.LogError("Person not found");
                    return null!;
                }

                PersonV2Request updatedPersonRequest = new()
                {
                    Title = person.Title ?? existingPerson.Title,
                    FirstName = person.FirstName ?? existingPerson.FirstName,
                    MiddleName = person.MiddleName ?? existingPerson.MiddleName,
                    Surname = person.Surname ?? existingPerson.Surname,
                    MobilePhone = person.MobilePhone,
                    HomePhone = person.HomePhone,
                    WorkPhone = person.WorkPhone,
                    PersonalEmailAddress = person.PersonalEmailAddress,
                    PostalAddress = person.PostalAddress != null ? new(newAddress: person.PostalAddress) : new(existingAddress: existingPerson.PostalAddress)
                };

                // Update the person
                var updatedPerson = await UpdatePerson(updatedPersonRequest, crmId);

                // If the person was not updated, return an error
                if (updatedPerson == null)
                {
                    context.ReportError(ErrorBuilder.New()
                        .SetMessage("Error updating person")
                        .SetExtension("type", "error-updating")
                        .Build());

                    logger.LogError("Error updating person");
                    return null!;
                }

                // Update the cache
                logger.LogInformation("Updating cache for CRM ID: {CrmId}", crmId);
                await daprCacheService.SetAsync(crmId, cryptographyService.Encrypt(updatedPerson));

                // Return the updated person
                return new(updatedPerson);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while updating person: {message}", ex.Message);
                throw;
            }
        }

        private async Task<PersonV2Response> UpdatePerson(PersonV2Request person, string crmId)
        {
            try
            {
                string endpoint = configuration[ConfigDescriptors.PERSON_API_GET_PERSON_URL] ?? "";
                return await daprService.InvokeDaprPutMethodAsync<PersonV2Response, PersonV2Request>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{crmId}", person);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while updating person: {message}", ex.Message);
                throw;
            }
        }

        public async Task<PersonProducts> GetProducts(string crmId)
        {
            try
            {
                string query = $"?personIdList={crmId}";
                string endpoint = configuration[ConfigDescriptors.PERSON_API_GET_PRODUCTS_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<PersonProducts>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{query}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while getting products: {message}", ex.Message);
                throw;
            }
        }
    }
}

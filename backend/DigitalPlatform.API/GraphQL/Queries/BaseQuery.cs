using System.Net;
using System.Security.Claims;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Extensions;
using DigitalPlatform.API.GraphQL.DataLoaders;
using DigitalPlatform.API.GraphQL.Exceptions;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Models.Services;
using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using DigitalPlatform.API.Models.SourceSystem.Address;
using DigitalPlatform.API.Models.SourceSystem.MemberCards;
using DigitalPlatform.API.Models.SourceSystem.Otp;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Validators;
using HotChocolate.Resolvers;
using DigitalPlatform.API.Models.SourceSystem.ADB2CGraph;

namespace DigitalPlatform.API.GraphQL.Queries;

[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]
public class BaseQuery(ILogger<BaseQuery> logger)
{
    public async Task<IReadOnlyList<string>> GetContentDataRequestAsync(
        string query,
        IResolverContext context,
        ClaimsPrincipal claimsPrincipal,
        ContentDataLoader contentDataLoader,
        string sessionKey = "")
    {
        try
        {
            var crmId = claimsPrincipal?.FindFirstValue(JwtClaims.crmId) ?? string.Empty;
            var loginEmail = claimsPrincipal?.FindFirstValue(JwtClaims.name) ?? string.Empty;
            var contentData = new List<KeyValuePair<string, string>> {
                new("query", query),
                new("crmId", crmId),
                new("loginEmail", loginEmail),
                new("sessionKey", sessionKey)
            };

            logger.LogInformation("Loading content data with crmId: {CrmId} and loginEmail: {LoginEmail}", crmId, loginEmail.MaskEmail());

            return await contentDataLoader.LoadAsync(contentData.AsReadOnly());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while loading content data for query: {Query}", query);
            context.ReportError(ErrorBuilder.New()
                .SetMessage("An error occurred while processing your request.")
                .SetException(ex)
                .Build());
        }

        return null!;
    }

    public async Task<AddressLookup> GetAddressListAsync(
        string partialAddress,
        string dataVersion,
        IResolverContext context,
        [Service] IAddressService addressService)
    {
        try
        {
            var lowerDataVersion = dataVersion.ToLowerInvariant();
            logger.LogInformation("Fetching address list for partial address: {PartialAddress} with data version: {DataVersion}", partialAddress, lowerDataVersion);

            if (lowerDataVersion == "paf")
            {
                return await addressService.GetPafAddressListAsync(partialAddress);
            }
            else if (lowerDataVersion == "gnaf")
            {
                return await addressService.GetGnafAddressListAsync(partialAddress);
            }

            logger.LogWarning("Incorrect data version provided: {DataVersion}. Valid values are GNAF or PAF.", dataVersion);
            context.ReportError(ErrorBuilder.New()
                    .SetMessage("Incorrect data version, valid values are GNAF or PAF.")
                    .Build());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching address list for partial address: {PartialAddress}", partialAddress);
            context.ReportError(ErrorBuilder.New()
                .SetMessage("An error occurred while processing your request.")
                .SetException(ex)
                .Build());
        }

        return null!;
    }

    public async Task<PAFVerification> GetValidatePAFAsync(
        string moniker,
        IResolverContext context,
        [Service] IAddressService addressService)
    {
        try
        {
            logger.LogInformation("Validating PAF for moniker: {Moniker}", moniker);
            return await addressService.GetPafAddressAsync(moniker);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while validating PAF for moniker: {Moniker}", moniker);
            context.ReportError(ErrorBuilder.New()
                .SetMessage("An error occurred while processing your request.")
                .SetException(ex)
                .Build());
        }

        return null!;
    }

    public async Task<Person> GetPerson(
        string sessionKey,
        [Service] IPersonService personService,
        IResolverContext context,
        ClaimsPrincipal claimsPrincipal)
    {
        var crmId = claimsPrincipal?.FindFirstValue(JwtClaims.crmId);
        try
        {
            if (string.IsNullOrEmpty(crmId))
            {
                throw new UnauthorizedAccessException("No crmID");
            }

            var person = await personService.GetPerson(crmId, sessionKey);
            return person;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Get Person failed for person with {crmId}", crmId);
            context.ReportError(ErrorBuilder.New()
                .SetMessage("An error occurred while processing your request.")
                .SetException(ex)
                .Build());
        }

        return null!;
    }

    public async Task<PersonAddress?> GetUnmaskedPostalAddress(
    [Service] IPersonService personService,
    IResolverContext context,
    ClaimsPrincipal claimsPrincipal)
    {
        var crmId = claimsPrincipal?.FindFirstValue(JwtClaims.crmId);
        try
        {
            if (string.IsNullOrEmpty(crmId))
            {
                throw new UnauthorizedAccessException("No crmID");
            }

            var person = await personService.GetPerson(crmId, string.Empty);
            person.IsMasked = false;
            return person?.PostalAddress;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Get Unmasked Formatted Address failed for person with {crmId}", crmId);
            context.ReportError(ErrorBuilder.New()
                .SetMessage("An error occurred while processing your request.")
                .SetException(ex)
                .Build());
        }

        return null!;
    }


    [Error<ValidationError>]
    [Error<UnauthorizedAccessException>]
    [Error<HttpError>]
    public async Task<CheckOtpQueryResponse> CheckOtp(
       CheckOtpQuery request,
       ClaimsPrincipal claimsPrincipal,
       IResolverContext context,
       [Service] IOtpService otpService)
    {
        try
        {
            var crmId = claimsPrincipal?.FindFirstValue(JwtClaims.crmId);
            if (claimsPrincipal == null || string.IsNullOrEmpty(crmId))
            {
                logger.LogWarning("CheckOtp called without authentication");
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            var validationErrors = ValidationHelper.GetValidationErrors(request);
            if (validationErrors.Count != 0)
            {
                validationErrors.ForEach(error => logger.LogWarning("{message}", error.Message));
                throw new AggregateException(validationErrors);
            }

            // Check OTP
            logger.LogInformation("Checking OTP to person with CRM ID: {CrmId}", crmId);
            var otpResponse = await otpService.CheckOtpAsync(new CheckOtpRequest { Key = request.Key, CrmId = crmId });

            // Check person data
            logger.LogInformation("Checking person data with CRM ID: {CrmId}", crmId);

            return otpResponse;
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("CheckOtp failed with AuthorisationError");
            throw;
        }
        catch (AggregateException)
        {
            logger.LogError("CheckOtp failed with multiple errors");
            throw;
        }
        catch (HttpRequestException ex)
        {
            logger.LogError("CheckOtp failed with a HttpRequestException");
            throw new HttpError(ex.Message, (ex.StatusCode ?? HttpStatusCode.InternalServerError).ToString());
        }
        catch (Exception ex) // CATCH ALL UNHANDLED. NOT RE THROWING TO AVOID CRASHING THE WHOLE REQUEST
        {
            logger.LogError(ex, "Unhandled exception occurred while checking OTP");
            ReportError(context, ex.Message, "UnhandledException");
        }

        return null!;
    }

    [Error<UnauthorizedAccessException>]
    [Error<HttpError>]
    public async Task<DigitalCardDetailsResponse> GetDigitalCardDetails(
       ClaimsPrincipal claimsPrincipal,
       IResolverContext context,
       [Service] IMemberCardsService memberCardsService)
    {
        try
        {
            var crmId = claimsPrincipal?.FindFirstValue(JwtClaims.crmId);
            if (claimsPrincipal == null || string.IsNullOrEmpty(crmId))
            {
                logger.LogWarning("GetDigitalCardDetails called without authentication");
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            logger.LogInformation("Get digital card details for person with CRM ID: {CrmId}", crmId);
            var digitalCardDetails = await memberCardsService.RetrieveDigitalCardDetails(crmId);

            return digitalCardDetails;
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("GetDigitalCardDetails failed with AuthorisationError");
            throw;
        }
        catch (HttpRequestException ex)
        {
            logger.LogError("GetDigitalCardDetails failed with a HttpRequestException");
            throw new HttpError(ex.Message, (ex.StatusCode ?? HttpStatusCode.InternalServerError).ToString());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception occurred while getting digital card details");
            ReportError(context, ex.Message, "UnhandledException");
        }

        return null!;
    }

    [Error<UnauthorizedAccessException>]
    [Error<HttpError>]
    public async Task<List<StatusInformation>> GetStatusInformation(
        [Service] IStatusService statusService,
        IResolverContext context,
        ClaimsPrincipal claimsPrincipal)
    {
        try
        {
            var crmId = claimsPrincipal?.FindFirstValue(JwtClaims.crmId);
            if (claimsPrincipal == null || string.IsNullOrEmpty(crmId))
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            var statusInformation = await statusService.GetSystemStatus(crmId);
            return statusInformation;
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("GetStatusInformation failed with AuthorisationError");
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetStatusInformation failed");
            ReportError(context, ex.Message, "UnhandledException");
        }

        return null!;
    }

    [Error<UnauthorizedAccessException>]
    [Error<HttpError>]
    public async Task<List<PolicyDetail>> GetMemberProducts(
       ClaimsPrincipal claimsPrincipal,
       IResolverContext context,
       string sessionKey,
       [Service] IProductService productService,
       [Service] IPolicyDetailsMapper policyDetailsMapper)
    {
        try
        {
            var crmId = claimsPrincipal?.FindFirstValue(JwtClaims.crmId);
            if (claimsPrincipal == null || string.IsNullOrEmpty(crmId))
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            logger.LogInformation("Get member products for person with CRM ID: {CrmId}", crmId);
            var products = await productService.GetProducts(crmId, sessionKey);

            return policyDetailsMapper.Map(products);
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("GetMemberProducts failed with AuthorisationError");
            throw;
        }
        catch (HttpRequestException ex)
        {
            logger.LogError("GetMemberProducts failed with a HttpRequestException");
            throw new HttpError(ex.Message, (ex.StatusCode ?? HttpStatusCode.InternalServerError).ToString());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception occurred while getting member products");
            ReportError(context, ex.Message, "UnhandledException");
        }

        return null!;
    }

    [Error<UnauthorizedAccessException>]
    [Error<HttpError>]
    public async Task<ADB2CAccount> GetADB2CGraph(
        [Service] IADB2CGraphService adb2cGraphService,
        IResolverContext context,
        ClaimsPrincipal claimsPrincipal)
    {
        try
        {
            var email = claimsPrincipal?.FindFirstValue(JwtClaims.name);
            if (claimsPrincipal == null || string.IsNullOrEmpty(email))
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            return await adb2cGraphService.GetUserByEmail(email);
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("GetADB2CGraph failed with AuthorisationError");
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetADB2CGraph failed");
            ReportError(context, ex.Message, "UnhandledException");
        }

        return null!;
    }

    public IEnumerable<FeatureToggle> GetFeatureToggles(
        [Service] IFeatureService featureService,
        IResolverContext context)
    {
        try
        {
            var features = featureService.GetFeatures();
            return features.Select(x => new FeatureToggle() { Key = x.Key, Enabled = x.Value });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetFeatureToggles failed");
            context.ReportError(ErrorBuilder.New()
                .SetMessage("An error occurred while processing your request.")
                .SetException(ex)
                .Build());
        }

        return [];
    }

    private void ReportError(IResolverContext context, string message, string errorType)
    {
        context.ReportError(ErrorBuilder.New()
            .SetMessage(message)
            .SetExtension("type", errorType)
            .Build());
    }

}

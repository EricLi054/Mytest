using System.Net;
using System.Security.Claims;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.GraphQL.Exceptions;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Models.SourceSystem.MemberCards;
using DigitalPlatform.API.Models.SourceSystem.Otp;
using DigitalPlatform.API.Validators;
using HotChocolate.Resolvers;

namespace DigitalPlatform.API.GraphQL.Mutations;

public class BaseMutation(ILogger<BaseMutation> logger)
{
    [Error<ValidationError>]
    [Error<UnauthorizedAccessException>]
    [Error<HttpError>]
    public async Task<Person> UpdatePerson(
        PersonUpdateMutation person,
        string sessionKey,
        ClaimsPrincipal claimsPrincipal,
        IResolverContext context,
        [Service] IPersonService personService,
        [Service] IOtpService otpService)
    {
        try
        {
            if (person == null)
            {
                logger.LogWarning("UpdatePerson called with null person");
                throw new ValidationError("Person cannot be null", []);
            }

            if (claimsPrincipal == null)
            {
                logger.LogWarning("UpdatePerson called without authentication");
                throw new Exception("User is not authenticated");
            }

            // Perform necessary data cleaning
            person.SanitiseInput();

            var validationErrors = ValidationHelper.GetValidationErrors(person);
            if (validationErrors.Count != 0)
            {
                validationErrors.ForEach(error => logger.LogWarning("{message}", error.Message));
                throw new AggregateException(validationErrors);
            }

            var crmId = claimsPrincipal?.FindFirstValue(JwtClaims.crmId);

            if (string.IsNullOrEmpty(crmId))
            {
                logger.LogWarning("CrmId is null or empty");
                throw new UnauthorizedAccessException("CrmId is null or empty");
            }

            var checkOtpResponse = await otpService.CheckOtpAsync(new() { Key = sessionKey, CrmId = crmId });

            if (checkOtpResponse == null)
            {
                logger.LogWarning("CheckOtpResponse is null");
                throw new Exception("CheckOtpResponse is null");
            }

            if (!checkOtpResponse.IsVerified)
            {
                logger.LogWarning("OTP verification not done");
                throw new UnauthorizedAccessException("OTP verification not done");
            }

            // Update the person
            logger.LogInformation("Updating person with CRM ID: {CrmId}", crmId);
            return await personService.UpdatePerson(person, sessionKey, claimsPrincipal!, context);
        }
        catch (ValidationError)
        {
            logger.LogError("UpdatePerson failed with ValidationError");
            throw;
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("UpdatePerson failed with AuthorisationError");
            throw;
        }
        catch (AggregateException)
        {
            logger.LogError("UpdatePerson failed with multiple errors");
            throw;
        }
        catch (HttpRequestException ex)
        {
            logger.LogError("UpdatePerson failed with a HttpRequestException");
            throw new HttpError(ex.Message, (ex.StatusCode ?? HttpStatusCode.InternalServerError).ToString());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception occurred while updating person");
            ReportError(context, ex.Message, "UnhandledException");
        }

        return null!;
    }

    [Error<ValidationError>]
    [Error<UnauthorizedAccessException>]
    [Error<HttpError>]
    public async Task<SendOtpResponse> SendOtp(
       SendOtpRequest request,
       ClaimsPrincipal claimsPrincipal,
       IResolverContext context,
       [Service] IOtpService otpService)
    {
        try
        {
            if (claimsPrincipal == null)
            {
                logger.LogWarning("SendOtp called without authentication");
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            var validationErrors = ValidationHelper.GetValidationErrors(request);
            if (validationErrors.Count != 0)
            {
                validationErrors.ForEach(error => logger.LogWarning("{message}", error.Message));
                throw new AggregateException(validationErrors);
            }

            // Send OTP
            logger.LogInformation("Sending OTP to person with CRM ID: {CrmId}", claimsPrincipal?.FindFirstValue(JwtClaims.crmId));
            return await otpService.SendOtpAsync(request);
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("SendOtp failed with AuthorisationError");
            throw;
        }
        catch (AggregateException)
        {
            logger.LogError("SendOtp failed with multiple errors");
            throw;
        }
        catch (HttpRequestException ex)
        {
            logger.LogError("SendOtp failed with a HttpRequestException");
            throw new HttpError(ex.Message, (ex.StatusCode ?? HttpStatusCode.InternalServerError).ToString());
        }
        catch (Exception ex) // CATCH ALL UNHANDLED. NOT RE THROWING TO AVOID CRASHING THE WHOLE REQUEST
        {
            logger.LogError(ex, "Unhandled exception occurred while sending OTP");
            ReportError(context, ex.Message, "UnhandledException");
        }

        return null!;
    }

    [Error<ValidationError>]
    [Error<UnauthorizedAccessException>]
    [Error<HttpError>]
    public async Task<VerifyOtpResponse> VerifyOtp(
       VerifyOtpRequest request,
       ClaimsPrincipal claimsPrincipal,
       IResolverContext context,
       [Service] IOtpService otpService)
    {
        try
        {
            if (claimsPrincipal == null)
            {
                logger.LogWarning("VerifyOtp called without authentication");
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            var validationErrors = ValidationHelper.GetValidationErrors(request);
            if (validationErrors.Count != 0)
            {
                validationErrors.ForEach(error => logger.LogWarning("{message}", error.Message));
                throw new AggregateException(validationErrors);
            }

            // Verify OTP
            logger.LogInformation("Verifying OTP to person with CRM ID: {CrmId}", claimsPrincipal?.FindFirstValue(JwtClaims.crmId));
            return await otpService.VerifyOtpAsync(request);
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("VerifyOtp failed with AuthorisationError");
            throw;
        }
        catch (AggregateException)
        {
            logger.LogError("VerifyOtp failed with multiple errors");
            throw;
        }
        catch (HttpRequestException ex)
        {
            logger.LogError("VerifyOtp failed with a HttpRequestException");
            throw new HttpError(ex.Message, (ex.StatusCode ?? HttpStatusCode.InternalServerError).ToString());
        }
        catch (Exception ex) // CATCH ALL UNHANDLED. NOT RE THROWING TO AVOID CRASHING THE WHOLE REQUEST
        {
            logger.LogError(ex, "Unhandled exception occurred while verifying OTP");
            ReportError(context, ex.Message, "UnhandledException");
        }

        return null!;
    }

    [Error<ValidationError>]
    [Error<UnauthorizedAccessException>]
    [Error<HttpError>]
    public async Task<PhysicalCardResponse> RequestPhysicalCard(
        PhysicalCardRequest request,
        ClaimsPrincipal claimsPrincipal,
        IResolverContext context,
        [Service] IMemberCardsService memberCardsService)
    {
        try
        {
            if (claimsPrincipal == null)
            {
                logger.LogWarning("RequestPhysicalCard called without authentication");
                throw new UnauthorizedAccessException("User is not authenticated");
            }
            var validationErrors = ValidationHelper.GetValidationErrors(request);
            if (validationErrors.Count != 0)
            {
                validationErrors.ForEach(error => logger.LogWarning("{message}", error.Message));
                throw new AggregateException(validationErrors);
            }

            logger.LogInformation("Requesting physical card for person with CRM ID: {CrmId}", claimsPrincipal?.FindFirstValue(JwtClaims.crmId));
            return await memberCardsService.CreatePhysicalCardRequestAsync(request);
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("RequestPhysicalCard failed with AuthorisationError");
            throw;
        }
        catch (AggregateException)
        {
            logger.LogError("RequestPhysicalCard failed with multiple errors");
            throw;
        }
        catch (HttpRequestException ex)
        {
            logger.LogError("RequestPhysicalCard failed with a HttpRequestException");
            throw new HttpError(ex.Message, (ex.StatusCode ?? HttpStatusCode.InternalServerError).ToString());
        }
        catch (Exception ex) // CATCH ALL UNHANDLED. NOT RE THROWING TO AVOID CRASHING THE WHOLE REQUEST
        {
            logger.LogError(ex, "Unhandled exception occurred while requesting physical card");
            ReportError(context, ex.Message, "UnhandledException");
        }

        return null!;
    }

    private static void ReportError(IResolverContext context, string message, string errorType)
    {
        context.ReportError(ErrorBuilder.New()
            .SetMessage(message)
            .SetExtension("type", errorType)
            .Build());
    }
}

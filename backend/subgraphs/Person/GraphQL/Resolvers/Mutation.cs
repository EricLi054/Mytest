using FluentValidation;
using Person.API.ADB2C.Interfaces;
using Person.API.MFA.Interfaces;
using Person.API.MFA.Models;
using Person.API.Person.Interfaces;
using Person.API.Person.Models;
using Person.Attributes;
using Person.GraphQL.Enums;
using Person.GraphQL.Types;
using Person.GraphQL.Types.ADB2CGraph;
using Shared.Constants;
using Shared.Exceptions;
using Shared.Extensions;
using Shared.Util;
using System.Security.Claims;
using PersonType = Person.GraphQL.Types.Person;

namespace Person.GraphQL.Resolvers;

[MutationType]
public class Mutation(ILogger<Mutation> logger)
{
    private readonly ILogger<Mutation> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    ///     Get the matched person details for a given set of query params.
    /// </summary>
    /// <param name="personService"></param>
    /// <param name="request"></param>
    /// <returns><see cref="MatchedPerson"/> or null</returns>
    [Error(typeof(NoMatchException))]
    [Error(typeof(DuplicateMatchException))]
    [AuthorizeAzureAdPolicy]
    public Task<MatchedPerson?> GetMatch([Service] IPersonService personService, MatchPersonRequest request)
    {
        return personService.GetMatchPersonAsync(request);
    }

    /// <summary>
    ///     Get the OTP Verification Details for an anonymous member that is
    ///     trying to register for myRAC for unique MFA Journey session key.
    /// </summary>
    /// <param name="mfaService"></param>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <returns><see cref="OtpVerificationDetailsResponse"/> or null</returns>
    [AuthorizeAzureAdPolicy]
    public Task<OtpVerificationDetailsResponse?> GetRegistrationOtpVerificationDetails(
        [Service] IMfaService mfaService,
        string crmId,
        string key)
    {
        return mfaService.GetOtpVerificationDetailsAsync(crmId, key);
    }

    /// <summary>
    ///     Get the OTP Verification Details for a logged-in
    ///     member for unique MFA Journey session key.
    /// </summary>
    /// <param name="mfaService"></param>
    /// <param name="claimsPrincipal"></param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <returns><see cref="OtpVerificationDetailsResponse"/> or null</returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    [AuthorizeAzureAdB2CPolicy]
    public Task<OtpVerificationDetailsResponse?> GetOtpVerificationDetails(
        [Service] IMfaService mfaService,
        ClaimsPrincipal claimsPrincipal,
        string key)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);
        return mfaService.GetOtpVerificationDetailsAsync(crmId, key);
    }

    /// <summary>
    /// Updated ADB2C account CRM ID by account ID.
    /// </summary>
    /// <param name="adb2cGraphService"></param>
    /// <param name="adb2cAccountId">The unique ADB2C account ID</param>
    /// <param name="crmId">The unique ID provided by our CRM software</param>
    /// <returns></returns>
    [AuthorizeAzureAdB2CPolicy]
    public Task<PatchAdb2cAccountResponse?> UpdateAdAccountCrmId(
        [Service] IADB2CGraphService adb2cGraphService,
        string adb2cAccountId,
        string crmId)
    {
        return adb2cGraphService.UpdateUserCrmIdByAccountIdAsync(adb2cAccountId, crmId);
    }

    /// <summary>
    /// Update the email address for a ADB2C account.
    /// </summary>
    /// <param name="adb2cGraphService"></param>
    /// <param name="adAccountId"></param>
    /// <param name="newEmailAddress"></param>
    /// <returns></returns>
    [AuthorizeAzureAdB2CPolicy]
    public Task<ADB2CUserAccount?> UpdateAdAccountEmail(
        [Service] IADB2CGraphService adb2cGraphService,
        string adAccountId,
        string newEmailAddress)
    {
        return adb2cGraphService.UpdateUserEmailByIdAsync(adAccountId, newEmailAddress);
    }

    /// <summary>
    ///     Send OTP to an anonymous member that is trying to
    ///     register for myRAC for unique MFA Journey session key.
    /// </summary>
    /// <param name="mfaService"></param>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="channel">OTP Channel verification code will be sent via</param>
    /// <returns><see cref="SendOtpResponse"/> or null</returns>
    [Error(typeof(InternalServerException))]
    [Error(typeof(NotFoundException))]
    [Error(typeof(TooManyRequestsException))]
    [AuthorizeAzureAdPolicy]
    public Task<SendOtpResponse?> SendRegistrationOtp(
        [Service] IMfaService mfaService,
        string crmId,
        string key,
        OtpChannel channel)
    {
        return mfaService.SendOtpAsync(crmId, key, channel);
    }

    /// <summary>
    ///     Send OTP code to a logged-in member for unique MFA Journey session key.
    /// </summary>
    /// <param name="mfaService"></param>
    /// <param name="claimsPrincipal"></param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="channel">OTP Channel verification code will be sent via</param>
    /// <returns><see cref="SendOtpResponse"/> or null</returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    [Error(typeof(InternalServerException))]
    [Error(typeof(NotFoundException))]
    [Error(typeof(TooManyRequestsException))]
    [AuthorizeAzureAdB2CPolicy]
    public Task<SendOtpResponse?> SendOtp(
        [Service] IMfaService mfaService,
        ClaimsPrincipal claimsPrincipal,
        string key,
        OtpChannel channel)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);
        return mfaService.SendOtpAsync(crmId, key, channel);
    }

    /// <summary>
    ///     Verify OTP code for an anonymous member that is trying
    ///     to register for myRAC for unique MFA Journey session key.
    /// </summary>
    /// <param name="mfaService"></param>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="code">OTP verification code</param>
    /// <returns><see cref="VerifyOtpResponse"/> or null</returns>
    /// <returns><see cref="VerifyOtpResponse"/> or null</returns>
    [Error(typeof(InternalServerException))]
    [Error(typeof(NotFoundException))]
    [Error(typeof(TooManyRequestsException))]
    [AuthorizeAzureAdPolicy]
    public Task<VerifyOtpResponse?> VerifyRegistrationOtp(
        [Service] IMfaService mfaService,
        string crmId,
        string key,
        string code)
    {
        return mfaService.VerifyOtpAsync(crmId, key, code);
    }

    /// <summary>
    ///     Verify OTP code for a logged-in member for unique MFA Journey session key.
    /// </summary>
    /// <param name="mfaService"></param>
    /// <param name="claimsPrincipal"></param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="code">OTP verification code</param>
    /// <returns><see cref="VerifyOtpResponse"/> or null</returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    [Error(typeof(InternalServerException))]
    [Error(typeof(NotFoundException))]
    [Error(typeof(TooManyRequestsException))]
    [AuthorizeAzureAdB2CPolicy]
    public Task<VerifyOtpResponse?> VerifyOtp(
        [Service] IMfaService mfaService,
        ClaimsPrincipal claimsPrincipal,
        string key,
        string code)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);
        return mfaService.VerifyOtpAsync(crmId, key, code);
    }

    /// <summary>
    ///     Check if OTP status is verified for an anonymous member that is
    ///     trying to register for myRAC for unique MFA Journey session key.
    /// </summary>
    /// <param name="mfaService"></param>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <returns><see cref="Types.CheckRegistrationOtp"/> or null</returns>
    [AuthorizeAzureAdPolicy]
    public async Task<CheckRegistrationOtp?> CheckRegistrationOtp(
        [Service] IMfaService mfaService,
        string crmId,
        string key)
    {
        var response = await mfaService.CheckOtpAsync(crmId, key);
        return response == null
            ? null
            : new CheckRegistrationOtp
            {
                CrmId = crmId,
                SessionKey = key,
                IsAuthenticated = response.IsAuthenticated
            };
    }

    /// <summary>
    ///     Check if OTP status is verified for a logged-in
    ///     member for unique MFA Journey session key.
    /// </summary>
    /// <param name="mfaService"></param>
    /// <param name="claimsPrincipal"></param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <returns><see cref="Types.CheckOtp"/> or null</returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    [AuthorizeAzureAdB2CPolicy]
    public async Task<CheckOtp?> CheckOtp(
        [Service] IMfaService mfaService,
        ClaimsPrincipal claimsPrincipal,
        string key)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);
        var response = await mfaService.CheckOtpAsync(crmId, key);
        return response == null
            ? null
            : new CheckOtp
            {
                CrmId = crmId,
                SessionKey = key,
                IsAuthenticated = response.IsAuthenticated
            };
    }

    /// <summary>
    ///     Check if matched person is already authenticated for a unique
    ///     MFA journey session key and send OTP code if not authenticated.
    /// </summary>
    /// <remarks>
    ///     RACI MFA OTP Service will return an error if SendOtp is called
    ///     and person is already authenticated for a unique MFA journey session key.
    ///     TODO - DED-2215 - RACI MFA OTP Service performance issues identified on CheckOtp endpoint. Will likely remove this mutation and just call SendRegistrationOtp instead.
    /// </remarks>
    /// <param name="mfaService"></param>
    /// <param name="httpContextAccessor"></param>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="channel">Channel OTP code will be sent via</param>
    /// <returns><see cref="SendOtpResponse"/> or null if person is already authenticated for session key</returns>
    [Error(typeof(InternalServerException))]
    [Error(typeof(NotFoundException))]
    [Error(typeof(TooManyRequestsException))]
    [AuthorizeAzureAdPolicy]
    public async Task<SendOtpResponse?> CheckAndSendRegistrationOtp(
        [Service] IMfaService mfaService,
        IHttpContextAccessor httpContextAccessor,
        string crmId,
        string key,
        OtpChannel channel)
    {
        var correlationId = httpContextAccessor.HttpContext?.TryGetRequestHeaderValue(Headers.CorrelationId);

        var checkOtpResponse = await mfaService.CheckOtpAsync(crmId, key);
        if (checkOtpResponse == null)
        {
            logger.LogInformation(
                "CheckAndSendRegistrationOtp mutation called with CorrelationID [{CorrelationId}] for person with CrmID [{CrmID}] and SessionKey [{SessionKey}], but CheckOtp response was null",
                correlationId, crmId, key);
            return null;
        }

        logger.LogInformation(
            "CheckAndSendRegistrationOtp mutation called with CorrelationID [{CorrelationId}] for {IsAuthenticated} person with CrmID [{CrmID}] and SessionKey [{SessionKey}]",
            correlationId, GetIsAuthenticatedLogText(checkOtpResponse.IsAuthenticated), crmId, key);

        return checkOtpResponse.IsAuthenticated ? null : await mfaService.SendOtpAsync(crmId, key, channel);
    }

    /// <summary>
    ///     Check if logged-in person is already authenticated for a unique
    ///     MFA journey session key and send OTP code if not authenticated.
    /// </summary>
    /// <remarks>
    ///     RACI MFA OTP Service will return an error if SendOtp is called and
    ///     person is already authenticated for a unique MFA journey session key.
    ///     TODO - DED-2215 - RACI MFA OTP Service performance issues identified on CheckOtp endpoint. Will likely remove this mutation and just call SendOtp instead.
    /// </remarks>
    /// <param name="mfaService"></param>
    /// <param name="httpContextAccessor"></param>
    /// <param name="claimsPrincipal"></param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="channel">Channel OTP code will be sent via</param>
    /// <returns><see cref="SendOtpResponse"/> or null if person is already authenticated for session key</returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    [Error(typeof(InternalServerException))]
    [Error(typeof(NotFoundException))]
    [Error(typeof(TooManyRequestsException))]
    [AuthorizeAzureAdB2CPolicy]
    public async Task<SendOtpResponse?> CheckAndSendOtp(
        [Service] IMfaService mfaService,
        IHttpContextAccessor httpContextAccessor,
        ClaimsPrincipal claimsPrincipal,
        string key,
        OtpChannel channel)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);
        var correlationId = httpContextAccessor.HttpContext?.TryGetRequestHeaderValue(Headers.CorrelationId);

        var checkOtpResponse = await mfaService.CheckOtpAsync(crmId, key);

        if (checkOtpResponse == null)
        {
            logger.LogInformation(
                "CheckAndSendOtp mutation called with CorrelationID [{CorrelationId}] for person with CrmID [{CrmID}] and SessionKey [{SessionKey}], but CheckOtp response was null",
                correlationId, crmId, key);
            return null;
        }

        logger.LogInformation(
            "CheckAndSendOtp mutation called with CorrelationID [{CorrelationId}] for {IsAuthenticated} person with CrmID [{CrmID}] and SessionKey [{SessionKey}]",
            correlationId, GetIsAuthenticatedLogText(checkOtpResponse.IsAuthenticated), crmId, key);

        return checkOtpResponse.IsAuthenticated ? null : await mfaService.SendOtpAsync(crmId, key, channel);
    }

    /// <summary>
    ///     Check if matched person is already authenticated for a unique 
    ///     MFA journey session key and verify OTP code if not authenticated.
    /// </summary>
    /// <remarks>
    ///     RACI MFA OTP Service will return an error if VerifyOtp is called and
    ///     person is already authenticated for a unique MFA journey session key.
    ///     TODO - DED-2215 - RACI MFA OTP Service performance issues identified on CheckOtp endpoint. Will likely remove this mutation and just call VerifyRegistrationOtp instead.
    /// </remarks>
    /// <param name="mfaService"></param>
    /// <param name="httpContextAccessor"></param>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="code">OTP verification code</param>
    /// <returns><see cref="VerifyOtpResponse"/> or null if person is already authenticated for session key</returns>
    [Error(typeof(InternalServerException))]
    [Error(typeof(NotFoundException))]
    [Error(typeof(TooManyRequestsException))]
    [AuthorizeAzureAdPolicy]
    public async Task<VerifyOtpResponse?> CheckAndVerifyRegistrationOtp(
        [Service] IMfaService mfaService,
        IHttpContextAccessor httpContextAccessor,
        string crmId,
        string key,
        string code)
    {
        var correlationId = httpContextAccessor.HttpContext?.TryGetRequestHeaderValue(Headers.CorrelationId);

        var checkOtpResponse = await mfaService.CheckOtpAsync(crmId, key);
        if (checkOtpResponse == null)
        {
            logger.LogInformation(
                "CheckAndVerifyRegistrationOtp mutation called with CorrelationID [{CorrelationId}] for person with CrmID [{CrmID}] and SessionKey [{SessionKey}], but CheckOtp response was null",
                correlationId, crmId, key);
            return null;
        }

        logger.LogInformation(
            "CheckAndVerifyRegistrationOtp mutation called with CorrelationID [{CorrelationId}] for {IsAuthenticated} person with CrmID [{CrmID}] and SessionKey [{SessionKey}]",
            correlationId, GetIsAuthenticatedLogText(checkOtpResponse.IsAuthenticated), crmId, key);

        return checkOtpResponse.IsAuthenticated ? null : await mfaService.VerifyOtpAsync(crmId, key, code);
    }

    /// <summary>
    ///     Check if logged-in person is already authenticated for a unique
    ///     MFA journey session key and verify OTP code if not authenticated.
    /// </summary>
    /// <remarks>
    ///     RACI MFA OTP Service will return an error if VerifyOtp is called and
    ///     person is already authenticated for a unique MFA journey session key.
    ///     TODO - DED-2215 - RACI MFA OTP Service performance issues identified on CheckOtp endpoint. Will likely remove this mutation and just call VerifyOtp instead.
    /// </remarks>
    /// <param name="mfaService"></param>
    /// <param name="httpContextAccessor"></param>
    /// <param name="claimsPrincipal"></param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="code">OTP verification code</param>
    /// <returns><see cref="VerifyOtpResponse"/> or null if person is already authenticated for session key</returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    [Error(typeof(InternalServerException))]
    [Error(typeof(NotFoundException))]
    [Error(typeof(TooManyRequestsException))]
    [AuthorizeAzureAdB2CPolicy]
    public async Task<VerifyOtpResponse?> CheckAndVerifyOtp(
        [Service] IMfaService mfaService,
        IHttpContextAccessor httpContextAccessor,
        ClaimsPrincipal claimsPrincipal,
        string key,
        string code)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);
        var correlationId = httpContextAccessor.HttpContext?.TryGetRequestHeaderValue(Headers.CorrelationId);

        var checkOtpResponse = await mfaService.CheckOtpAsync(crmId, key);
        if (checkOtpResponse == null)
        {
            logger.LogInformation(
                "CheckAndVerifyOtp mutation called with CorrelationID [{CorrelationId}] for person with CrmID [{CrmID}] and SessionKey [{SessionKey}], but CheckOtp response was null",
                correlationId, crmId, key);
            return null;
        }

        logger.LogInformation(
            "CheckAndVerifyOtp mutation called with CorrelationID [{CorrelationId}] for {IsAuthenticated} person with CrmID [{CrmID}] and SessionKey [{SessionKey}]",
            correlationId, GetIsAuthenticatedLogText(checkOtpResponse.IsAuthenticated), crmId, key);

        return checkOtpResponse.IsAuthenticated ? null : await mfaService.VerifyOtpAsync(crmId, key, code);
    }

    /// <summary>
    ///    Update details for a logged-in Person.
    /// </summary>
    /// <param name="personService"></param>
    /// <param name="request"></param>
    /// <param name="claimsPrincipal"></param>
    /// <param name="validator"></param>
    /// <returns><see cref="PersonType"/> or null</returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    [AuthorizeAzureAdB2CPolicy]
    [Error(typeof(ValidationException))]
    public async Task<PersonType?> UpdatePerson(
        [Service] IPersonService personService,
        UpdatePersonRequest request,
        ClaimsPrincipal claimsPrincipal,
        IValidator<UpdatePersonRequest> validator)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);

        request.SanitiseInput();
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        return await personService.UpdatePersonAsync(request, crmId);
    }

    private static string GetIsAuthenticatedLogText(bool isAuthenticated) =>
        isAuthenticated ? "authenticated" : "unauthenticated";
}
using Person.API.MFA.Interfaces;
using Person.Attributes;
using Person.GraphQL.Types;
using Shared.Constants;
using Shared.Extensions;

namespace Person.GraphQL.TypeExtensions;

[ExtendObjectType(typeof(MatchedPerson))]
public sealed class MatchedPersonExtensions
{
    /// <summary>
    ///     Get OTP verification details for a matched
    ///     person for a unique MFA Journey Session Key.
    /// </summary>
    /// <param name="matchedPerson">Parent type</param>
    /// <param name="mfaService"></param>
    /// <param name="httpContextAccessor"></param>
    /// <param name="logger"></param>
    /// <param name="sessionKey">MFA Journey Session Key</param>
    /// <returns><see cref="OtpVerificationDetails"/> or null</returns>
    /// <exception cref="ArgumentException"></exception>
    [AuthorizeAzureAdPolicy]
    public async Task<OtpVerificationDetails?> GetOtpVerificationDetails(
        [Parent] MatchedPerson matchedPerson,
        [Service] IMfaService mfaService,
        IHttpContextAccessor httpContextAccessor,
        ILogger<MatchedPersonExtensions> logger,
        string sessionKey)
    {
        matchedPerson.PersonId.ThrowIfNullOrWhiteSpace(nameof(matchedPerson.PersonId));
        sessionKey.ThrowIfNullOrWhiteSpace(nameof(sessionKey));

        var correlationId = httpContextAccessor.HttpContext?.TryGetRequestHeaderValue(Headers.CorrelationId);

        logger.LogInformation(
            "MatchedPerson.GetOtpVerificationDetails mutation called with CorrelationID [{CorrelationId}] for matched person with CrmID [{PersonId}] and SessionKey [{SessionKey}]",
            correlationId, matchedPerson.PersonId, sessionKey);

        var response = await mfaService.GetOtpVerificationDetailsAsync(matchedPerson.PersonId, sessionKey);

        return response == null
            ? null
            : new OtpVerificationDetails
            {
                SessionKey = sessionKey,
                IsAuthenticated = response.IsAuthenticated,
                IsMobile = response.IsMobile,
                PhoneNumberSuffix = response.PhoneNumberSuffix
            };
    }
}
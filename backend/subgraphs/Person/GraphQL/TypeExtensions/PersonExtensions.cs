using Person.API.MFA.Interfaces;
using Person.Attributes;
using Person.GraphQL.Types;
using Shared.Constants;
using Shared.Extensions;

namespace Person.GraphQL.TypeExtensions;

[ExtendObjectType(typeof(Types.Person))]
public sealed class PersonExtensions
{
    /// <summary>
    ///     Get OTP verification details for a logged-in
    ///     person for a unique MFA Journey Session Key.
    /// </summary>
    /// <param name="person">Parent type</param>
    /// <param name="mfaService"></param>
    /// <param name="httpContextAccessor"></param>
    /// <param name="logger"></param>
    /// <param name="sessionKey">MFA Journey Session Key</param>
    /// <returns><see cref="OtpVerificationDetails"/> or null</returns>
    /// <exception cref="ArgumentException"></exception>
    [AuthorizeAzureAdB2CPolicy]
    public async Task<OtpVerificationDetails?> GetOtpVerificationDetails(
        [Parent] Types.Person person,
        [Service] IMfaService mfaService,
        IHttpContextAccessor httpContextAccessor,
        ILogger<PersonExtensions> logger,
        string sessionKey)
    {
        person.PersonId.ThrowIfNullOrWhiteSpace(nameof(person.PersonId));
        sessionKey.ThrowIfNullOrWhiteSpace(nameof(sessionKey));

        var correlationId = httpContextAccessor.HttpContext?.TryGetRequestHeaderValue(Headers.CorrelationId);

        logger.LogInformation(
            "Person.GetOtpVerificationDetails mutation called with CorrelationID [{CorrelationId}] for logged-in person with CrmID [{PersonId}] and SessionKey [{SessionKey}]",
            correlationId, person.PersonId, sessionKey);

        var response = await mfaService.GetOtpVerificationDetailsAsync(person.PersonId, sessionKey);

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
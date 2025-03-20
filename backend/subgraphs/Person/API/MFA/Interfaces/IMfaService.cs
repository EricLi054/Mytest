using Person.API.MFA.Models;
using Person.GraphQL.Enums;
using Shared.Exceptions;
using System.Text.Json;

namespace Person.API.MFA.Interfaces;

/// <summary>
///     Service for handling MFA operations for logged in members and
///     members in the process of registering for a myRAC account.
/// </summary>
/// <remarks>
/// <para>
///     The shared MFA/OTP service that is being used was originally built by/for Insurance,
///     but has since been adopted across the RAC organisation.
/// </para>
/// <para>
///     The naming of that service is a bit inconsistent,
///     but the original intent is that it is an MFA service as it
///     would handle all aspects of MFA (which OTP is part of),
///     but it is not strictly OTP only.
/// </para>
/// <list type="bullet">
///     <item><seealso href="https://github.com/racwa/raci-otp-service"/></item>
///     <item><seealso href="https://rac-wa.atlassian.net/wiki/spaces/INT/pages/2746712125/RACI+OTP+Gateway+API"/></item>
///     <item><seealso href="https://rac-wa.atlassian.net/wiki/spaces/PDP/pages/3182297202/Multi-Factor+Authentication+MFA"/></item>
/// </list>
/// </remarks>
public interface IMfaService
{
    /// <summary>
    ///     Get member's OTP verification details.
    /// </summary>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <returns><see cref="OtpVerificationDetailsResponse"/> or null</returns>
    /// <exception cref="ArgumentException"></exception>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="Exception"></exception>
    /// <exception cref="HttpRequestException"></exception>
    /// 
    /// <exception cref="JsonException"></exception>
    /// <exception cref="NotFoundException"></exception>
    Task<OtpVerificationDetailsResponse?> GetOtpVerificationDetailsAsync(string crmId, string key);

    /// <summary>
    ///     Sends an OTP code to the member's device.
    /// </summary>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="channel">Channel OTP will be sent via</param>
    /// <returns><see cref="SendOtpResponse"/> or null</returns>
    /// <exception cref="ArgumentException"></exception>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="Exception"></exception>
    /// <exception cref="HttpRequestException"></exception>
    /// <exception cref="InternalServerException"></exception>
    /// <exception cref="JsonException"></exception>
    /// <exception cref="NotFoundException"></exception>
    /// <exception cref="TooManyRequestsException"></exception>
    Task<SendOtpResponse?> SendOtpAsync(string crmId, string key, OtpChannel channel);

    /// <summary>
    ///     Verifies an OTP code entered by the member against the one sent to their device.
    /// </summary>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <param name="code">OTP verification code</param>
    /// <returns><see cref="VerifyOtpResponse"/> or null</returns>
    /// <exception cref="ArgumentException"></exception>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="Exception"></exception>
    /// <exception cref="HttpRequestException"></exception>
    /// <exception cref="InternalServerException"></exception>
    /// <exception cref="JsonException"></exception>
    /// <exception cref="NotFoundException"></exception>
    /// <exception cref="TooManyRequestsException"></exception>
    Task<VerifyOtpResponse?> VerifyOtpAsync(string crmId, string key, string code);

    /// <summary>
    ///     Check if an OTP session for the member is still alive.
    /// </summary>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <param name="key">Unique MFA Journey session key</param>
    /// <returns><see cref="CheckOtpResponse"/> or null</returns>
    /// <exception cref="ArgumentException"></exception>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="Exception"></exception>
    /// <exception cref="HttpRequestException"></exception>
    Task<CheckOtpResponse?> CheckOtpAsync(string crmId, string key);

    /// <summary>
    ///     Check health status of the MFA service.
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns>bool</returns>
    /// <exception cref="ArgumentException"></exception>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="Exception"></exception>
    /// <exception cref="HttpRequestException"></exception>
    /// <exception cref="JsonException"></exception>
    Task<bool> GetHealthStatusAsync(CancellationToken cancellationToken = new());
}
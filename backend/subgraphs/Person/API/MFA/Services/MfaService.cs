using Microsoft.Net.Http.Headers;
using Person.API.MFA.Interfaces;
using Person.API.MFA.Models;
using Person.GraphQL.Enums;
using Shared.Exceptions;
using Shared.Extensions;
using System.Net;
using System.Text.Json;
using static Person.Constants;
using static Shared.Constants.Headers;
using static Shared.Extensions.HttpClientExtensions;

namespace Person.API.MFA.Services;

/// <inheritdoc cref="IMfaService"/>
public class MfaService : IMfaService
{
    private const string ServiceName = nameof(MfaService);

    /// <summary>
    /// NPE header for RACI MFA OTP service to enable OTP
    /// verification bypass using default OTP code 000000.
    /// </summary>
    private const string BypassOtpNpeHeader = "Feature_BypassOtp";

    /// <summary>
    /// NPE header for RACI MFA OTP service to enable
    /// overriding the default Mailosaur test mobile
    /// number that all OTP codes are sent to.
    /// </summary>
    private const string OverrideToNumberNpeHeader = "Feature_OverrideToNumber";

    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<MfaService> _logger;

    private readonly string _apimBaseUrl;
    private readonly string _mfaEndpoint;

    public MfaService(HttpClient httpClient, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILogger<MfaService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        _apimBaseUrl = _configuration[ConfigurationKeys.Apim.BaseUrl]
                       ?? throw new ArgumentException($"{ConfigurationKeys.Apim.BaseUrl} configuration is missing or empty.", nameof(_configuration));
        _mfaEndpoint = _configuration[ConfigurationKeys.Apim.MfaApiEndpoint]
                       ?? throw new ArgumentException($"{ConfigurationKeys.Apim.MfaApiEndpoint} configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<OtpVerificationDetailsResponse?> GetOtpVerificationDetailsAsync(string crmId, string key)
    {
        crmId.ThrowIfNullOrWhiteSpace(nameof(crmId));
        key.ThrowIfNullOrWhiteSpace(nameof(key));

        var uri = $"{_mfaEndpoint}/otp/verify-details";
        var jsonContent = JsonSerializer.Serialize(new OtpVerificationDetailsRequest { Key = key });
        var request = CreateInvokeMethodRequest(HttpMethod.Post, _apimBaseUrl, uri, jsonContent);
        request.AddRequestHeaders(_httpContextAccessor, _configuration);
        request.AddRequestHeaders((RacwaCrmId, crmId));
        AddNonProductionEnvironmentHeaders(request);
        AddUserAgentHeader(request);

        _logger.LogInformation(
            "[{ServiceName}] Getting OTP VerificationDetails for CrmID [{CrmId}] and Key [{Key}] with CorrelationID [{CorrelationID}]",
            ServiceName, crmId, key, request.TryGetHeaderValue(CorrelationId));

        return await _httpClient.SendRequestAsync<OtpVerificationDetailsResponse>(request, crmId, _logger);
    }

    public async Task<SendOtpResponse?> SendOtpAsync(string crmId, string key, OtpChannel channel)
    {
        crmId.ThrowIfNullOrWhiteSpace(nameof(crmId));
        key.ThrowIfNullOrWhiteSpace(nameof(key));

        var uri = $"{_mfaEndpoint}/otp/send";
        var jsonContent = JsonSerializer.Serialize(new SendOtpRequest { Key = key, Channel = channel });
        var request = CreateInvokeMethodRequest(HttpMethod.Post, _apimBaseUrl, uri, jsonContent);
        request.AddRequestHeaders(_httpContextAccessor, _configuration);
        request.AddRequestHeaders((RacwaCrmId, crmId));
        AddNonProductionEnvironmentHeaders(request);
        AddUserAgentHeader(request);

        var correlationId = request.TryGetHeaderValue(CorrelationId);

        try
        {
            _logger.LogInformation(
                "[{ServiceName}] Sending OTP via Channel [{Channel}] for CrmID [{CrmId}] and Key [{Key}] with CorrelationID [{CorrelationID}]",
                ServiceName, channel, crmId, key, correlationId);

            return await _httpClient.SendRequestAsync<SendOtpResponse>(request, crmId, _logger);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            _logger.LogError(ex,
                "[{ServiceName}] Send OTP failed for CorrelationId [{CorrelationId}] due to {ExceptionName}: {ExceptionMessage}", 
                ServiceName, correlationId, nameof(NotFoundException), ex.Message);
            throw new NotFoundException(ex.Message);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.TooManyRequests)
        {
            _logger.LogError(ex,
                "[{ServiceName}] Send OTP failed for CorrelationId [{CorrelationId}] due to {ExceptionName}: {ExceptionMessage}",
                ServiceName, correlationId, nameof(TooManyRequestsException), ex.Message);
            throw new TooManyRequestsException(ex.Message);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(ex,
                "[{ServiceName}] Send OTP failed for CorrelationId [{CorrelationId}] due to {ExceptionName}: {ExceptionMessage}",
                ServiceName, correlationId, nameof(InternalServerException), ex.Message);
            throw new InternalServerException(ex.Message);
        }
    }

    public async Task<VerifyOtpResponse?> VerifyOtpAsync(string crmId, string key, string code)
    {
        crmId.ThrowIfNullOrWhiteSpace(nameof(crmId));
        key.ThrowIfNullOrWhiteSpace(nameof(key));
        code.ThrowIfNullOrWhiteSpace(nameof(code));

        var uri = $"{_mfaEndpoint}/otp/verify";
        var jsonContent = JsonSerializer.Serialize(new VerifyOtpRequest { Key = key, Code = code });
        var request = CreateInvokeMethodRequest(HttpMethod.Post, _apimBaseUrl, uri, jsonContent);
        request.AddRequestHeaders(_httpContextAccessor, _configuration);
        request.AddRequestHeaders((RacwaCrmId, crmId));
        AddNonProductionEnvironmentHeaders(request);
        AddUserAgentHeader(request);

        var correlationId = request.TryGetHeaderValue(CorrelationId);

        try
        {
            _logger.LogInformation(
                "[{ServiceName}] Verifying OTP for CrmID [{CrmId}] and Key [{Key}] with CorrelationID [{CorrelationID}]",
                ServiceName, crmId, key, correlationId);

            return await _httpClient.SendRequestAsync<VerifyOtpResponse>(request, crmId, _logger);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            _logger.LogError(ex,
                "[{ServiceName}] Verify OTP failed for CorrelationId [{CorrelationId}] due to {ExceptionName}: {ExceptionMessage}",
                ServiceName, correlationId, nameof(NotFoundException), ex.Message);
            throw new NotFoundException(ex.Message);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.TooManyRequests)
        {
            _logger.LogError(ex,
                "[{ServiceName}] Verify OTP failed for CorrelationId [{CorrelationId}] due to {ExceptionName}: {ExceptionMessage}",
                ServiceName, correlationId, nameof(TooManyRequestsException), ex.Message);
            throw new TooManyRequestsException(ex.Message);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(ex,
                "[{ServiceName}] Verify OTP failed for CorrelationId [{CorrelationId}] due to {ExceptionName}: {ExceptionMessage}",
                ServiceName, correlationId, nameof(InternalServerException), ex.Message);
            throw new InternalServerException(ex.Message);
        }
    }

    public async Task<CheckOtpResponse?> CheckOtpAsync(string crmId, string key)
    {
        crmId.ThrowIfNullOrWhiteSpace(nameof(crmId));
        key.ThrowIfNullOrWhiteSpace(nameof(key));

        var uri = $"{_mfaEndpoint}/otp/check";
        var jsonContent = JsonSerializer.Serialize(new CheckOtpRequest { CrmId = crmId, Key = key });
        var request = CreateInvokeMethodRequest(HttpMethod.Post, _apimBaseUrl, uri, jsonContent);
        request.AddRequestHeaders(_httpContextAccessor, _configuration);
        request.AddRequestHeaders((RacwaCrmId, crmId));
        AddNonProductionEnvironmentHeaders(request);
        // AddUserAgentHeader(request); // TODO - DED-1296 - Does the UserAgent header need to be set here? RACI OTP Service CheckOtpRequestHandler has detectUnauthorisedAccess set to false

        var correlationId = request.TryGetHeaderValue(CorrelationId);

        try
        {
            _logger.LogInformation(
                "[{ServiceName}] Checking OTP for CrmID [{CrmId}] and Key [{Key}] with CorrelationID [{CorrelationID}]",
                ServiceName, crmId, key, correlationId);

            var result = await _httpClient.SendAsync(request);

            _logger.LogInformation(
                "[{ServiceName}] Check OTP response status code for CrmID [{CrmId}] and Key [{Key}] with CorrelationID [{CorrelationID}]: {StatusCode}",
                ServiceName, crmId, key, correlationId, result.StatusCode);

            return new CheckOtpResponse
            {
                IsAuthenticated = result.StatusCode == HttpStatusCode.NoContent
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex,
                "[{ServiceName}] HTTP request error while fetching entity for CrmID [{CrmId}] with CorrelationID [{CorrelationID}]",
                ServiceName, crmId, correlationId);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "[{ServiceName}] An unexpected error occurred while fetching entity for CrmID [{CrmId}] with CorrelationID [{CorrelationID}]",
                ServiceName,  crmId, correlationId);
            throw;
        }
    }

    public async Task<bool> GetHealthStatusAsync(CancellationToken cancellationToken = new())
    {
        var uri = $"{_mfaEndpoint}/health/status";
        var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
        request.AddRequestHeadersForHealthChecks(_httpContextAccessor, _configuration, DefaultSourceSystem);

        var correlationId = request.TryGetHeaderValue(CorrelationId);

        try
        {
            _logger.LogInformation(
                "[{ServiceName}] Calling health check with CorrelationID [{CorrelationID}]",
                ServiceName, correlationId);

            var response = await _httpClient.SendAsync(request, cancellationToken);

            _logger.LogInformation(
                "[{ServiceName}] Health check response status code for CorrelationID [{CorrelationID}]: {StatusCode}",
                ServiceName, correlationId, response.StatusCode);

            var isAlive = response.StatusCode is HttpStatusCode.NoContent or HttpStatusCode.OK;

            _logger.LogInformation(
                "[{ServiceName}] Service is alive for CorrelationID [{CorrelationID}]: {IsAlive}",
                ServiceName, correlationId, isAlive);

            return isAlive;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex,
                "[{ServiceName}] HTTP request error while calling health check with CorrelationID [{CorrelationID}]",
                ServiceName, correlationId);
            throw;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex,
                "[{ServiceName}] JSON deserialization error while calling health check with CorrelationID [{CorrelationID}]",
                ServiceName, correlationId);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "[{ServiceName}] An unexpected error occurred while calling health check with CorrelationID [{CorrelationID}]",
                ServiceName, correlationId);
            throw;
        }
    }

    /// <summary>
    /// UserAgent header is used by the RACI MFA OTP Service as an
    /// additional security check to detect unauthorized access to
    /// ensure that the device that requested the OTP code is the
    /// same as the device that tried to verify the OTP code.
    /// </summary>
    /// <remarks>
    /// TODO - DED-1296 - What happens if User-Agent is undefined from frontend? RACI MFA OTP Service will error on verify. Should an exception be thrown here?
    /// </remarks>
    private void AddUserAgentHeader(HttpRequestMessage request)
    {
        var userAgent = _httpContextAccessor.HttpContext?.Request.Headers[HeaderNames.UserAgent].ToString();
        if (!string.IsNullOrWhiteSpace(userAgent))
        {
            request.Headers.Add(HeaderNames.UserAgent, userAgent);
        }
    }

    /// <summary>
    /// Apply RACI MFA OTP Service NPE headers if environment is not PROD.
    /// </summary>
    /// <remarks>
    /// RACI MFA OTP Service allows <see cref="BypassOtpNpeHeader"/>
    /// and <see cref="OverrideToNumberNpeHeader"/> to be set
    /// in all Non-PROD environments, including UAT.
    /// See decision log item
    /// <see href="https://rac-wa.atlassian.net/wiki/spaces/PDP/pages/4034822228">
    /// Should UAT be allowed to set the RACI MFA OTP NPE Feature Toggles to bypass OTP and set the override number?
    /// </see> for more details.
    /// </remarks>
    private void AddNonProductionEnvironmentHeaders(HttpRequestMessage request)
    {
        var env = Environment.GetEnvironmentVariable(Shared.Constants.Environments.Key)?.ToLower();
        if (env != Shared.Constants.Environments.Name.Prd)
        {
            var bypassOtp = _httpContextAccessor.HttpContext?.Request.Headers[BypassOtpNpeHeader].ToString();
            if (!string.IsNullOrWhiteSpace(bypassOtp))
            {
                request.Headers.Add(BypassOtpNpeHeader, bypassOtp);
            }

            var overrideToNumber = _httpContextAccessor.HttpContext?.Request.Headers[OverrideToNumberNpeHeader].ToString();
            if (!string.IsNullOrWhiteSpace(overrideToNumber))
            {
                request.Headers.Add(OverrideToNumberNpeHeader, overrideToNumber);
            }
        }
    }
}
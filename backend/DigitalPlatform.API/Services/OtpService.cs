using System.Net;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.Otp;

namespace DigitalPlatform.API.Services
{
    public class OtpService(IDaprService daprService, IConfiguration configuration, ILogger<OtpService> logger, IFeatureService featureService) : IOtpService
    {
        private bool CheckIsNPEEnvironment()
        {
            var currentOtpUrlString = configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint;
            var currentOtpUrl = new Uri(currentOtpUrlString);
            return OtpConfigs.allowedUrls.Contains(currentOtpUrl);
        }
        private Dictionary<string, string> GetHeaders()
        {
            var otpOverrideNumber = configuration[ConfigDescriptors.OTP_API_OVERRIDE_NUMBER] ?? "";
            var otpHeaders = new Dictionary<string, string> { { "User-Agent", "DigitalPlatform.API/1.0" } };

            if (featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass) && CheckIsNPEEnvironment())
            {
                otpHeaders.Add(OtpConfigs.bypassOtpHeaderKey, "true");
                logger.LogInformation("MFA: OTP Bypass Enabled");
            }

            if (!string.IsNullOrEmpty(otpOverrideNumber) && CheckIsNPEEnvironment())
            {
                otpHeaders.Add(OtpConfigs.overrideNumberOtpHeaderKey, otpOverrideNumber);
                logger.LogInformation("MFA: Override Number Enabled");
            }

            return otpHeaders;
        }

        public async Task<SendOtpResponse> SendOtpAsync(SendOtpRequest request)
        {
            try
            {
                var endpoint = configuration[ConfigDescriptors.OTP_API_SEND_OTP_URL] ?? "";
                var url = configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint;

                return await daprService.InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(url, endpoint, request, GetHeaders());
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        public async Task<VerifyOtpResponse> VerifyOtpAsync(VerifyOtpRequest request)
        {
            try
            {
                var endpoint = configuration[ConfigDescriptors.OTP_API_VERIFY_OTP_URL] ?? "";
                var url = configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint;
                return await daprService.InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(url, endpoint, request, GetHeaders());
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        public async Task<CheckOtpQueryResponse> CheckOtpAsync(CheckOtpRequest request)
        {
            try
            {
                var endpoint = configuration[ConfigDescriptors.OTP_API_CHECK_OTP_URL] ?? "";
                var url = configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint;
                _ = await daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(url, endpoint, request, GetHeaders());

                return new CheckOtpQueryResponse { IsVerified = true };
            }
            catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.Unauthorized)
            {
                logger.LogError(ex, ex.Message);
                return new CheckOtpQueryResponse { IsVerified = false };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

    }
}

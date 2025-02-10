using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.Insurance;

namespace DigitalPlatform.API.Services
{
    public class InsuranceService(IDaprService daprService, IConfiguration configuration, ILogger<InsuranceService> logger) : IInsuranceService
    {
        private Dictionary<string, string> InsuranceCustomHeaders()
        {
            var customHeaders = new Dictionary<string, string>
            {
                { configuration[ConfigDescriptors.INSURANCE_API_ENVIRONMENT_HEADER_KEY] ?? "", configuration[ConfigDescriptors.INSURANCE_API_ENVIRONMENT] ?? "" }
            };
            return customHeaders;
        }

        public async Task<InsurancePortfolioSummary> GetPortfolioSummary(string shieldContactNumber)
        {
            try
            {
                string query = $"?contactId={shieldContactNumber}";
                string endpoint = configuration[ConfigDescriptors.INSURANCE_API_GET_PORTFOLIO_SUMMARY_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<InsurancePortfolioSummary>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{query}", InsuranceCustomHeaders());
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        public async Task<Contact> GetContactByExternalShieldNumber(string externalShieldNumber)
        {
            try
            {
                string query = $"?externalNumber={externalShieldNumber}";
                string endpoint = configuration[ConfigDescriptors.INSURANCE_API_GET_CONTACTS_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<Contact>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{query}", InsuranceCustomHeaders());
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        public async Task<InsuranceProductResponse> GetInsurancePolicies(string policyNumber)
        {
            try
            {
                string query = $"?excludeInstallment=false";
                string endpoint = configuration[ConfigDescriptors.INSURANCE_API_GET_POLICY_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<InsuranceProductResponse>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{policyNumber}{query}", InsuranceCustomHeaders());
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }
    }
}

using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.Finance;

namespace DigitalPlatform.API.Services
{
    public class FinanceService(IDaprService daprService, IConfiguration configuration, ILogger<FinanceService> logger) : IFinanceService
    {
        public async Task<FinanceProductResponse> GetProductList(string rimId)
        {
            try
            {
                string query = $"?RIMNumber={rimId}&ServiceId={configuration[SecretDescriptors.FINANCE_SERVICE_ID]}&UserName={configuration[SecretDescriptors.FINANCE_USER_NAME]}&Organisation={configuration[SecretDescriptors.FINANCE_ORGANISATION]}";
                string endpoint = configuration[ConfigDescriptors.FINANCE_API_GET_PRODUCT_LIST_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<FinanceProductResponse>(
                    configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint,
                    $"{endpoint}{query}"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "{message}", "Error getting finance product list");
                throw;
            }
        }

        public async Task<List<FinanceQuote>> GetFinanceQuotes(string crmId)
        {
            try
            {
                string endpoint = configuration[ConfigDescriptors.PERSON_API_GET_FINANCE_QUOTES] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<List<FinanceQuote>>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, string.Format(endpoint, crmId));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "{message}", "Error getting finance quotes");
                throw;
            }
        }
    }
}

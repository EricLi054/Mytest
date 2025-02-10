using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.FinOps;

namespace DigitalPlatform.API.Services
{
    public class FinOpsService(IDaprService daprService, IConfiguration configuration, ILogger<FinOpsService> logger) : IFinOpsService
    {
        public async Task<List<Product>> GetProductList()
        {
            try
            {
                string endpoint = configuration[ConfigDescriptors.FINOPS_API_GET_PRODUCT_LIST_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<List<Product>>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, endpoint);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }


        public async Task<Product> GetProductDetail(string productId)
        {
            try
            {
                string endpoint = configuration[ConfigDescriptors.FINOPS_API_GET_PRODUCT_DETAIL_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<Product>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, string.Format(endpoint, productId));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        public async Task<List<FinOpsProductHolding>> GetProductHoldingList(string customerAccount, string companyId, string fromDate, string upn)
        {
            try
            {
                string query = $"?CustAccount={customerAccount}";

                if (!string.IsNullOrEmpty(companyId))
                {
                    query = query + $"&CompanyId={companyId}";
                }

                if (!string.IsNullOrEmpty(fromDate))
                {
                    query = query + $"&FromDate={fromDate}";
                }

                if (!string.IsNullOrEmpty(upn))
                {
                    query = query + $"&UPN={upn}";
                }
                string endpoint = configuration[ConfigDescriptors.FINOPS_API_GET_PRODUCT_HOLDING_LIST_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<List<FinOpsProductHolding>>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{query}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        public async Task<FinOpsProductHolding> GetProductHolding(string productHoldingHeaderId)
        {
            try
            {
                string endpoint = configuration[ConfigDescriptors.FINOPS_API_GET_PRODUCT_HOLDING_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<FinOpsProductHolding>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, string.Format(endpoint, productHoldingHeaderId));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }
    }
}

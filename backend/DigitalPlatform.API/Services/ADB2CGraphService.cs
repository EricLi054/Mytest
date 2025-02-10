using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.ADB2CGraph;

namespace DigitalPlatform.API.Services;

public class ADB2CGraphService(
    IDaprService daprService,
    IConfiguration configuration,
    ILogger<ADB2CGraphService> logger) : IADB2CGraphService
{
    public async Task<ADB2CAccount> GetUserByEmail(string emailAddress)
    {
        try
        {
            string endpoint = configuration[ConfigDescriptors.ADB2C_GRAPH_GET_BY_EMAIL_URL] ?? "";
            var url = configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint;
            var request = new ADB2CRequest
            {
                Email = emailAddress
            };

            var accounts = await daprService.InvokeDaprPostMethodAsync<ADB2CAccount[], ADB2CRequest>(url, endpoint, request);
            return accounts.FirstOrDefault() ?? new ADB2CAccount();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);
            throw;
        }
    }
}
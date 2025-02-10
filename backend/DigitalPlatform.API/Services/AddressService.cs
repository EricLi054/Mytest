using System.Net;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.Address;

namespace DigitalPlatform.API.Services
{
    public class AddressService(
        IDaprService daprService,
        IConfiguration configuration,
        ILogger<AddressService> logger) : IAddressService
    {
        public async Task<AddressLookup> GetGnafAddressListAsync(string partialAddress)
        {
            try
            {
                string endpoint = configuration[ConfigDescriptors.ADDRESS_MANAGEMENT_API_SEARCH_GNAF_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<AddressLookup>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, string.Format(endpoint, partialAddress));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        public async Task<AddressLookup> GetPafAddressListAsync(string partialAddress)
        {
            try
            {
                string endpoint = configuration[ConfigDescriptors.ADDRESS_MANAGEMENT_API_SEARCH_PAF_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<AddressLookup>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, string.Format(endpoint, partialAddress));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
            
        }

        public async Task<PAFVerification> GetPafAddressAsync(string moniker)
        {
            try
            {
                string endpoint = configuration[ConfigDescriptors.ADDRESS_MANAGEMENT_API_GET_PAF_URL] ?? "";
                return await daprService.InvokeDaprGetMethodAsync<PAFVerification>(configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, string.Format(endpoint, moniker), [], [HttpStatusCode.NotFound]);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }
    }
}

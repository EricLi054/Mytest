using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.MemberCards;

namespace DigitalPlatform.API.Services
{
    public class MemberCardsService(
        IDaprService daprService,
        IConfiguration configuration,
        ILogger<MemberCardsService> logger) : IMemberCardsService
    {
        public async Task<PhysicalCardResponse> CreatePhysicalCardRequestAsync(PhysicalCardRequest request)
        {
            try
            {
                var endpoint = configuration[ConfigDescriptors.MEMBER_CARDS_CREATE_PHYSICAL_CARD_REQUEST_URL] ?? "";
                var url = configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint;

                return await daprService.InvokeDaprPostMethodAsync<PhysicalCardResponse, PhysicalCardRequest>(url, endpoint, request);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        public async Task<DigitalCardDetailsResponse> RetrieveDigitalCardDetails(string crmId)
        {
            try
            {
                var endpoint = configuration[ConfigDescriptors.MEMBER_CARDS_RETRIEVE_DIGITAL_CARD_DETAILS_URL] ?? "";
                var url = configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint;

                return await daprService.InvokeDaprGetMethodAsync<DigitalCardDetailsResponse>(url, $"{endpoint}{crmId}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

    }
}

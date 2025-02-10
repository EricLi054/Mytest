using DigitalPlatform.API.Models.SourceSystem.MemberCards;

namespace DigitalPlatform.API.Interfaces
{
    public interface IMemberCardsService
    {
        Task<PhysicalCardResponse> CreatePhysicalCardRequestAsync(PhysicalCardRequest request);

        Task<DigitalCardDetailsResponse> RetrieveDigitalCardDetails(string crmId);
    }
}

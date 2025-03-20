using Membership.Types.MemberCards;

namespace Membership.Interfaces;

public interface IMemberCardService
{
    Task<PhysicalCardResponse?> CreatePhysicalCardRequestAsync(string crmId);

    Task<GraphQL.Types.DigitalCardDetails?> RetrieveDigitalCardDetailsAsync(string crmId);
}

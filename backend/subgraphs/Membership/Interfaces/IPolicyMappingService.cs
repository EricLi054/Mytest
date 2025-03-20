using Membership.Types.PolicyDetails;
using Membership.Types.Products.AnnuityProducts;

namespace Membership.Interfaces;

public interface IPolicyMappingService
{
    List<PolicyDetail> Map(IEnumerable<AnnuityProduct> memberProducts);
}
using Membership.Types.PolicyDetails;
using Membership.Types.Products.AnnuityProducts;

namespace Membership.PolicyMappers;

public interface IPolicyMapper
{
    public PolicyDetail? Map(AnnuityProduct product);
    public string Type { get; }
}
using Membership.Interfaces;
using Membership.PolicyMappers;
using Membership.Types.PolicyDetails;
using Membership.Types.Products.AnnuityProducts;

namespace Membership.Services;

/*
    TODO: This service will be refactored to move logic into the UI layer
*/
public class PolicyMappingService(
    IEnumerable<IPolicyMapper> mappers,
    ILogger<PolicyMappingService> logger) : IPolicyMappingService
{
    public List<PolicyDetail> Map(IEnumerable<AnnuityProduct> memberProducts)
    {
        var policyDetails = new List<PolicyDetail>();
        foreach (var product in memberProducts)
        {
            var mapper = GetMapper(product.BusinessType);
            if (mapper == null)
            {
                logger.LogError("No product mapper defined for {BusinessType}", product.BusinessType);
                continue;
            }

            var policyDetail = mapper.Map(product);
            if (policyDetail != null)
            {
                policyDetails.Add(policyDetail);
            }
        }

        return policyDetails;
    }

    private IPolicyMapper? GetMapper(string type)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(type);

        return mappers.FirstOrDefault(m => m.Type.Equals(type, StringComparison.OrdinalIgnoreCase));
    }
}
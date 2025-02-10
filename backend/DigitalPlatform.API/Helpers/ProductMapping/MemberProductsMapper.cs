using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using DigitalPlatform.API.Models.Products;

namespace DigitalPlatform.API.Helpers.ProductMapping;

public class MemberProductsMapper(IProductMapperRepository productMapperRepository, ILogger<MemberProductsMapper> logger) : IPolicyDetailsMapper
{
    private readonly IProductMapperRepository _productMapperRepository = productMapperRepository;
    private readonly ILogger<MemberProductsMapper> _logger = logger;

    public List<PolicyDetail> Map(MemberProducts memberProducts)
    {
        var policyDetails = new List<PolicyDetail>();
        foreach (var product in memberProducts.AnnuityProducts)
        {
            var mapper = _productMapperRepository.Get(product.BusinessType);
            if (mapper == null)
            {
                _logger.LogError($"No product mapper defined for {product.BusinessType}");
                continue;
            }

            var policyDetail = mapper.Map(product);
            if (policyDetail == null) continue;

            policyDetails.Add(policyDetail);
        }

        return policyDetails;
    }
}
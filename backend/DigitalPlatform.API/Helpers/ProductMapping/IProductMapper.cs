using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using DigitalPlatform.API.Models.Products.AnnuityProducts;

namespace DigitalPlatform.API.Helpers.ProductMapping;

public interface IProductMapper
{
    public PolicyDetail? Map(AnnuityProduct product);
    public string Type { get; }
}
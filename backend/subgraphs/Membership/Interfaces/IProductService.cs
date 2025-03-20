using Membership.Types.Products.AnnuityProducts;

namespace Membership.Interfaces;

public interface IProductService
{
    Task<MemberProducts> GetProductsAsync(string crmId, string sessionKey);
}
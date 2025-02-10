using DigitalPlatform.API.Models.SourceSystem.FinOps;

namespace DigitalPlatform.API.Interfaces
{
    public interface IFinOpsService
    {
        Task<List<Product>> GetProductList();
        Task<Product> GetProductDetail(string productId);
        Task<List<FinOpsProductHolding>> GetProductHoldingList(string customerAccount, string companyId = "", string fromDate = "", string upn = "");
        Task<FinOpsProductHolding> GetProductHolding(string productHoldingHeaderId);
    }
}

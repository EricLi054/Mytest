using Membership.Types.FinOps;

namespace Membership.Interfaces;

public interface IFinOpsService
{
    Task<List<ProductHolding>> GetProductHoldingListAsync(string customerAccount);
}
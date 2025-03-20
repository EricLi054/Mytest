using Membership.Types.Finance;

namespace Membership.Interfaces;

public interface IFinanceService
{
    Task<FinanceProductResponse?> GetProductListAsync(string rimId);
    Task<List<FinanceQuote>?> GetFinanceQuotesAsync(string crmId);
}
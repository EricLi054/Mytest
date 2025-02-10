using DigitalPlatform.API.Models.SourceSystem.Finance;

namespace DigitalPlatform.API.Interfaces
{
    public interface IFinanceService
    {
        Task<FinanceProductResponse> GetProductList(string rimId);
        Task<List<FinanceQuote>> GetFinanceQuotes(string crmId);
    }
}

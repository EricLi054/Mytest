namespace DigitalPlatform.API.Models.SourceSystem.Finance
{
    public class FinanceProductResponse
    {
        public string Success { get; set; } = string.Empty;
        public List<PartyProduct> PartyProductList { get; set; } = [];
    }
}
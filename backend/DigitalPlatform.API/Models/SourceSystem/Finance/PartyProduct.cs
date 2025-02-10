namespace DigitalPlatform.API.Models.SourceSystem.Finance
{
    public class PartyProduct
    {
        public string ProductType { get; set; } = string.Empty;
        public FinanceProduct FinanceProduct { get; set; } = default!;
    }
}
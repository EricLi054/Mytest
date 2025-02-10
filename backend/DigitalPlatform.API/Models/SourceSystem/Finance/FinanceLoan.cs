using Newtonsoft.Json;

namespace DigitalPlatform.API.Models.SourceSystem.Finance;
public class FinanceLoan
{
    public string AccountType { get; set; } = string.Empty;
    public string AccountTitle1 { get; set; } = string.Empty;
    public string AccountTitle2 { get; set; } = string.Empty;
    public int AccountNumber { get; set; }
    public double CurrentLimit { get; set; }
    public double CurrentBalance { get; set; }
    public double FinanceOverdueAmount { get; set; }
    public string FinanceProductType { get; set; } = string.Empty;
    [JsonProperty("FinanceProductSubTpe")]
    public string FinanceProductSubType { get; set; } = string.Empty;
    public double InterestRate { get; set; }
    public string InterestFrequency { get; set; } = string.Empty;
    public string ProjectAddress { get; set; } = string.Empty;
    public string ProjectAddress2 { get; set; } = string.Empty;
    public string LoanTerm { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
    public double LoanAmount { get; set; }
    public double NextInstalmentAmount { get; set; }
    public DateTime? NextInstalmentDate { get; set; }
    public DateTime? NextPayment { get; set; }
    public double Amount { get; set; }
    public DateTime? MaturityDate { get; set; }
}
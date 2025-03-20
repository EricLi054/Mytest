namespace Membership.Types.Finance;

public class FinanceQuote
{
    public string QuoteId { get; set; } = string.Empty;
    public string LoanType { get; set; } = string.Empty;
    public string LoanUse { get; set; } = string.Empty;
    public DateTime QuoteDate { get; set; }
    public decimal LoanAmount { get; set; }
    public bool Secured { get; set; }
    public int LoanTermYears { get; set; }
    public decimal InterestRate { get; set; }
    public string RepaymentFrequency { get; set; } = string.Empty;
    public decimal RepaymentAmount { get; set; }
    public string ContactFirstName { get; set; } = string.Empty;
    public string? CampaignCode { get; set; } = string.Empty;
    public string GapInsuranceOption { get; set; } = string.Empty;
    public string EmailAddress { get; set; } = string.Empty;
    public DateTime Expired { get; set; }
    public bool IsExpired => Expired < DateTime.Now;
    public string CCI { get; set; } = string.Empty;
    public bool ConvertedIntoApplication { get; set; }
}

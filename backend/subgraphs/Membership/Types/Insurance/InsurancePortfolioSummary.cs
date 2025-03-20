namespace Membership.Types.Insurance;

public class InsurancePortfolioSummary
{
    public int Id { get; set; }
    public List<PortfolioSummaryContact> Contacts { get; set; } = default!;
}

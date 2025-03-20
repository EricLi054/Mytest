namespace Membership.Types.Finance;

public class PartyProduct
{
    public string ProductType { get; set; } = string.Empty;
    public FinanceProduct FinanceProduct { get; set; } = default!;
}
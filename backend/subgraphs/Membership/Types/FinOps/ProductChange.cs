namespace Membership.Types.FinOps;

public class ProductChange
{
    public string ProductId { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public bool CanChangeProductHolding { get; set; }
    public string Reason { get; set; } = string.Empty;
}
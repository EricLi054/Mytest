namespace Membership.Types.FinOps;

public class ProductHoldingPaymentSchedule
{
    public string CompanyId { get; set; } = string.Empty;
    public double LineNum { get; set; }
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    public decimal RemainingAmount { get; set; }
    public string Posted { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
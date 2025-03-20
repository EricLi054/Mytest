namespace Membership.Types.FinOps;

public class ProductHoldingLine
{
    public required string CompanyId { get; set; }
    public string ProductHoldingId { get; set; } = string.Empty;
    public string OrigProductHoldingId { get; set; } = string.Empty;
    public int ProductHoldingVersion { get; set; }
    public string ProductId { get; set; } = string.Empty;
    public string RenewalProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? CancelDate { get; set; }
    public decimal Amount { get; set; }
    public VehicleDetail VehicleDetail { get; set; } = default!;
    public IEnumerable<ProductChange> ProductChanges { get; set; } = default!;
    public IEnumerable<ProductChange> RenewalProductChanges { get; set; } = default!;
}
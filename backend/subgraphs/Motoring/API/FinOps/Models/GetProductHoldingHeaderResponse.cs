namespace Motoring.API.FinOps.Models;

public record GetProductHoldingHeaderResponse
{
    public required bool IsSuccess { get; set; }
    public ProductHoldingHeader? Value { get; set; }
    public List<string>? Errors { get; set; }
}

public record ProductHoldingHeader
{
    public required string ProductHoldingHeaderId { get; set; }
    public required string CustAccount { get; set; }
    public required string Status { get; set; }
    public List<ProductHoldingLine>? ProductHoldingLines { get; set; }
}

public record ProductHoldingLine
{
    public required string ProductHoldingId { get; set; }
    public required int ProductHoldingVersion { get; set; }
    public required string ProductId { get; set; }
    public required bool CanUpdateVehicle { get; set; }
    public string? CanUpdateVehicleReason { get; set; }
    public VehicleDetail? VehicleDetail { get; set; }
}
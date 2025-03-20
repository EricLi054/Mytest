namespace Motoring.API.FinOps.Models;

public record UpdateRoadsideVehicleRequest
{
    public required string RacId { get; set; }
    public required string Email { get; set; }
    public required string ProductId { get; set; }
    public required string LineId { get; set; }
    public required GraphQL.Types.VehicleDetail NewVehicleDetail { get; set; }
}
using Motoring.GraphQL.Enums;

namespace Motoring.GraphQL.Types;

public record RoadsideProductLine
{
    public required string Id { get; set; }
    public required int Version { get; set; }
    public required RoadsideProductType ProductType { get; set; }
    public required bool CanUpdateVehicle { get; set; }
    public CanUpdateVehicleReason? CanUpdateVehicleReason { get; set; }
    public VehicleDetail? VehicleDetail { get; set; }
}


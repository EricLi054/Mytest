using Motoring.GraphQL.Enums;

public class VehicleByRegoQuery
{
    public VehicleType VehicleType { get; set; }
    public required string RegistrationNumber { get; set; }
    public State State { get; set; }
}
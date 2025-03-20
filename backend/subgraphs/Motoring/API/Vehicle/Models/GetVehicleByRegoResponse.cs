namespace Motoring.API.Vehicle.Models;

public record GetVehicleByRegoResponse
{
    public string? NVIC { get; set; }
    public required int Year { get; set; }
    public required string Make { get; set; }
    public required string Model { get; set; }
    public string? Variant { get; set; }
    public string? Series { get; set; }
    public string? Body { get; set; }
    public string? CC { get; set; }
    public string? Transmission { get; set; }
    public string? Engine { get; set; }
    public string? Cylinder { get; set; }
    public string? CO2Emission { get; set; }
    public string? VIN { get; set; }
    public string? Fuel { get; set; }
    public float? Height { get; set; }
    public float? Length { get; set; }
    public float? Width { get; set; }
    public float? KerbWeight { get; set; }
}
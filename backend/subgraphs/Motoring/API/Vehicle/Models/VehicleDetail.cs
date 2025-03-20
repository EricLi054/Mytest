namespace Motoring.API.Vehicle.Models;

public record VehicleDetail
{
    public int? Year { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public string? VIN { get; set; }
    public string? NVIC { get; set; }
    public string? Variant { get; set; }
    public string? Series { get; set; }
    public string? Body { get; set; }
    public string? Color { get; set; }
    public string? Engine { get; set; }
    public string? Transmission { get; set; }
    public string? Cylinder { get; set; }
    public string? CC { get; set; }
    public string? Fuel { get; set; }
    public string? CO2Emission { get; set; }
    public float? Height { get; set; }
    public float? Length { get; set; }
    public float? Width { get; set; }
    public float? KerbWeight { get; set; }
}
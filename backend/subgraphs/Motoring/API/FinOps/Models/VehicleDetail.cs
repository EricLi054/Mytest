using System.Text.Json.Serialization;

namespace Motoring.API.FinOps.Models;

public record VehicleDetail
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public VehicleType Type { get; set; }
    public required string RegistrationNumber { get; set; }
    public string? Year { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public string? VIN { get; set; }
    public string? NVIC { get; set; }
    public string? Variant { get; set; }
    public string? Series { get; set; }
    public string? BodyType { get; set; }
    public string? Color { get; set; }
    public string? Transmission { get; set; }
    public string? Cylinder { get; set; }
    public string? CC { get; set; }
    public string? FuelType { get; set; }
    public int? CO2Emission { get; set; }
    public float? Height { get; set; }
    public float? Length { get; set; }
    public float? Width { get; set; }
    public float? KerbWeight { get; set; }
}
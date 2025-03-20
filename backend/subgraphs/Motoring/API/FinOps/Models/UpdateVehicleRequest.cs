using System.Text.Json.Serialization;

namespace Motoring.API.FinOps.Models;

public record UpdateVehicleRequest
{
    public string CompanyId { get; } = Constants.FinOps.CompanyId;
    public required string UserId { get; set; }
    public required string ProductHoldingId { get; set; }
    public required int ProductHoldingVersion { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required ReasonCode ReasonCode { get; set; }

    public string Source { get; } = Constants.FinOps.Source;
    public required VehicleDetail VehicleDetail { get; set; }
}


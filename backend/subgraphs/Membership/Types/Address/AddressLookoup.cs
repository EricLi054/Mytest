using System.Text.Json.Serialization;

namespace Membership.Types.Address;
public class PAFVerification
{
    public PAFVerificationData? Data { get; set; } = default!;
    public PAFVerificationError[]? Errors { get; set; } = default!;
}

public class PAFVerificationData
{
    public string Type { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
    public PAFVerificationAttributes Attributes { get; set; } = default!;
}

public class PAFVerificationError
{
    public string Status { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
}


public class PAFVerificationAttributes
{
    [JsonPropertyName("verify-level")]
    public string? VerifyLevel { get; set; } = string.Empty;
    [JsonPropertyName("unit-type")]
    public string UnitType { get; set; } = string.Empty;
    [JsonPropertyName("unit")]
    public string Unit { get; set; } = string.Empty;
    [JsonPropertyName("building-number")]
    public string BuildingNumber { get; set; } = string.Empty;
    [JsonPropertyName("sub-building-number")]
    public string SubBuildingNumber { get; set; } = string.Empty;
    [JsonPropertyName("building-name")]
    public string BuildingName { get; set; } = string.Empty;
    [JsonPropertyName("building-name-2")]
    public string BuildingName2 { get; set; } = string.Empty;
    [JsonPropertyName("building-level-type")]
    public string BuildingLevelType { get; set; } = string.Empty;
    [JsonPropertyName("building-level-number")]
    public string BuildingLevelNumber { get; set; } = string.Empty;
    [JsonPropertyName("postal-delivery-types")]
    public string PostalDeliveryTypes { get; set; } = string.Empty;
    [JsonPropertyName("postal-delivery-number")]
    public string PostalDeliveryNumber { get; set; } = string.Empty;
    [JsonPropertyName("allotment-lot")]
    public string AllotmentLot { get; set; } = string.Empty;
    [JsonPropertyName("allotment-number")]
    public string AllotmentNumber { get; set; } = string.Empty;
    [JsonPropertyName("street-name")]
    public string StreetName { get; set; } = string.Empty;
    [JsonPropertyName("street-type")]
    public string StreetType { get; set; } = string.Empty;
    [JsonPropertyName("street-type-suffix")]
    public string StreetTypeSuffix { get; set; } = string.Empty;
    [JsonPropertyName("locality")]
    public string Locality { get; set; } = string.Empty;
    [JsonPropertyName("state-name")]
    public string StateName { get; set; } = string.Empty;
    [JsonPropertyName("state-code")]
    public string StateCode { get; set; } = string.Empty;
    [JsonPropertyName("postcode")]
    public string Postcode { get; set; } = string.Empty;
    [JsonPropertyName("country")]
    public string Country { get; set; } = string.Empty;
}
using Newtonsoft.Json;

namespace DigitalPlatform.API.Models.SourceSystem.Address
{
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
        [JsonProperty("verify-level")]
        public string? VerifyLevel { get; set; } = string.Empty;
        [JsonProperty("unit-type")]
        public string UnitType { get; set; } = string.Empty;
        [JsonProperty("unit")]
        public string Unit { get; set; } = string.Empty;
        [JsonProperty("building-number")]
        public string BuildingNumber { get; set; } = string.Empty;
        [JsonProperty("sub-building-number")]
        public string SubBuildingNumber { get; set; } = string.Empty;
        [JsonProperty("building-name")]
        public string BuildingName { get; set; } = string.Empty;
        [JsonProperty("building-name-2")]
        public string BuildingName2 { get; set; } = string.Empty;
        [JsonProperty("building-level-type")]
        public string BuildingLevelType { get; set; } = string.Empty;
        [JsonProperty("building-level-number")]
        public string BuildingLevelNumber { get; set; } = string.Empty;
        [JsonProperty("postal-delivery-types")]
        public string PostalDeliveryTypes { get; set; } = string.Empty;
        [JsonProperty("postal-delivery-number")]
        public string PostalDeliveryNumber { get; set; } = string.Empty;
        [JsonProperty("allotment-lot")]
        public string AllotmentLot { get; set; } = string.Empty;
        [JsonProperty("allotment-number")]
        public string AllotmentNumber { get; set; } = string.Empty;
        [JsonProperty("street-name")]
        public string StreetName { get; set; } = string.Empty;
        [JsonProperty("street-type")]
        public string StreetType { get; set; } = string.Empty;
        [JsonProperty("street-type-suffix")]
        public string StreetTypeSuffix { get; set; } = string.Empty;
        [JsonProperty("locality")]
        public string Locality { get; set; } = string.Empty;
        [JsonProperty("state-name")]
        public string StateName { get; set; } = string.Empty;
        [JsonProperty("state-code")]
        public string StateCode { get; set; } = string.Empty;
        [JsonProperty("postcode")]
        public string Postcode { get; set; } = string.Empty;
        [JsonProperty("country")]
        public string Country { get; set; } = string.Empty;
    }
}
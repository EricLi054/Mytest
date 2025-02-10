using Newtonsoft.Json;

namespace DigitalPlatform.API.Models.SourceSystem.Address
{
    public class AddressLookup
    {
        public AddressLookupMeta? Meta { get; set; } = default!;
        public AddressLookupData[]? Data { get; set; } = default!;
    }

    public class AddressLookupMeta
    {
        public int Count { get; set; }
    }

    public class AddressLookupData
    {
        public string Type { get; set; } = string.Empty;
        public string Id { get; set; } = string.Empty;
        public AddressLookupDataAttributes Attributes { get; set; } = default!;         
    }

    public class AddressLookupDataAttributes
    {
        [JsonProperty("partial-address")]
        public string PartialAddress { get; set; } = string.Empty;
        public string Picklist { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;    
        public string State { get; set; } = string.Empty;
        public string Score { get; set; } = string.Empty;     
    }
}

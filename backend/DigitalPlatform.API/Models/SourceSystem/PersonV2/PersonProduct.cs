namespace DigitalPlatform.API.Models.SourceSystem.PersonV2;

public class PersonProducts
{
    public List<PersonProductHolding> ProductHoldings { get; set; } = [];
}

public class PersonProductHolding
{
    public required Guid ProductId { get; set; }
    public required string SourceId { get; set; }
    public required string ProductBusinessType { get; set; }
    public string ProductStatus { get; set; } = string.Empty;
    public string ProductStatusReason { get; set; } = string.Empty;
    public string Product { get; set; } = string.Empty;
    public string ProductNumber { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}


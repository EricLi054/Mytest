namespace DigitalPlatform.API.Models.Data.Products.PolicyDetails;

public class Action
{
    public string? Type { get; set; }
    public required string Label { get; set; }
    public string? Link { get; set; }
    public required Analytics Analytics { get; set; }
    public List<SubAction> SubActions { get; set; } = [];
}
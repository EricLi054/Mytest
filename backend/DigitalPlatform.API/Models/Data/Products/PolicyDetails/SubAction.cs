namespace DigitalPlatform.API.Models.Data.Products.PolicyDetails;

public class SubAction
{
    public required string Label { get; set; }
    public string? SubLabel { get; set; }
    public string? Link { get; set; }
    public required Analytics Analytics { get; set; }
}
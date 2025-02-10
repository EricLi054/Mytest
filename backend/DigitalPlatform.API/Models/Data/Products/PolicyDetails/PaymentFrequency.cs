namespace DigitalPlatform.API.Models.Data.Products.PolicyDetails;

public class PaymentFrequency
{
    public required string Title { get; set; }
    public required string PreMessage { get; set; }
    public required string Frequency { get; set; }
    public required string Message { get; set; }
    public required string LinkText { get; set; }
    public required string Link { get; set; }
}
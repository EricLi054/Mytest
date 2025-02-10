namespace DigitalPlatform.API.Models.Data.Products.PolicyDetails;

public class PaymentMethod
{
    public required string Title { get; set; }
    public required string Type { get; set; }
    public required string Bsb { get; set; }
    public required string AccountNumber { get; set; }
    public required string CardNumber { get; set; }
    public required string CardExpiry { get; set; }
    public string? LinkText { get; set; }
    public string? Link { get; set; }
}
namespace DigitalPlatform.API.Models.Data.Products.PolicyDetails;

public class PolicyDetail
{
    public required string Type { get; set; }
    public required string Title { get; set; }
    public required string Subtitle { get; set; }
    public string? SubtitleSecondary { get; set; }
    public string? RegistrationNumber { get; set; }
    public required List<PolicyItem> PolicyItems { get; set; }
    public List<Alert>? Alerts { get; set; }
    public required List<Action> Actions { get; set; }
}
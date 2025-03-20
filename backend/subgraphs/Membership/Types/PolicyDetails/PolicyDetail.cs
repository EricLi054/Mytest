namespace Membership.Types.PolicyDetails;

// TODO: Will be moved to UI layer
public class PolicyDetail
{
    public required string Type { get; set; }
    public required string Title { get; set; }
    public required string Subtitle { get; set; }
    public string? SubtitleSecondary { get; set; } = string.Empty;
    public string? RegistrationNumber { get; set; } = string.Empty;
    public required List<PolicyItem> PolicyItems { get; set; }
    public List<Alert>? Alerts { get; set; }
    public required List<Action> Actions { get; set; }
}
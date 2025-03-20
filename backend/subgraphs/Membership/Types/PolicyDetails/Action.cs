namespace Membership.Types.PolicyDetails;

// TODO: Will be moved to UI layer
public class Action
{
    public string? Type { get; set; } = string.Empty;
    public required string Label { get; set; }
    public string? Link { get; set; } = string.Empty;
    public required Analytics Analytics { get; set; }
    public List<SubAction> SubActions { get; set; } = [];
}
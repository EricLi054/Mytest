namespace Membership.Types.PolicyDetails;

// TODO: Will be moved to UI layer
public class SubAction
{
    public required string Label { get; set; }
    public string? SubLabel { get; set; } = string.Empty;
    public string? Link { get; set; } = string.Empty;
    public required Analytics Analytics { get; set; }
}
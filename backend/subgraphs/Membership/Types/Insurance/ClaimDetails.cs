namespace Membership.Types.Insurance;

public class ClaimDetails
{
    public string ClaimNumber { get; set; } = string.Empty;
    public PolicyDetail PolicyDetails { get; set; } = default!;
}

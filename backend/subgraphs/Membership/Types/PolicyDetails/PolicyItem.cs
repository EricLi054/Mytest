namespace Membership.Types.PolicyDetails;

// TODO: Will be moved to UI layer
public class PolicyItem
{
    public required string Label { get; set; }
    public required string Value { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    public Tooltip? Tooltip { get; set; }
    public PaymentFrequency? PaymentFrequency { get; set; }
    public BundledAmount? BundledAmount { get; set; }
}

public class BundledProduct
{
    public required string ProductName { get; set; }
    public required string Asset { get; set; }
}

public class BundledAmount
{
    public required string Label { get; set; }
    public required string Title { get; set; }
    public required string Message { get; set; }
    public List<BundledProduct> BundledProducts { get; set; } = [];
}
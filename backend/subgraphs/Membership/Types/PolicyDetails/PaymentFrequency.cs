namespace Membership.Types.PolicyDetails;

// TODO: Will be moved to UI layer
public class PaymentFrequency
{
    public required string Title { get; set; }
    public required string PreMessage { get; set; }
    public required string Frequency { get; set; }
    public required string Message { get; set; }
    public required string LinkText { get; set; }
    public required string Link { get; set; }
}
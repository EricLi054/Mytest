namespace Membership.Types.Insurance;

public class PrivateEmail
{
    public string Address { get; set; } = string.Empty;
    public int Id { get; set; }
    public bool IsPreferredDeliveryMethod { get; set; }
}

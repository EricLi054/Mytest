namespace Membership.Types.Products;

public class SystemError
{
    public required string Message { get; set; }
    public SystemKey SystemKey { get; set; }
}

public enum SystemKey
{
    FinOps,
    Finance,
    Shield,
}
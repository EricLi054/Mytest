namespace Membership.Types.Products;

public class CTALink
{
    public string Label { get; set; } = string.Empty;
    public string? SubLabel { get; set; } = string.Empty;
    public string? Link { get; set; } = string.Empty;
    public bool IsDefaultAction { get; set; }
    public string? Colour { get; set; } = string.Empty;
    public List<CTALink>? SubActions { get; set; }
}
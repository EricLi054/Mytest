namespace DigitalPlatform.API.Models
{
    public class CTALink
    {
        public string Label { get; set; } = string.Empty;
        public string? SubLabel { get; set; }
        public string? Link { get; set; }
        public bool IsDefaultAction { get; set; }
        public string? Colour { get; set; }
        public List<CTALink>? SubActions { get; set; }
    }
}

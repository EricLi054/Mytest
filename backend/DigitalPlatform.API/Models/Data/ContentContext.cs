using DigitalPlatform.API.Models.Products;
using DigitalPlatform.API.Models.Data.Person;

public class ContentContext
{
    public string Time { get; set; } = string.Empty;
    public Person Person { get; set; } = default!;
    public MemberProducts MemberProducts { get; set; } = default!;
    public string LoginEmail { get; set; } = string.Empty;
    public string B2CUrl { get; set; } = string.Empty;
}
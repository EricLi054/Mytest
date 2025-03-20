namespace Membership.Types.Insurance;

public class HomeAsset : Asset
{
    public string HouseNumber { get; set; } = string.Empty;
    public string StreetName { get; set; } = string.Empty;
    public string Suburb { get; set; } = string.Empty;
}

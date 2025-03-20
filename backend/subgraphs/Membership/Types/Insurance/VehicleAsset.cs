namespace Membership.Types.Insurance;

public class VehicleAsset : Asset
{
    public string ModelDescription { get; set; } = string.Empty;
    public int Year { get; set; }
    public string RegistrationNumber { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
}

namespace Membership.Types.Insurance;

public class PetAsset : Asset
{
    public string PetType { get; set; } = string.Empty;
    public string PetBreed { get; set; } = string.Empty;
    public string PetName { get; set; } = string.Empty;
}

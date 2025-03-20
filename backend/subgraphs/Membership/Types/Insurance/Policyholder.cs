namespace Membership.Types.Insurance;

public class Policyholder
{
    public int UpdateVersion { get; set; }
    public string ContactExternalNumber { get; set; } = string.Empty;
    public int Id { get; set; }
}

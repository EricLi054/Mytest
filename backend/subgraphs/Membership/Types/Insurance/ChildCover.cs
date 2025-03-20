namespace Membership.Types.Insurance;

public class ChildCover
{
    public int UpdateVersion { get; set; }
    public string CoverType { get; set; } = string.Empty;
    public double SumInsured { get; set; }
    public int Id { get; set; }
}

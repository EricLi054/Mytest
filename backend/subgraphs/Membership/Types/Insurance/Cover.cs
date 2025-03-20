namespace Membership.Types.Insurance;

public class Cover
{
    public string CoverTypeDescription { get; set; } = string.Empty;
    public double StandardExcess { get; set; }
    public int UpdateVersion { get; set; }
    public string CoverType { get; set; } = string.Empty;
    public double SumInsured { get; set; }
    public List<ChildCover> ChildCovers { get; set; } = default!;
    public int Id { get; set; }
}

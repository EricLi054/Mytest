using Membership.Util;
using Shared.Util;
using System.Text.Json.Serialization;

namespace Membership.Types.Insurance;

public class PolicyDetail
{
    public double OverdueAmount { get; set; }
    public int UpdateVersion { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime PolicyStartDate { get; set; }
    public List<Cover> Cover { get; set; } = default!;
    public PolicyType PolicyType { get; set; } = default!;
    public int Id { get; set; }
    public BoatAsset? BoatAsset { get; set; } = default!;
    public VehicleAsset? MotorAsset { get; set; } = default!;
    public PetAsset? PetAsset { get; set; } = default!;
    public VehicleAsset? CaravanAsset { get; set; } = default!;
    public VehicleAsset? MotorcycleAsset { get; set; } = default!;
    public VehicleAsset? ElectricMobilityAsset { get; set; } = default!;
    public HomeAsset? HomeAsset { get; set; } = default!;
}

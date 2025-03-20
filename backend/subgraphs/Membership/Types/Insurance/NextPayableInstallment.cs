using Membership.Util;
using Shared.Util;
using System.Text.Json.Serialization;

namespace Membership.Types.Insurance;

public class NextPayableInstallment
{
    public int InstallmentNumber { get; set; }
    public double OutstandingAmount { get; set; }
    public int Id { get; set; }
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime CollectionDate { get; set; }
}

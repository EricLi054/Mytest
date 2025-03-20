using Membership.Util;
using Shared.Util;
using System.Text.Json.Serialization;

namespace Membership.Types.Insurance;

public class Installment
{
    public int InstallmentNumber { get; set; }
    public Amount Amount { get; set; } = default!;
    public string Origin { get; set; } = string.Empty;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime DueDate { get; set; }
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime CollectionDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

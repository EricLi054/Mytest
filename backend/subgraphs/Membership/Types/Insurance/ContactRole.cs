using Membership.Util;
using Shared.Util;
using System.Text.Json.Serialization;

namespace Membership.Types.Insurance;

public class ContactRole
{
    public string ExternalCode { get; set; } = string.Empty;
    public int Id { get; set; }
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime EffectiveDate { get; set; }
}

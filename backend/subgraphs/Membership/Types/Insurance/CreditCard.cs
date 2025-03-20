using Membership.Util;
using Shared.Util;
using System.Text.Json.Serialization;

namespace Membership.Types.Insurance;

public class CreditCard : PaymentMethod
{
    public bool IsTemporaryCard { get; set; }
    public string DiscontinueDate { get; set; } = string.Empty;
    public string CardholderName { get; set; } = string.Empty;
    public string CardType { get; set; } = string.Empty;
    public int Id { get; set; }
    public string CardNumber { get; set; } = string.Empty;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime CardExpiryDate { get; set; }
}

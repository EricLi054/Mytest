namespace Membership.Types.Insurance;

public class MailingAddress
{
    public string Country { get; set; } = string.Empty;
    public int UpdateVersion { get; set; }
    public string HouseNumber { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public string DeliveryPointId { get; set; } = string.Empty;
    public string StreetName { get; set; } = string.Empty;
    public string Suburb { get; set; } = string.Empty;
    public int Id { get; set; }
    public string State { get; set; } = string.Empty;
    public bool IsPreferredDeliveryMethod { get; set; }
    public string Remarks { get; set; } = string.Empty;
    public bool IsAddressValidated { get; set; }
}

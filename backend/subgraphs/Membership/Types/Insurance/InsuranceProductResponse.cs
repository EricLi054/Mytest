using Membership.Util;
using Shared.Util;
using System.Text.Json.Serialization;

namespace Membership.Types.Insurance;

public class InsuranceProductResponse
{
    public Amount AnnualPremium { get; set; } = default!;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime EndorsementStartDate { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime ProposalValidDate { get; set; }
    public string PaymentFrequency { get; set; } = string.Empty;
    public bool IsPaidInFull { get; set; }
    public NextPayableInstallment NextPayableInstallment { get; set; } = default!;
    public List<Installment> Installments { get; set; } = default!;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime EndorsementEndDate { get; set; }
    public int Id { get; set; }
    public bool HasProposalForRenewal { get; set; }
    public int EndorsementNumber { get; set; }
    public string LobId { get; set; } = string.Empty;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime StatusRenewalDate { get; set; }
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime PolicyEndDate { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ProductVersionId { get; set; } = string.Empty;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime UpdateDate { get; set; }
    public Policyholder Policyholder { get; set; } = default!;
    public Amount TotalInstallmentPremium { get; set; } = default!;
    public bool HasIrregularities { get; set; }
    public string CurrentInsurer { get; set; } = string.Empty;
    public string EndorsementType { get; set; } = string.Empty;
    public string OriginalChannel { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public List<Cover> Covers { get; set; } = default!;
    public string ProductVersionLobId { get; set; } = string.Empty;
    public Amount PremiumForCollection { get; set; } = default!;
    public bool CustomerConsent { get; set; }
    public bool IsNewRisk { get; set; }
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime PolicyStartDate { get; set; }
    public string BankAccountExternalNumber { get; set; } = string.Empty;
    [JsonConverter(typeof(ShieldDateTimeConverter))]
    public DateTime RenewalDate { get; set; }
    public string DiscountGroup { get; set; } = string.Empty;
}

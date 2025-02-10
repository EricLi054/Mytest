namespace DigitalPlatform.API.Models.SourceSystem.Insurance
{
    public class InurancePaymentType
    {
        public const string AnnualCash = "1";
        public const string CreditCardDD = "4";
        public const string BankAccountDD = "DD";
    }

    public class InsurancePortfolioSummary
    {
        public int Id { get; set; }
        public List<PortfolioSummaryContact> Contacts { get; set; } = default!;
    }

    public class PolicyType
    {
        public string Description { get; set; } = string.Empty;
        public int Id { get; set; }
        public string ProductType { get; set; } = string.Empty;
    }

    public class PolicyDetail
    {
        public double OverdueAmount { get; set; }
        public int UpdateVersion { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        public DateTime PolicyStartDate { get; set; }
        public List<Cover> Cover { get; set; } = default!;
        public PolicyType PolicyType { get; set; } = default!;
        public int Id { get; set; }
        public BoatAsset BoatAsset { get; set; } = default!;
        public VehicleAsset MotorAsset { get; set; } = default!;
        public PetAsset PetAsset { get; set; } = default!;
        public VehicleAsset CaravanAsset { get; set; } = default!;
        public VehicleAsset MotorcycleAsset { get; set; } = default!;
        public VehicleAsset ElectricMobilityAsset { get; set; } = default!;
        public HomeAsset HomeAsset { get; set; } = default!;
        public Asset CurrentAsset
        {
            get
            {
                if (HomeAsset != null)
                {
                    return HomeAsset;
                }
                else if (PetAsset != null)
                {
                    return PetAsset;
                }
                else if (MotorAsset != null)
                {
                    return MotorAsset;
                }
                else if (CaravanAsset != null)
                {
                    return CaravanAsset;
                }
                else if (MotorcycleAsset != null)
                {
                    return MotorcycleAsset;
                }
                else if (ElectricMobilityAsset != null)
                {
                    return ElectricMobilityAsset;
                }
                else if (BoatAsset != null)
                {
                    return BoatAsset;
                }
                else
                {
                    return default!;
                }
            }
        }
    }

    public class ClaimDetails
    {
        public string ClaimNumber { get; set; } = string.Empty;
        public PolicyDetail PolicyDetails { get; set; } = default!;
    }

    public class PortfolioSummaryContact
    {
        public int ContactId { get; set; }
        public string ContactExternalNumber { get; set; } = string.Empty;
        public int Id { get; set; }
        public List<PolicyDetail> PolicyDetails { get; set; } = default!;
        public List<ClaimDetails> ClaimDetails { get; set; } = default!;

        public Dictionary<string, List<string>> GetPoliciesWithClaims(string insuranceProductType, string policyNumber)
        {
            if (ClaimDetails == null || !ClaimDetails.Any())
            {
                return new Dictionary<string, List<string>>();
            }

            var policyWithClaims = new Dictionary<string, List<string>>();
            foreach (var claim in ClaimDetails)
            {
                if (claim.PolicyDetails == null || claim.PolicyDetails.PolicyType.ProductType != insuranceProductType)
                {
                    continue; // Skip claims that don't match the specified insurance type
                }

                if (policyNumber != null && claim.PolicyDetails.PolicyNumber != policyNumber)
                {
                    continue; // Skip claims that don't match the specified policy number
                }

                if (policyWithClaims.ContainsKey(claim.PolicyDetails.PolicyNumber))
                {
                    var claimsList = policyWithClaims[claim.PolicyDetails.PolicyNumber];
                    claimsList.Add(claim.ClaimNumber);
                    policyWithClaims[claim.PolicyDetails.PolicyNumber] = claimsList;
                }
                else
                {
                    policyWithClaims.Add(claim.PolicyDetails.PolicyNumber, new List<string> { claim.ClaimNumber });
                }
            }

            return policyWithClaims;
        }


    }

    public class Asset
    {
        public int Id { get; set; }
        public int UpdateVersion { get; set; }
    }

    public class VehicleAsset : Asset
    {
        public string ModelDescription { get; set; } = string.Empty;
        public int Year { get; set; }
        public string RegistrationNumber { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
    }

    public class HomeAsset : Asset
    {
        public string HouseNumber { get; set; } = string.Empty;
        public string StreetName { get; set; } = string.Empty;
        public string Suburb { get; set; } = string.Empty;
    }

    public class PetAsset : Asset
    {
        public string PetType { get; set; } = string.Empty;
        public string PetBreed { get; set; } = string.Empty;
        public string PetName { get; set; } = string.Empty;
    }

    public class BoatAsset : Asset
    {

        public string BoatDescription { get; set; } = string.Empty;
    }

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

    public class InsuranceProductResponse
    {
        public Amount AnnualPremium { get; set; } = default!;
        public DateTime EndorsementStartDate { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        public DateTime ProposalValidDate { get; set; }
        public string PaymentFrequency { get; set; } = string.Empty;
        public bool IsPaidInFull { get; set; }
        public NextPayableInstallment NextPayableInstallment { get; set; } = default!;
        public List<Installment> Installments { get; set; } = default!;
        public DateTime EndorsementEndDate { get; set; }
        public int Id { get; set; }
        public bool HasProposalForRenewal { get; set; }
        public int EndorsementNumber { get; set; }
        public string LobId { get; set; } = string.Empty;
        public DateTime StatusRenewalDate { get; set; }
        public DateTime PolicyEndDate { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string ProductVersionId { get; set; } = string.Empty;
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
        public DateTime PolicyStartDate { get; set; }
        public string BankAccountExternalNumber { get; set; } = string.Empty; //This also keeps tabs on card external numbers despite the property name
        public DateTime RenewalDate { get; set; }
        public string DiscountGroup { get; set; } = string.Empty;
    }

    public class Amount
    {
        public double Total { get; set; }
        public double StampDuty { get; set; }
        public double Gst { get; set; }
        public int Id { get; set; }
        public double BaseAmount { get; set; }
    }

    public class NextPayableInstallment
    {
        public int InstallmentNumber { get; set; }
        public double OutstandingAmount { get; set; }
        public int Id { get; set; }
        public DateTime CollectionDate { get; set; }
    }

    public class Installment
    {
        public int InstallmentNumber { get; set; }
        public Amount Amount { get; set; } = default!;
        public string Origin { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime CollectionDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class Policyholder
    {
        public int UpdateVersion { get; set; }
        public string ContactExternalNumber { get; set; } = string.Empty;
        public int Id { get; set; }
    }

    public class ChildCover
    {
        public int UpdateVersion { get; set; }
        public string CoverType { get; set; } = string.Empty;
        public double SumInsured { get; set; }
        public int Id { get; set; }
    }


    public class Contact
    {
        public bool IsMarketingAllowed { get; set; }
        public string Gender { get; set; } = string.Empty;
        public bool IsCrmManaged { get; set; }
        public List<BankAccount> BankAccounts { get; set; } = default!;
        public int MembershipTenure { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<ContactRole> ContactRoles { get; set; } = default!;
        public string ExternalContactNumber { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public bool IsLegalEntity { get; set; }
        public int Id { get; set; }
        public string MobilePhoneNumber { get; set; } = string.Empty;
        public PrivateEmail PrivateEmail { get; set; } = default!;
        public string Initial { get; set; } = string.Empty;
        public string MembershipTier { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty;
        public string MembershipNumber { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public bool IsCrmPreferred { get; set; }
        public List<CreditCard> CreditCards { get; set; } = default!;
        public MailingAddress MailingAddress { get; set; } = default!;
    }

    public class ContactRole
    {
        public string ExternalCode { get; set; } = string.Empty;
        public int Id { get; set; }
        public DateTime EffectiveDate { get; set; }
    }

    public class PrivateEmail
    {
        public string Address { get; set; } = string.Empty;
        public int Id { get; set; }
        public bool IsPreferredDeliveryMethod { get; set; }
    }

    public class PaymentMethod
    {
        public string ExternalNumber { get; set; } = string.Empty;
    }

    public class CreditCard : PaymentMethod
    {
        public bool IsTemporaryCard { get; set; }
        public string DiscontinueDate { get; set; } = string.Empty;
        public string CardholderName { get; set; } = string.Empty;
        public string CardType { get; set; } = string.Empty;
        public int Id { get; set; }
        public string CardNumber { get; set; } = string.Empty;
        public DateTime CardExpiryDate { get; set; }
    }

    public class BankAccount : PaymentMethod
    {
        public int Id { get; set; }
        public string BSB { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string DiscontinueDate { get; set; } = string.Empty;

    }

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
}

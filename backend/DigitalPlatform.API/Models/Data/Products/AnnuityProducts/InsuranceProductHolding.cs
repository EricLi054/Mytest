using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Extensions;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.Insurance;

namespace DigitalPlatform.API.Models.Products.AnnuityProducts;

public class InsuranceProductHolding : AnnuityProduct
{
    public string Status { get; set; } = string.Empty;
    public string Asset { get; set; } = string.Empty;
    public string AssetDescription { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    public string NextPayment { get; set; } = string.Empty;
    public string NextPaymentAmount { get; set; } = string.Empty;
    public string PaymentMethodType { get; set; } = string.Empty;
    public string BSB { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string CardNumber { get; set; } = string.Empty;
    public string CardExpiry { get; set; } = string.Empty;
    public string Cover { get; set; } = string.Empty;
    public bool HasClaimsInProgress { get; set; }
    public int NumberOfClaims { get; set; }
    public bool IsThirdPartyCover { get; set; }
    public bool IsMinorProduct { get; set; }
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, List<string>>? Claims { get; set; }
    public string Alert { get; set; } = string.Empty;
    public List<CTALink> Actions { get; set; } = new();

    public enum InsuranceType
    {
        BGP,//Boat
        MGV,//Caravan Trailer
        MGE,//Electric Mobility
        HGP,//Home
        MGP,//Motor
        MGC,//Motorcycle
        PET,//Pet
    }

    public InsuranceProductHolding() { }

    public InsuranceProductHolding(
        PortfolioSummaryContact contact,
        Contact insuranceContact,
        PolicyDetail policy,
        InsuranceProductResponse policyPaymentInfo,
        IConfiguration configuration,
        IFeatureService featureService)
    {
        base.BusinessType = Descriptors.BusinessType.Insurance.ToString();
        Id = $"{BusinessType}_{policy?.Id ?? 0}";
        Type = policy?.PolicyType?.ProductType ?? "";
        PolicyNumber = policy?.PolicyNumber ?? "";

        if (policyPaymentInfo != null)
        {
            if (!policyPaymentInfo.IsPaidInFull)
            {
                if (policyPaymentInfo.NextPayableInstallment != null)
                {
                    NextPayment = policyPaymentInfo.NextPayableInstallment?.CollectionDate.ToString("dd MMM yyyy") ?? "";
                    NextPaymentAmount = $"${policyPaymentInfo.NextPayableInstallment?.OutstandingAmount:0.00}" ?? "";
                    NextPaymentActionDate = policyPaymentInfo.NextPayableInstallment?.CollectionDate ?? DateTime.MinValue;
                }
                else
                {
                    var lastInstallment = policyPaymentInfo.Installments?.OrderBy(i => i.InstallmentNumber).LastOrDefault();

                    if (lastInstallment != null)
                    {
                        NextPayment = lastInstallment?.CollectionDate.ToString("dd MMM yyyy") ?? "";
                        NextPaymentAmount = $"${lastInstallment?.Amount.Total:0.00}" ?? "";
                        NextPaymentActionDate = lastInstallment?.CollectionDate ?? DateTime.MinValue;
                    }
                }

                // Process payment information
                // Payment Info
                var paymentMethodReference = policyPaymentInfo.BankAccountExternalNumber;

                if (!string.IsNullOrEmpty(paymentMethodReference))
                {
                    // Find the external number from either the bank or card source, try to match it to bank account initially
                    var matchingBankAccount = insuranceContact.BankAccounts?.FirstOrDefault(bankAccount => bankAccount?.ExternalNumber == paymentMethodReference);

                    if (matchingBankAccount != null)
                    {
                        NextPayment += " from ";
                        PaymentMethodType = "Bank Account";
                        BSB = matchingBankAccount.BSB.MaskString(3);
                        AccountNumber = matchingBankAccount.AccountNumber.MaskString(4);
                    }
                    else
                    {
                        // Find the matching card
                        var matchingCreditCard = insuranceContact.CreditCards?.FirstOrDefault(creditCard => creditCard?.ExternalNumber == paymentMethodReference);

                        if (matchingCreditCard != null)
                        {
                            NextPayment += " from ";
                            PaymentMethodType = "Card";
                            CardNumber = matchingCreditCard.CardNumber!;
                            CardExpiry = matchingCreditCard.CardExpiryDate!.ToString("dd/MM/yyyy");
                        }
                    }
                }
            }
        }

        // Process the mapping of each insurance type
        if (!Enum.TryParse(policy?.PolicyType?.ProductType, out InsuranceType type))
        {
            throw new Exception($"Product type '{policy?.PolicyType?.ProductType}' is not a valid insurance product type");
        }

        switch (type)
        {
            case InsuranceType.MGP:
                MapMotorInsurance(policy, this);
                break;
            case InsuranceType.HGP:
                MapHomeInsurance(policy, this);
                break;
            case InsuranceType.PET:
                MapPetInsurance(policy, this);
                break;
            case InsuranceType.MGE:
                MapElectricMobilityInsurance(policy, this);
                break;
            case InsuranceType.BGP:
                MapBoatInsurance(policy, this);
                break;
            case InsuranceType.MGC:
                MapMotorcycleInsurance(policy, this);
                break;
            case InsuranceType.MGV:
                MapCaravanTrailerInsurance(policy, this);
                break;
            default:
                throw new Exception($"Product type '{policy?.PolicyType?.ProductType}' is not a valid insurance product type");
        }

        // Only process Claims if the policy type is not MGE or PET
        if (ShouldProcessClaims(type))
        {
            // Process policy claims
            Claims = contact.GetPoliciesWithClaims(Type, PolicyNumber) ?? [];

            if (Claims != null && Claims.Count != 0)
            {
                NumberOfClaims = Claims[PolicyNumber].Count;
                HasClaimsInProgress = NumberOfClaims > 0; // bool used in the mustache to define member action rules
            }
        }

        // Process Member Actions
        ConfigureMemberActions(policyPaymentInfo, configuration, featureService);
    }

    public bool ShouldProcessClaims(InsuranceType type)
    {
        return type switch
        {
            InsuranceType.PET or InsuranceType.MGE => false,// No claims processing for Pet insurance or Electric Mobility insurance
            _ => true,
        };
    }

    private static void MapMotorInsurance(PolicyDetail policy, InsuranceProductHolding product)
    {
        product.Title = "Car Insurance";
        var motorCovers = policy?.Cover?.Select(cover =>
        {
            return (cover?.CoverType) switch
            {
                "MFCO" => "Comprehensive",
                "MTFT" => "Third party fire & theft",
                "MTPO" => "Third party property",
                _ => cover?.CoverTypeDescription!,
            };
        });
        product.Subtitle = string.Join(", ", motorCovers ?? []);

        if (product.Subtitle.Contains("Third party"))
        {
            product.IsThirdPartyCover = true;
        }

        product.Asset = $"{policy?.MotorAsset?.Year} {policy?.MotorAsset?.Manufacturer}";
        product.AssetDescription = $"{policy?.MotorAsset?.ModelDescription}";
        product.RegistrationNumber = policy?.MotorAsset?.RegistrationNumber!;
        product.Description = "motor";
    }

    private static void MapHomeInsurance(PolicyDetail policy, InsuranceProductHolding product)
    {
        product.Title = "Home Insurance";
        var homeCovers = policy?.Cover?.Select(cover =>
        {
            return (cover?.CoverType) switch
            {
                "HB" => "Building",
                "HCN" => "Contents",
                "LB" => "Landlord's building",
                "LC" => "Landlord's contents",
                "RCN" => "Basic contents",
                "OVS" => "Specified valuables",
                "OVU" => "Unspecified valuables",
                "AD" => "Accidental damage",
                _ => cover?.CoverTypeDescription!,
            };
        });
        product.Subtitle = string.Join(", ", homeCovers ?? []);
        product.Asset = $"{policy?.HomeAsset?.HouseNumber} {policy?.HomeAsset?.StreetName}, {policy?.HomeAsset?.Suburb}";
        product.Description = "home";
    }

    private static void MapPetInsurance(PolicyDetail policy, InsuranceProductHolding product)
    {
        product.Title = "Pet Insurance";
        product.Subtitle = policy?.PetAsset?.PetType!;
        product.Asset = policy?.PetAsset?.PetName!;
        product.AssetDescription = policy?.PetAsset?.PetBreed!;
        product.Description = "pet";
        product.IsMinorProduct = true;
    }

    private static void MapElectricMobilityInsurance(PolicyDetail policy, InsuranceProductHolding product)
    {
        product.Title = "Electric Mobility Insurance";
        var elecMobilityCovers = policy?.Cover?.Select(cover =>
        {
            return (cover?.CoverType) switch
            {
                "EEMO" => "Comprehensive",
                _ => cover?.CoverTypeDescription!,
            };
        });
        product.Subtitle = string.Join(", ", elecMobilityCovers ?? []);
        product.Asset = $"{policy?.ElectricMobilityAsset?.Year} {policy?.ElectricMobilityAsset?.Manufacturer}";
        product.AssetDescription = $"{policy?.ElectricMobilityAsset?.ModelDescription}";
        product.RegistrationNumber = policy?.ElectricMobilityAsset?.RegistrationNumber!;
        product.IsMinorProduct = true;
    }

    private static void MapBoatInsurance(PolicyDetail policy, InsuranceProductHolding product)
    {
        product.Title = "Boat Insurance";
        var boatCovers = policy?.Cover?.Select(cover =>
        {
            return (cover?.CoverType) switch
            {
                "MBOO" => "Comprehensive",
                _ => cover?.CoverTypeDescription!,
            };
        });
        product.Subtitle = string.Join(", ", boatCovers ?? []);
        product.Asset = $"{policy?.BoatAsset?.BoatDescription}";
        product.IsMinorProduct = true;
    }

    private static void MapMotorcycleInsurance(PolicyDetail policy, InsuranceProductHolding product)
    {
        product.Title = "Motorcycle Insurance";
        var motorcycleCovers = policy?.Cover?.Select(cover =>
        {
            return (cover?.CoverType) switch
            {
                "OMCO" => "Comprehensive",
                _ => cover?.CoverTypeDescription!,
            };
        });
        product.Subtitle = string.Join(", ", motorcycleCovers ?? []);
        product.Asset = $"{policy?.MotorcycleAsset?.Year} {policy?.MotorcycleAsset?.Manufacturer}";
        product.AssetDescription = $"{policy?.MotorcycleAsset?.ModelDescription}";
        product.RegistrationNumber = policy?.MotorcycleAsset?.RegistrationNumber!;
        product.IsMinorProduct = true;
    }

    private static void MapCaravanTrailerInsurance(PolicyDetail policy, InsuranceProductHolding product)
    {
        product.Title = "Caravan Trailer Insurance";
        var caravanCovers = policy?.Cover?.Select(cover =>
        {
            return (cover?.CoverType) switch
            {
                "ACAT" => "Trailed",
                "AOCO" => "Contents",
                "AANO" => "Annexe",
                _ => cover?.CoverTypeDescription!,
            };
        });
        product.Subtitle = string.Join(", ", caravanCovers ?? []);
        product.Asset = $"{policy?.CaravanAsset?.Year} {policy?.CaravanAsset?.Manufacturer}";
        product.AssetDescription = $"{policy?.CaravanAsset?.ModelDescription}";
        product.RegistrationNumber = policy?.CaravanAsset?.RegistrationNumber!;
        product.IsMinorProduct = true;
    }

    private void ConfigureMemberActions(InsuranceProductResponse? policyPaymentInfo, IConfiguration configuration, IFeatureService featureService)
    {
        if (!Enum.TryParse(Type, out InsuranceType type)) return;

        var noClaimsTypes = new List<InsuranceType> {
            InsuranceType.PET
        };

        var makeAClaimOnlyTypes = new List<InsuranceType> {
            InsuranceType.MGE
        };

        bool showUpdateHowYouPay = featureService.IsFeatureEnabled(FeatureFlags.UHYP) &&
                                   policyPaymentInfo != null &&
                                   policyPaymentInfo.PaymentMethod != InurancePaymentType.AnnualCash &&
                                   type switch
                                   {
                                       InsuranceType.PET => featureService.IsFeatureEnabled(FeatureFlags.UHYP_Pet),
                                       InsuranceType.BGP => featureService.IsFeatureEnabled(FeatureFlags.UHYP_Boat),
                                       InsuranceType.MGE => featureService.IsFeatureEnabled(FeatureFlags.UHYP_Mobility),
                                       _ => true
                                   };

        // Flags for different claim scenarios
        bool showMakeAClaim = !noClaimsTypes.Contains(type) && (makeAClaimOnlyTypes.Contains(type) || !HasClaimsInProgress);
        bool showTrackClaim = !noClaimsTypes.Contains(type) && !makeAClaimOnlyTypes.Contains(type) && HasClaimsInProgress && NumberOfClaims == 1;
        bool showTrackMultipleClaims = !noClaimsTypes.Contains(type) && !makeAClaimOnlyTypes.Contains(type) && HasClaimsInProgress && NumberOfClaims > 1;

        // There is only one claim, get the claim number from the single entry
        var singleClaimNumber = showTrackClaim ? Claims!.FirstOrDefault(claims => claims.Key == PolicyNumber).Value.FirstOrDefault() : string.Empty;

        // Urls
        string b2cUrl = configuration[ConfigDescriptors.INSURANCE_B2C_URL] ?? "";
        string racInsuranceWebsiteBaseUrl = configuration[ConfigDescriptors.RAC_INSURANCE_WEBSITE_BASE_URL] ?? "";
        string pcmBase = $"{b2cUrl}/Secure/PCM";

        string managePolicyLink = $"{pcmBase}?policyNumber={PolicyNumber}";
        string updateHowYouPayLink = $"{configuration[ConfigDescriptors.INSURANCE_UHYP_URL]}?policyNumber={PolicyNumber}";
        string getCertOfCurrencyLink = $"{pcmBase}/PolicyDocuments?policyNumber={PolicyNumber}";

        // Different links based on policy type
        string makeAClaimLink = type switch
        {
            InsuranceType.BGP or InsuranceType.MGV or InsuranceType.MGC => $"{pcmBase}/Claim/NewEmailClaim",
            InsuranceType.MGP => $"{racInsuranceWebsiteBaseUrl}/claims/{Description}/what-are-you-claiming-for?policyNumber={PolicyNumber}",
            InsuranceType.HGP => $"{racInsuranceWebsiteBaseUrl}/claims/{Description}/building-and-contents?policyNumber={PolicyNumber}",
            _ => $"/products/insurance/make-a-claim{(!string.IsNullOrEmpty(Description) ? $"?type={Description}insurance" : "")}"
        };
        string trackYourClaimLink = $"{pcmBase}/Claim?claimNumber=";
        string uploadDocumentLink = $"{pcmBase}/UploadClaimSupportingDocuments/IndexPage?claimNumber={singleClaimNumber}";

        if (showMakeAClaim)
        {
            Actions.Add(new()
            {
                Label = "Make a claim",
                Link = makeAClaimLink,
                Colour = "secondary"
            });
        }
        else if (showTrackClaim)
        {
            Actions.Add(new()
            {
                Label = "Track your claim",
                Link = trackYourClaimLink + singleClaimNumber,
                Colour = "secondary"
            });
        }
        else if (showTrackMultipleClaims && Claims != null)
        {
            var claimsList = Claims.SelectMany(
                (entry) => entry.Value.Select(
                    (claimNumber, index) => new CTALink
                    {
                        Label = $"Claim {index + 1}",
                        SubLabel = claimNumber,
                        Link = trackYourClaimLink + claimNumber
                    }
                )
            );

            Actions.Add(new()
            {
                Label = "Your claims",
                Colour = "secondary",
                SubActions = claimsList.ToList()
            });
        }

        var manageSubActions = new List<CTALink>();

        // Show upload document if we have only 1 claim
        if (showTrackClaim)
        {
            manageSubActions.Add(new() { Label = "Upload a document", Link = uploadDocumentLink });
        }

        // Show if we have any number of in progress claims
        if (showTrackClaim || showTrackMultipleClaims)
        {
            manageSubActions.Add(new() { Label = "Make another claim", Link = makeAClaimLink });
        }

        // Always add Manage your policy link
        manageSubActions.Add(new() { Label = "Manage your policy", Link = managePolicyLink });

        if (showUpdateHowYouPay)
        {
            manageSubActions.Add(new() { Label = "Update how you pay", Link = updateHowYouPayLink });
        }

        if (!IsThirdPartyCover && !IsMinorProduct)
        {
            manageSubActions.Add(new() { Label = "Get certificate of currency", Link = getCertOfCurrencyLink });
        }

        // If there is only one manage action, render a single Manage link
        // otherwise, render a dropdown with the manage sub actions
        Actions.Add(
            new()
            {
                Label = "Manage",
                Link = manageSubActions.Count == 1 ? manageSubActions[0].Link : null,
                SubActions = manageSubActions.Count > 1 ? manageSubActions : null,
                Colour = noClaimsTypes.Contains(type) ? "secondary" : "",
            }
        );
    }
}
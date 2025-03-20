using Membership.Types.Insurance;
using Membership.Types.Products;
using Membership.Types.Products.AnnuityProducts;

namespace Membership.Tests.Data;
public static class InsuranceTestData
{
    public static string ShieldContactNumber => "12345";

    public static string ExternalShieldNumber => "ABCDE";

    public static string PolicyNumber => "123456789";

    public static string B2CUrl => "https://b2cuat2.ractest.com.au";

    public static InsurancePortfolioSummary EmptySummary => new();

    public static InsurancePortfolioSummary SummaryWithSinglePolicy(PolicyDetail detail) => new()
    {
        Id = 123,
        Contacts =
        [
            new()
            {
                Id = 123,
                PolicyDetails =
                    [
                        detail
                    ],
                ContactExternalNumber = "123",
            }
        ]
    };

    public static InsurancePortfolioSummary SummaryWithValidPolicyList => new()
    {
        Id = 123,
        Contacts =
        [
            new()
            {
                Id = 123,
                PolicyDetails =
                    [
                        ValidMotorPolicy1,
                        ValidMotorPolicy2,
                        ValidMotorPolicy3,
                        ValidHomePolicy,
                        ValidPetPolicy,
                        ValidBoatPolicy,
                        ValidCaravanPolicy,
                        ValidMotorcyclePolicy,
                        ValidElectricMobilityScooterPolicy
                    ],
                ClaimDetails = [
                        new ClaimDetails
                        {
                            PolicyDetails = ValidMotorPolicy2,
                            ClaimNumber = "CLAIM_789"
                        },
                    new ClaimDetails
                    {
                        PolicyDetails = ValidMotorPolicy3,
                        ClaimNumber = "CLAIM_123"
                    },
                    new ClaimDetails
                    {
                        PolicyDetails = ValidMotorPolicy3,
                        ClaimNumber = "CLAIM_456"
                    }
                    ],
                ContactExternalNumber = "123",
            }
        ]
    };

    public static InsurancePortfolioSummary SummaryWithInvalidPolicyList => new()
    {
        Id = 123,
        Contacts =
        [
            new()
            {
                Id = 123,
                PolicyDetails =
                [
                    InvalidMotorPolicy,
                ],
                ContactExternalNumber = "123",
            }
        ]
    };

    public static Contact EmptyContact => new();

    public static Contact ValidContact => new()
    {
        Id = 1,
        FirstName = "John",
        Surname = "Doe",
        PrivateEmail = new PrivateEmail
        {
            Address = "john.doe@rac.com.au"
        },
        BankAccounts =
        [
            new()
            {
                Id = 1,
                ExternalNumber = "123456",
                BSB = "***456",
                AccountNumber = "****5678"
            }
        ],
        CreditCards =
        [
            new()
            {
                Id = 1,
                ExternalNumber = "987654",
                CardNumber = "12345678",
                CardExpiryDate = DateTime.Parse("2030-01-01")
            }
        ]
    };

    public static InsuranceProductResponse EmptyInsuranceProductResponse => new();

    public static InsuranceProductResponse InvalidInsuranceProductResponse => new()
    {
        Id = 123456,
        ProductType = "ABCDEF",
        PolicyNumber = "MGP12345678",
        BankAccountExternalNumber = "123456",
        NextPayableInstallment = new()
        {
            Id = 1234,
            CollectionDate = DateTime.Parse("2030-01-01"),
            OutstandingAmount = 100
        },
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "MTPO",
                CoverTypeDescription = "Third party property"
            },
            new()
            {
                Id = 2,
                CoverType = "MTFT",
                CoverTypeDescription = "Third party fire & theft"
            }
        ],
        PaymentFrequency = "12",
    };

    public static InsuranceProductResponse ValidMotorInsuranceProductResponse1 => new()
    {
        Id = 1234,
        ProductType = "MGP",
        PolicyNumber = "MGP12345678",
        BankAccountExternalNumber = "123456",
        AnnualPremium = new()
        {
            Total = 1010.0,
            BaseAmount = 834.71,
            Gst = 83.47,
            StampDuty = 91.82
        },
        IsPaidInFull = false,
        NextPayableInstallment = new()
        {
            Id = 1234,
            InstallmentNumber = 1,
            CollectionDate = DateTime.Parse("2024-04-13"),
            OutstandingAmount = 1010.0
        },
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "MTPO",
                CoverTypeDescription = "Third party property"
            },
            new()
            {
                Id = 2,
                CoverType = "MTFT",
                CoverTypeDescription = "Third party fire & theft"
            }
        ],
        PaymentFrequency = "1",
        PaymentMethod = InurancePaymentType.AnnualCash
    };

    public static InsuranceProductResponse ValidMotorInsuranceProductResponse2 => new()
    {
        Id = 1234,
        ProductType = "MGP",
        PolicyNumber = "MGP23456789",
        BankAccountExternalNumber = "123456",
        IsPaidInFull = false,
        NextPayableInstallment = new()
        {
            Id = 1234,
            CollectionDate = DateTime.Parse("2030-01-01"),
            OutstandingAmount = 100
        },
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "MFCO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        PaymentFrequency = "12",
        PaymentMethod = InurancePaymentType.BankAccountDD
    };

    public static InsuranceProductResponse ValidMotorInsuranceProductResponse3 => new()
    {
        Id = 1234,
        ProductType = "MGP",
        PolicyNumber = "MGP34567890",
        BankAccountExternalNumber = "123456",
        IsPaidInFull = false,
        Installments =
        [
            new()
            {
                Id = 1234,
                CollectionDate = DateTime.Parse("2030-01-01"),
                InstallmentNumber = 12,
                Origin = "Premium",
                Amount = new Amount
                {
                    Total = 672.4,
                    StampDuty = 61.13,
                    BaseAmount = 555.7,
                    Gst = 55.57,
                    Id = 228372487
                }
            }
        ],
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "MFCO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        PaymentFrequency = "1",
    };

    public static InsuranceProductResponse ValidPetInsuranceProductResponseWithNextPayableInstallment => new()
    {
        Id = 12345,
        ProductType = "PET",
        PolicyNumber = "PET12345678",
        BankAccountExternalNumber = "987654",
        DiscountGroup = "ST",
        NextPayableInstallment = new()
        {
            Id = 12345,
            CollectionDate = DateTime.Parse("2030-01-01"),
            OutstandingAmount = 100
        },
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "PETCOM",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        PaymentFrequency = "12",
        PaymentMethod = InurancePaymentType.CreditCardDD,
        PolicyEndDate = DateTime.Parse("2030-02-01"),
    };

    public static InsuranceProductResponse ValidHomeInsuranceProductResponseWithInstallments => new()
    {
        Id = 123456,
        ProductType = "HGP",
        PolicyNumber = "HGP12345678",
        BankAccountExternalNumber = "123456",
        DiscountGroup = "ST",
        Installments =
        [
            new()
            {
                Id = 123456,
                CollectionDate = DateTime.Parse("2030-01-01"),
                Amount = new Amount
                {
                    Total = 100
                }
            }
        ],
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "HB",
                CoverTypeDescription = "Building",
                SumInsured = 100
            },
            new()
            {
                Id = 2,
                CoverType = "HCN",
                CoverTypeDescription = "Contents",
                SumInsured = 100
            },
            new()
            {
                Id = 3,
                CoverType = "LB",
                CoverTypeDescription = "Landlord's building",
                SumInsured = 100
            },
            new()
            {
                Id = 4,
                CoverType = "LC",
                CoverTypeDescription = "Landlord's contents",
                SumInsured = 100
            },
            new()
            {
                Id = 5,
                CoverType = "RCN",
                CoverTypeDescription = "Basic contents",
                SumInsured = 100
            },
            new()
            {
                Id = 6,
                CoverType = "OVS",
                CoverTypeDescription = "Specified valuables",
                SumInsured = 100
            },
            new()
            {
                Id = 7,
                CoverType = "OVU",
                CoverTypeDescription = "Unspecified valuables",
                SumInsured = 100
            },
            new()
            {
                Id = 8,
                CoverType = "AD",
                CoverTypeDescription = "Accidental damage",
                SumInsured = 100
            }
        ],
        PaymentFrequency = "12",
        PolicyEndDate = DateTime.Parse("2030-02-01"),
        PaymentMethod = InurancePaymentType.BankAccountDD
    };

    public static InsuranceProductResponse ValidBoatInsuranceProductResponse => new()
    {
        Id = 1234567,
        ProductType = "BGP",
        PolicyNumber = "BGP12345678",
        BankAccountExternalNumber = "123456",
        DiscountGroup = "ST",
        Installments =
        [
            new()
            {
                Id = 1234567,
                CollectionDate = DateTime.Parse("2030-01-01"),
                Amount = new Amount
                {
                    Total = 100
                }
            }
        ],
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "MBOO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        PaymentFrequency = "12",
        PaymentMethod = InurancePaymentType.BankAccountDD,
        PolicyEndDate = DateTime.Parse("2030-02-01")
    };

    public static InsuranceProductResponse ValidCaravanInsuranceProductResponse => new()
    {
        Id = 12345678,
        ProductType = "MGV",
        PolicyNumber = "MGV12345678",
        BankAccountExternalNumber = "123456",
        DiscountGroup = "ST",
        Installments =
        [
            new()
            {
                Id = 12345678,
                CollectionDate = DateTime.Parse("2030-01-01"),
                Amount = new Amount
                {
                    Total = 100
                }
            }
        ],
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "ACAT",
                CoverTypeDescription = "Trailed"
            },
            new()
            {
                Id = 2,
                CoverType = "AOCO",
                CoverTypeDescription = "Contents"
            },
            new()
            {
                Id = 3,
                CoverType = "AANO",
                CoverTypeDescription = "Annexe"
            }
        ],
        PaymentFrequency = "12",
        PolicyEndDate = DateTime.Parse("2030-02-01"),
    };

    public static InsuranceProductResponse ValidMotorcycleInsuranceProductResponse => new()
    {
        Id = 123456789,
        ProductType = "MGC",
        PolicyNumber = "MGC12345678",
        BankAccountExternalNumber = "123456",
        DiscountGroup = "ST",
        Installments =
        [
            new()
            {
                Id = 123456789,
                CollectionDate = DateTime.Parse("2030-01-01"),
                Amount = new Amount
                {
                    Total = 100
                }
            }
        ],
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "OMCO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        PaymentFrequency = "12",
        PolicyEndDate = DateTime.Parse("2030-02-01"),
    };

    public static InsuranceProductResponse ValidElectricMobilityScooterInsuranceProductResponse => new()
    {
        Id = 1234567890,
        ProductType = "MGE",
        PolicyNumber = "MGE12345678",
        BankAccountExternalNumber = "123456",
        DiscountGroup = "ST",
        Installments =
        [
            new()
            {
                Id = 1234567890,
                CollectionDate = DateTime.Parse("2030-01-01"),
                Amount = new Amount
                {
                    Total = 100
                }
            }
        ],
        Covers =
        [
            new()
            {
                Id = 1,
                CoverType = "EEMO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        PaymentFrequency = "12",
        PaymentMethod = InurancePaymentType.BankAccountDD,
        PolicyEndDate = DateTime.Parse("2030-02-01"),
    };

    public static PolicyDetail ValidHomePolicy => new()
    {
        Id = 123,
        PolicyNumber = "HGP12345678",
        PolicyType = new PolicyType
        {
            ProductType = "HGP",
            Description = "Home",
            Id = 123
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "HB",
                CoverTypeDescription = "Building",
                SumInsured = 100
            },
            new()
            {
                Id = 2,
                CoverType = "HCN",
                CoverTypeDescription = "Contents",
                SumInsured = 100
            },
            new()
            {
                Id = 3,
                CoverType = "LB",
                CoverTypeDescription = "Landlord's building",
                SumInsured = 100
            },
            new()
            {
                Id = 4,
                CoverType = "LC",
                CoverTypeDescription = "Landlord's contents",
                SumInsured = 100
            },
            new()
            {
                Id = 5,
                CoverType = "RCN",
                CoverTypeDescription = "Basic contents",
                SumInsured = 100
            },
            new()
            {
                Id = 6,
                CoverType = "OVS",
                CoverTypeDescription = "Specified valuables",
                SumInsured = 100
            },
            new()
            {
                Id = 7,
                CoverType = "OVU",
                CoverTypeDescription = "Unspecified valuables",
                SumInsured = 100
            },
            new()
            {
                Id = 8,
                CoverType = "AD",
                CoverTypeDescription = "Accidental damage",
                SumInsured = 100
            }
        ]
    };

    public static PolicyDetail InvalidMotorPolicy => new()
    {
        Id = 123,
        PolicyNumber = "MGP12345678",
        PolicyType = new PolicyType
        {
            ProductType = "ABCDEF",
            Description = "Motor",
            Id = 456
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-10).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "MTPO",
                CoverTypeDescription = "Third party property"
            },
            new()
            {
                Id = 2,
                CoverType = "MTFT",
                CoverTypeDescription = "Third party fire & theft"
            }
        ],
        MotorAsset = new VehicleAsset
        {
            Id = 123,
            ModelDescription = "Car McCarface",
            RegistrationNumber = "123456",
            Year = 2023
        }
    };

    public static PolicyDetail ValidMotorPolicy1 => new()
    {
        Id = 123,
        PolicyNumber = "MGP12345678",
        PolicyType = new PolicyType
        {
            ProductType = "MGP",
            Description = "Motor",
            Id = 456
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-10).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "MTPO",
                CoverTypeDescription = "Third party property"
            },
            new()
            {
                Id = 2,
                CoverType = "MTFT",
                CoverTypeDescription = "Third party fire & theft"
            }
        ],
        MotorAsset = new VehicleAsset
        {
            Id = 123,
            ModelDescription = "Car McCarface",
            RegistrationNumber = "123456",
            Year = 2023
        }
    };

    public static PolicyDetail ValidMotorPolicy2 => new()
    {
        Id = 123,
        PolicyNumber = "MGP23456789",
        PolicyType = new PolicyType
        {
            ProductType = "MGP",
            Description = "Motor",
            Id = 456
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-10).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "MFCO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        MotorAsset = new VehicleAsset
        {
            Id = 123,
            ModelDescription = "Car McCarface",
            RegistrationNumber = "123456",
            Year = 2023
        }
    };

    public static PolicyDetail ValidMotorPolicy3 => new()
    {
        Id = 123,
        PolicyNumber = "MGP34567890",
        PolicyType = new PolicyType
        {
            ProductType = "MGP",
            Description = "Motor",
            Id = 456
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-10).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "MFCO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        MotorAsset = new VehicleAsset
        {
            Id = 123,
            ModelDescription = "Car McCarface",
            RegistrationNumber = "123456",
            Year = 2023
        }
    };

    public static PolicyDetail ValidPetPolicy => new()
    {
        Id = 123,
        PolicyNumber = "PET12345678",
        PolicyType = new PolicyType
        {
            ProductType = "PET",
            Description = "Pet",
            Id = 123
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "PETCOM",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        PetAsset = new PetAsset
        {
            Id = 123,
            PetName = "Fido",
            PetBreed = "German Shepherd"
        }
    };

    public static PolicyDetail ValidBoatPolicy => new()
    {
        Id = 123,
        PolicyNumber = "BGP12345678",
        PolicyType = new PolicyType
        {
            ProductType = "BGP",
            Description = "Boat",
            Id = 123
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "MBOO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        BoatAsset = new BoatAsset
        {
            Id = 123,
            BoatDescription = "Boaty McBoatface"
        }
    };

    public static PolicyDetail ValidCaravanPolicy => new()
    {
        Id = 123,
        PolicyNumber = "MGV12345678",
        PolicyType = new PolicyType
        {
            ProductType = "MGV",
            Description = "Caravan",
            Id = 123
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "ACAT",
                CoverTypeDescription = "Trailed"
            },
            new()
            {
                Id = 2,
                CoverType = "AOCO",
                CoverTypeDescription = "Contents"
            },
            new()
            {
                Id = 3,
                CoverType = "AANO",
                CoverTypeDescription = "Annexe"
            }
        ],
        CaravanAsset = new VehicleAsset
        {
            Id = 123,
            ModelDescription = "Caravan McCaravanface",
            RegistrationNumber = "123456"
        }
    };

    public static PolicyDetail ValidMotorcyclePolicy => new()
    {
        Id = 123,
        PolicyNumber = "MGC12345678",
        PolicyType = new PolicyType
        {
            ProductType = "MGC",
            Description = "Motorcycle",
            Id = 123
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "OMCO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        MotorcycleAsset = new VehicleAsset
        {
            Id = 123,
            ModelDescription = "Motorcycle McMotorcycleface",
            RegistrationNumber = "123456"
        }
    };

    public static PolicyDetail ValidElectricMobilityScooterPolicy => new()
    {
        Id = 123,
        PolicyNumber = "MGE12345678",
        PolicyType = new PolicyType
        {
            ProductType = "MGE",
            Description = "Electric Mobility Scooter",
            Id = 123
        },
        PolicyStartDate = DateTime.Parse(DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")),
        Cover =
        [
            new()
            {
                Id = 1,
                CoverType = "EEMO",
                CoverTypeDescription = "Comprehensive"
            }
        ],
        ElectricMobilityAsset = new VehicleAsset
        {
            Id = 123,
            ModelDescription = "Electric Mobility Scooter McScooterface",
            RegistrationNumber = "123456"
        }
    };

    public static InsuranceProductHolding ValidCarInsuranceProductHoldingWithNoClaims => new()
    {
        Id = "Insurance_123",
        BusinessType = BusinessType.Insurance.ToString(),
        Title = "Car Insurance",
        Subtitle = "Third party property, Third party fire & theft",
        Type = "MGP",
        Status = string.Empty,
        Asset = "2023 ",
        AssetDescription = "Car McCarface",
        RegistrationNumber = "123456",
        PolicyNumber = "MGP12345678",
        NextPayment = "01 Jan 2030 from ",
        NextPaymentAmount = "$100.00",
        PaymentMethodType = "Bank Account",
        BSB = "***456",
        AccountNumber = "****5678",
        CardNumber = string.Empty,
        CardExpiry = string.Empty,
        Cover = string.Empty,
        HasClaimsInProgress = false,
        NumberOfClaims = 0,
        Claims = [],
        Alert = string.Empty,
        NextPaymentActionDate = DateTime.Parse("2024-04-13"),
        Actions = [
            new ()
            {
                Label = "Make a claim",
                Link = $"{B2CUrl}/Secure/PCM/Claim/NewEmailClaim",
                Colour = "secondary"
            },
            new ()
            {
                Label = "Manage",
                SubActions = [
                    new () { Label = "Manage your policy", Link = $"{B2CUrl}/Secure/PCM?policyNumber=MGP12345678" },
                    new() { Label = "Get certificate of currency", Link = $"{B2CUrl}/Secure/PCM/PolicyDocuments?policyNumber=MGP12345678" }
                ]
            }
        ]
    };

    public static InsuranceProductHolding ValidCarInsuranceProductHoldingWithOneClaim => new()
    {
        Id = "Insurance_123",
        BusinessType = BusinessType.Insurance.ToString(),
        Title = "Car Insurance",
        Subtitle = "Comprehensive",
        Type = "MGP",
        Status = string.Empty,
        Asset = "2023 ",
        AssetDescription = "Car McCarface",
        RegistrationNumber = "123456",
        PolicyNumber = "MGP23456789",
        NextPayment = "01 Jan 2030 from ",
        NextPaymentAmount = "$100.00",
        PaymentMethodType = "Bank Account",
        BSB = "***456",
        AccountNumber = "****5678",
        CardNumber = string.Empty,
        CardExpiry = string.Empty,
        Cover = string.Empty,
        HasClaimsInProgress = true,
        NumberOfClaims = 1,
        Claims = new Dictionary<string, List<string>>{
            { "MGP23456789", new List<string>{ "CLAIM_789" } }
        },
        Alert = string.Empty,
        NextPaymentActionDate = DateTime.Parse("2030-01-01"),
        Actions = [
            new()
            {
                Label = "Track your claim",
                Link = $"{B2CUrl}/Secure/PCM/Claim?claimNumber=CLAIM_789",
                Colour = "secondary"
            },
            new()
            {
                Label = "Manage",
                SubActions = [
                    new() { Label = "Upload a document", Link = $"{B2CUrl}/Secure/PCM/UploadClaimSupportingDocuments/IndexPage?claimNumber=CLAIM_789" },
                    new() { Label = "Make another claim", Link = $"{B2CUrl}/claims/motor/what-are-you-claiming-for?policyNumber=MGP23456789" },
                    new() { Label = "Manage your policy", Link = $"{B2CUrl}/Secure/PCM?policyNumber=MGP23456789" },
                    new() { Label = "Get certificate of currency", Link = $"{B2CUrl}/Secure/PCM/PolicyDocuments?policyNumber=MGP23456789" }
                ]
            }
        ]
    };

    public static InsuranceProductHolding ValidCarInsuranceProductHoldingWithClaims => new()
    {
        Id = "Insurance_123",
        BusinessType = BusinessType.Insurance.ToString(),
        Title = "Car Insurance",
        Subtitle = "Comprehensive",
        Type = "MGP",
        Status = string.Empty,
        Asset = "2023 ",
        AssetDescription = "Car McCarface",
        RegistrationNumber = "123456",
        PolicyNumber = "MGP34567890",
        NextPayment = "01 Jan 2030 from ",
        NextPaymentAmount = "$100.00",
        PaymentMethodType = "Bank Account",
        BSB = "***456",
        AccountNumber = "****5678",
        CardNumber = string.Empty,
        CardExpiry = string.Empty,
        Cover = string.Empty,
        HasClaimsInProgress = true,
        NumberOfClaims = 2,
        Claims = new Dictionary<string, List<string>>{
            { "MGP34567890", new List<string>{ "CLAIM_123", "CLAIM_456" } }
        },
        Alert = string.Empty,
        NextPaymentActionDate = DateTime.Parse("2030-01-01"),
        Actions = [
            new()
            {
                Label = "Your claims",
                Colour = "secondary",
                SubActions = [
                    new()
                    {
                        Label = "MGP34567890",
                        SubLabel = "CLAIM_123",
                        Link = $"{B2CUrl}/Secure/PCM/Claim?claimNumber=CLAIM_123"
                    },
                    new()
                    {
                        Label = "MGP34567890",
                        SubLabel = "CLAIM_456",
                        Link = $"{B2CUrl}/Secure/PCM/Claim?claimNumber=CLAIM_456"
                    }
                ]
            },
            new()
            {
                Label = "Manage",
                SubActions = [
                    new()
                    {
                        Label = "Make another claim",
                        Link = $"{B2CUrl}/claims/motor/what-are-you-claiming-for?policyNumber=MGP34567890"
                    },
                    new()
                    {
                        Label = "Manage your policy",
                        Link = $"{B2CUrl}/Secure/PCM?policyNumber=MGP34567890"
                    },
                    new()
                    {
                        Label = "Get certificate of currency",
                        Link = $"{B2CUrl}/Secure/PCM/PolicyDocuments?policyNumber=MGP34567890"
                    }
                ]
            }
        ]
    };

    public static InsuranceProductHolding ValidHomeInsuranceProductHolding => new()
    {
        Id = "Insurance_123",
        BusinessType = BusinessType.Insurance.ToString(),
        Title = "Home Insurance",
        Subtitle = "Building, Contents, Landlord's building, Landlord's contents, Basic contents, Specified valuables, Unspecified valuables, Accidental damage",
        Type = "HGP",
        Status = "",
        Asset = " , ",
        AssetDescription = string.Empty,
        RegistrationNumber = string.Empty,
        PolicyNumber = "HGP12345678",
        NextPayment = "01 Jan 2030 from ",
        NextPaymentAmount = "$100.00",
        PaymentMethodType = "Bank Account",
        BSB = "***456",
        AccountNumber = "****5678",
        CardNumber = string.Empty,
        CardExpiry = string.Empty,
        Cover = string.Empty,
        HasClaimsInProgress = false,
        NumberOfClaims = 0,
        Claims = [],
        Alert = string.Empty,
        NextPaymentActionDate = DateTime.Parse("2030-01-01"),
        Actions = [
            new()
            {
                Label = "Make a claim",
                Link = $"{B2CUrl}/claims/home/building-and-contents?policyNumber=HGP12345678",
                Colour = "secondary"
            },
            new()
            {
                Label = "Manage",
                SubActions = [
                    new() { Label = "Manage your policy", Link = $"{B2CUrl}/Secure/PCM?policyNumber=HGP12345678" },
                    new() { Label = "Get certificate of currency", Link = $"{B2CUrl}/Secure/PCM/PolicyDocuments?policyNumber=HGP12345678" }
                ]
            }
        ]
    };

    public static InsuranceProductHolding ValidPetInsuranceProductHolding => new()
    {
        Id = "Insurance_123",
        BusinessType = BusinessType.Insurance.ToString(),
        Title = "Pet Insurance",
        Subtitle = "",
        Type = "PET",
        Status = string.Empty,
        Asset = "Fido",
        AssetDescription = "German Shepherd",
        RegistrationNumber = string.Empty,
        PolicyNumber = "PET12345678",
        NextPayment = "01 Jan 2030 from ",
        NextPaymentAmount = "$100.00",
        PaymentMethodType = "Card",
        BSB = string.Empty,
        AccountNumber = string.Empty,
        CardNumber = "12345678",
        CardExpiry = "01/01/2030",
        Cover = string.Empty,
        HasClaimsInProgress = false,
        NumberOfClaims = 0,
        Claims = [],
        Alert = string.Empty,
        NextPaymentActionDate = DateTime.Parse("2030-01-01"),
        Actions = [
            new()
            {
                Label = "Make a claim",
                Link = $"/products/insurance/make-a-claim?type=petinsurance",
                Colour = "secondary"
            },
            new()
            {
                Label = "Manage",
                Link = $"{B2CUrl}/Secure/PCM?policyNumber=PET12345678",
            }
        ]
    };

    public static InsuranceProductHolding ValidElectricMobilityScooterInsuranceProductHolding => new()
    {
        Id = "Insurance_123",
        BusinessType = BusinessType.Insurance.ToString(),
        Title = "Electric Mobility Insurance",
        Subtitle = "Comprehensive",
        Type = "MGE",
        Status = string.Empty,
        Asset = "0 ",
        AssetDescription = "Electric Mobility Scooter McScooterface",
        RegistrationNumber = "123456",
        PolicyNumber = "MGE12345678",
        NextPayment = "01 Jan 2030 from ",
        NextPaymentAmount = "$100.00",
        PaymentMethodType = "Bank Account",
        BSB = "***456",
        AccountNumber = "****5678",
        CardNumber = string.Empty,
        CardExpiry = string.Empty,
        Cover = string.Empty,
        HasClaimsInProgress = false,
        NumberOfClaims = 0,
        Claims = [],
        Alert = string.Empty,
        NextPaymentActionDate = DateTime.Parse("2030-01-01"),
        Actions = [
            new()
            {
                Label = "Make a claim",
                Link = $"{B2CUrl}/Secure/PCM/Claim/NewEmailClaim",
                Colour = "secondary"
            },
            new()
            {
                Label = "Manage",
                Link = $"{B2CUrl}/Secure/PCM?policyNumber=MGE12345678",
            }
        ]
    };

    public static InsuranceProductHolding ValidBoatInsuranceProductHolding => new()
    {
        Id = "Insurance_123",
        BusinessType = BusinessType.Insurance.ToString(),
        Title = "Boat Insurance",
        Subtitle = "Comprehensive",
        Type = "BGP",
        Status = string.Empty,
        Asset = "Boaty McBoatface",
        AssetDescription = string.Empty,
        RegistrationNumber = string.Empty,
        PolicyNumber = "BGP12345678",
        NextPayment = "01 Jan 2030 from ",
        NextPaymentAmount = "$100.00",
        PaymentMethodType = "Bank Account",
        BSB = "***456",
        AccountNumber = "****5678",
        CardNumber = string.Empty,
        CardExpiry = string.Empty,
        Cover = string.Empty,
        HasClaimsInProgress = false,
        NumberOfClaims = 0,
        Claims = [],
        Alert = string.Empty,
        NextPaymentActionDate = DateTime.Parse("2030-01-01"),
        Actions = [
            new()
            {
                Label = "Make a claim",
                Link = $"{B2CUrl}/Secure/PCM/Claim/NewEmailClaim",
                Colour = "secondary"
            },
            new()
            {
                Label = "Manage",
                SubActions = [
                    new() { Label = "Manage your policy", Link = $"{B2CUrl}/Secure/PCM?policyNumber=BGP12345678" },
                    new() { Label = "Get certificate of currency", Link = $"{B2CUrl}/Secure/PCM/PolicyDocuments?policyNumber=BGP12345678" }
                ]
            }
        ]
    };

    public static InsuranceProductHolding ValidCaravanInsuranceProductHolding => new()
    {
        Id = "Insurance_123",
        BusinessType = BusinessType.Insurance.ToString(),
        Title = "Caravan Trailer Insurance",
        Subtitle = "Trailed, Contents, Annexe",
        Type = "MGV",
        Status = string.Empty,
        Asset = "0 ",
        AssetDescription = "Caravan McCaravanface",
        RegistrationNumber = "123456",
        PolicyNumber = "MGV12345678",
        NextPayment = "01 Jan 2030 from ",
        NextPaymentAmount = "$100.00",
        PaymentMethodType = "Bank Account",
        BSB = "***456",
        AccountNumber = "****5678",
        CardNumber = string.Empty,
        CardExpiry = string.Empty,
        Cover = string.Empty,
        HasClaimsInProgress = false,
        NumberOfClaims = 0,
        Claims = [],
        Alert = string.Empty,
        NextPaymentActionDate = DateTime.Parse("2030-01-01"),
        Actions = [
            new()
            {
                Label = "Make a claim",
                Link = $"{B2CUrl}/Secure/PCM/Claim/NewEmailClaim",
                Colour = "secondary"
            },
            new()
            {
                Label = "Manage",
                SubActions = [
                    new() { Label = "Manage your policy", Link = $"{B2CUrl}/Secure/PCM?policyNumber=MGV12345678" },
                    new() { Label = "Get certificate of currency", Link = $"{B2CUrl}/Secure/PCM/PolicyDocuments?policyNumber=MGV12345678" }
                ]
            }
        ]
    };

    public static InsuranceProductHolding ValidMotorcycleInsuranceProductHolding => new()
    {
        Id = "Insurance_123",
        BusinessType = BusinessType.Insurance.ToString(),
        Title = "Motorcycle Insurance",
        Subtitle = "Comprehensive",
        Type = "MGC",
        Status = string.Empty,
        Asset = "0 ",
        AssetDescription = "Motorcycle McMotorcycleface",
        RegistrationNumber = "123456",
        PolicyNumber = "MGC12345678",
        NextPayment = "01 Jan 2030 from ",
        NextPaymentAmount = "$100.00",
        PaymentMethodType = "Bank Account",
        BSB = "***456",
        AccountNumber = "****5678",
        CardNumber = string.Empty,
        CardExpiry = string.Empty,
        Cover = string.Empty,
        HasClaimsInProgress = false,
        NumberOfClaims = 0,
        Claims = [],
        Alert = string.Empty,
        NextPaymentActionDate = DateTime.Parse("2030-01-01"),
        Actions = [
            new()
            {
                Label = "Make a claim",
                Link = $"{B2CUrl}/Secure/PCM/Claim/NewEmailClaim",
                Colour = "secondary"
            },
            new()
            {
                Label = "Manage",
                SubActions = [
                    new() { Label = "Manage your policy", Link = $"{B2CUrl}/Secure/PCM?policyNumber=MGC12345678" },
                ]
            }
        ]
    };
}

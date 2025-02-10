using DigitalPlatform.API.Models.SourceSystem.FinOps;
using DigitalPlatform.API.Models.Products.AnnuityProducts;
using System.Diagnostics.CodeAnalysis;

namespace DigitalPlatform.API.Tests.Data;
[ExcludeFromCodeCoverage]
public static class FinOpsTestData
{
    public static Product EmptyProduct => new();

    public static List<Product> EmptyProductList => new();

    public static FinOpsProductHolding EmptyProductHolding => new();

    public static List<FinOpsProductHolding> EmptyProductHoldingList => new();

    public static List<FinOpsProductHolding> ValidProductHoldingList => new()
        {
            new FinOpsProductHolding
            {
                CustAccount = "123",
                CompanyId = "456",
                ProductHoldingHeaderId = "PH12345678",
                ProductHoldingLines =
                [
                    new()
                    {
                        CompanyId = "E098",
                        ProductId = "CLAS",
                        ProductName = "Classic Roadside Assistance",
                        ProductHoldingId = "1234568347885",
                        ProductHoldingVersion = "1",
                        VehicleDetail = new VehicleDetail
                        {
                            Year = "1992",
                            Make = "Ford",
                            Model = "F150",
                            RegistrationNumber = "ABC123",
                        },
                        EndDate = DateTime.Today.AddDays(1),
                    }
                ],
                RenewalPaymentMode = "DDBA",
                Upn = "123456789"
                
                // Add other properties as needed for a valid product holding
            }
        };

    public static List<FinOpsProductHolding> ValidProductHoldingWithNextActionInFuture => [
    new() {
        CustAccount = "123",
        CompanyId = "456",
        ProductHoldingHeaderId = "PH12345678",
        ProductHoldingLines =
        [
            new()
                    {
                        CompanyId = "E098",
                        ProductId = "CLAS",
                        ProductName = "Classic Roadside Assistance",
                        ProductHoldingId = "1234568347885",
                        ProductHoldingVersion = "1",
                        VehicleDetail = new VehicleDetail
                        {
                            Year = "1992",
                            Make = "Ford",
                            Model = "F150",
                            RegistrationNumber = "ABC123",
                        },
                        // Set the end date to be far in the future
                        EndDate = DateTime.Today.AddDays(10000),
                    }
        ],
        RenewalPaymentMode = "DDBA",
        ProductHoldingPaymSched =
                [
                    new ProductHoldingPaymentSchedule
                    {
                        CompanyId = "E098",
                        LineNum = 1,
                        // Set the due date to be far in the future
                        DueDate = DateTime.Today.AddDays(10000),
                        Amount = 100,
                        RemainingAmount = 100,
                        Posted = "N",
                        Description = "Classic Roadside Assistance",
                        Status = "Unpaid",
                    }
                ],
        RenewalPaymentScheduleId = "Monthly",
        PaymentDetail = new PaymentDetail {
            BankShortName = "Bank",
            BankBsb = "123456",
            BankAccountNum = "123456789"
        },
        Upn = "123456789"

        // Add other properties as needed for a valid product holding
    }];

    public static List<FinOpsProductHolding> GenerateProductHoldingList(FinOpsProductFlags productFlags)
    {
        if (productFlags.IsRewards && productFlags.IsUpgradeDowngradeEligible)
        {
            throw new ArgumentException("Product cannot be both a rewards product and upgrade/downgrade eligible");
        }
        if (productFlags.ShowPayNow && productFlags.IsDirectDebit)
        {
            throw new ArgumentException("Product cannot be in a Pay Now state and be Direct Debit at the same time");
        }

        var productIds = new Dictionary<Func<bool>, string>
        {
            { () => productFlags.IsFordRoadside, "FSTDCMO" },
            { () => productFlags.IsFree2GoRoadside, "F2GCLAS" },
            { () => productFlags.IsMitsubishiRoadside, "MSTDCMO" },
            { () => productFlags.IsSubaruRoadside, "SSTDCMO" },
            { () => productFlags.IsWheels2Go, "W2G" },
            { () => productFlags.IsRewards, "REWARDS" },
        };

        // If none of the above flags are true, default to the generic view cover or membership link
        string productId;
        if (productIds.FirstOrDefault(x => x.Key()).Value != null)
        {
            // set product id to the relevant product id from above if set
            productId = productIds.FirstOrDefault(x => x.Key()).Value;
        }
        else if (productFlags.ShowPayNow)
        {
            productId = "STD";
        }
        else if (productFlags.DirectDebitAllowed)
        {
            productId = "HLSTD";
        }
        else
        {
            productId = "GLSTD";
        }

        return
        [
            new FinOpsProductHolding
            {
                CustAccount = "123",
                CompanyId = "456",
                ProductHoldingHeaderId = "PH12345678",
                ProductHoldingLines =
                [
                    new()
                    {
                        CompanyId = "E098",
                        // Due to the limitations of what products can be direct debit, F2GCLAS is used which suits the requirement where a product
                        // should not show pay now and can be direct debit
                        ProductId = productId,
                        ProductName = productFlags.IsFree2GoRoadside ? "Free2Go" : "Classic Roadside Assistance",
                        ProductHoldingId = productFlags.ShowPayNow ? "1234568347885" : "RSA000122143412",
                        ProductHoldingVersion = "1",
                        ProductChanges = new List<ProductChange> {
                            new() {
                                CanChangeProductHolding = true
                            }
                        },
                        VehicleDetail = new VehicleDetail
                        {
                            Year = "1992",
                            Make = "Ford",
                            Model = "F150",
                            RegistrationNumber = "ABC123"
                        },
                        EndDate = productFlags.ShowPayNow ? DateTime.Today.AddDays(1) : DateTime.Today.AddDays(100),
                    }
                ],
                RenewalPaymentMode = productFlags.IsDirectDebit ? "DDBA" : "CC",
                ProductHoldingPaymSched = productFlags.ShowPayNow ? new List<ProductHoldingPaymentSchedule>
                {
                    new()
                    {
                        CompanyId = "E098",
                        LineNum = 1,
                        DueDate = DateTime.Today.AddDays(1),
                        Amount = 100,
                        RemainingAmount = 100,
                        Posted = "N",
                        Description = "Classic Roadside Assistance",
                        Status = "Unpaid",
                    }
                } : null!,
                RenewalPaymentScheduleId = "Monthly",
                PaymentDetail = new PaymentDetail(),
                Upn = "123456789"
                // Add other properties as needed for a valid product holding
            }
        ];
    }

    public static List<FinOpsProductHolding> GenerateBundledProductHoldingList(FinOpsProductFlags productFlags)
    {
        if (productFlags.IsRewards && productFlags.IsUpgradeDowngradeEligible)
        {
            throw new ArgumentException("Product cannot be both a rewards product and upgrade/downgrade eligible");
        }
        if (productFlags.ShowPayNow && productFlags.IsDirectDebit)
        {
            throw new ArgumentException("Product cannot be in a Pay Now state and be Direct Debit at the same time");
        }

        var productId1 = "STD";
        var productName1 = "Standard Roadside Assistance";
        var productId2 = "CLAS";
        var productName2 = "Classic Roadside Assistance";

        return
        [
            new FinOpsProductHolding
            {
                CustAccount = "123",
                CompanyId = "456",
                ProductHoldingHeaderId = "PH12345678",
                ProductHoldingLines =
                [
                    new()
                    {
                        CompanyId = "E098",
                        ProductId = productId1,
                        ProductName = productName1,
                        ProductHoldingId = "RSA000122143412",
                        ProductHoldingVersion = "1",
                        ProductChanges = new List<ProductChange> {
                            new() {
                                CanChangeProductHolding = true
                            }
                        },
                        VehicleDetail = new VehicleDetail
                        {
                            Year = "1992",
                            Make = "Ford",
                            Model = "F150",
                            RegistrationNumber = "ABC123"
                        },
                        EndDate = productFlags.ShowPayNow ? DateTime.Today.AddDays(1) : DateTime.Today.AddDays(100),
                    },
                    new()
                    {
                        CompanyId = "E098",
                        ProductId = productId2,
                        ProductName = productName2,
                        ProductHoldingId = "RSA000122143413",
                        ProductHoldingVersion = "1",
                        ProductChanges = new List<ProductChange> {
                            new() {
                                CanChangeProductHolding = true
                            }
                        },
                        VehicleDetail = new VehicleDetail
                        {
                            Year = "2010",
                            Make = "Toyota",
                            Model = "Camry",
                            RegistrationNumber = "123ABC"
                        },
                        EndDate = productFlags.ShowPayNow ? DateTime.Today.AddDays(1) : DateTime.Today.AddDays(100),
                    }
                ],
                RenewalPaymentMode = productFlags.IsDirectDebit ? "DDBA" : "CC",
                ProductHoldingPaymSched = productFlags.ShowPayNow ? new List<ProductHoldingPaymentSchedule>
                {
                    new()
                    {
                        CompanyId = "E098",
                        LineNum = 1,
                        DueDate = DateTime.Today.AddDays(1),
                        Amount = 100,
                        RemainingAmount = 100,
                        Posted = "N",
                        Description = productName1,
                        Status = "Unpaid",
                    }
                } : null!,
                RenewalPaymentScheduleId = "Monthly",
                PaymentDetail = new PaymentDetail(),
                Upn = "123456789"
                // Add other properties as needed for a valid product holding
            }
        ];
    }

    public static string FinOpsProductsJson
    {
        get { return _finOpsProductsJson; }
    }

    private static string _finOpsProductsJson = @"{
        ""Valid"": [
            ""REWARDS"",
            ""CCULT"",
            ""CLAS"",
            ""F2GCLAS"",
            ""F2GSTD"",
            ""F2GULT"",
            ""F2GULTP"",
            ""FORRNCO"",
            ""FREWDSR"",
            ""FSTDCMO"",
            ""FSTDDSR"",
            ""GLCLAS"",
            ""GLRWDS"",
            ""GLSTD"",
            ""GLULPL"",
            ""GLULTI"",
            ""HLCL"",
            ""HLSTD"",
            ""HONSTULT"",
            ""MSTDCMO"",
            ""MSTDDSR"",
            ""RSAFAIR"",
            ""RSAJOR"",
            ""SSTDCMO"",
            ""SSTDMY"",
            ""STD"",
            ""STIVES"",
            ""STULT"",
            ""ULPL"",
            ""ULTI"",
            ""COUNC""
        ],
        ""FordRoadside"": [""FSTDCMO"", ""FSTDDSR""],
        ""Free2GoRoadside"": [""F2GCLAS"", ""F2GSTD"", ""F2GULT"", ""F2GULTP""],
        ""MitsubishiRoadside"": [""MSTDCMO"", ""MSTDDSR""],
        ""SubaruRoadside"": [""SSTDCMO"", ""SSTDMY""],
        ""Wheels2GoRoadside"": [""W2G"", ""GLW2G""],
        ""AllowedForDirectDebit"": [
            ""STD"",
            ""CLAS"",
            ""ULPL"",
            ""ULTI"",
            ""F2GCLAS"",
            ""F2GSTD"",
            ""F2GULT"",
            ""F2GULTP"",
            ""GLCLAS"",
            ""GLULTI"",
            ""GLULPL"",
            ""HLCL"",
            ""HLSTD"",
            ""HONSTULT"",
            ""W2G""
        ],
        ""AllowedForUpgradeDowngrade"": [
            ""F2GCLAS"",
            ""F2GSTD"",
            ""F2GULT"",
            ""F2GULTP"",
            ""CLAS"",
            ""STD"",
            ""ULPL"",
            ""ULTI"",
            ""GLCLAS"",
            ""GLSTD"",
            ""GLULPL"",
            ""GLULTI"",
            ""HLCL"",
            ""HLSTD"",
            ""HLSTD"",
            ""HONSTULT""
        ],
        ""AllowedToShowPayNow"": [
            ""REWARDS"",
            ""STD"",
            ""CLAS"",
            ""ULTI"",
            ""ULPL"",
            ""F2GCLAS"",
            ""F2GSTD"",
            ""F2GULT"",
            ""F2GULTP"",
            ""GLCLAS"",
            ""GLULTI"",
            ""GLULPL"",
            ""HLCL"",
            ""HONSTULT""
        ],
        ""ExpiryDateRange"": {
            ""ExpiryPeriod"": {
            ""DaysBeforeEndDate"": -35,
            ""DaysAfterEndDate"": 90
            }
        },
        ""NotAllowedToShowViewCover"": [],
        ""Rewards"": [""GLRWDS"", ""REWARDS"", ""FREWDSR"", ""FORRNCO"", ""COUNC""]
        }";
}

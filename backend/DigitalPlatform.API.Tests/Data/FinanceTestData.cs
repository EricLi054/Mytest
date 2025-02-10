using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Models.SourceSystem.Finance;

namespace DigitalPlatform.API.Tests.Data;
[ExcludeFromCodeCoverage]
public static class FinanceTestData
{
    public static string RimID => "12345";
    public static string CRMID => "d454ced4-5de2-5581-efa9-f77cce4cf1fb";

    public static FinanceProductResponse EmptyFinanceProductResponse => new();
    public static FinanceProductResponse ValidFinanceProductResponse => new()
    {
        Success = "true",
        PartyProductList =
        [
            new()
                    {
                        ProductType = "Personal Loan",
                        FinanceProduct = new()
                        {
                            FinanceLoan = new()
                            {
                                    AccountType = "IL",
                                    AccountTitle1 = "A P Kitson",
                                    AccountTitle2 = "",
                                    AccountNumber = 412345678,
                                    CurrentLimit = 12657.0,
                                    CurrentBalance = 7603.93,
                                    FinanceOverdueAmount = 0.0,
                                    FinanceProductType = "Personal Loan",
                                    FinanceProductSubType = "Personal Loan - Secured",
                                    NextInstalmentDate = DateTime.Today.AddDays(30),
                                    InterestRate = 7.75,
                                    InterestFrequency = string.Empty,
                                    LoanTerm = string.Empty,
                                    ExpiryDate = DateTime.Today.AddDays(365),
                                    LoanAmount = 12657.0,
                                    NextInstalmentAmount = 182.1,
                                    ProjectAddress = "",
                                    ProjectAddress2 = "301 - Personal Loan - Secured",
                                    NextPayment = DateTime.Today.AddDays(30),
                                    Amount = 182.1,
                                    MaturityDate = DateTime.Today.AddDays(365),
                            }
                        }
                    }
        ]
    };
    public static FinanceProductResponse ValidFinanceProductResponseWithMultipleProducts => new()
    {
        Success = "true",
        PartyProductList =
        [
            new()
                    {
                        ProductType = "Loan",
                        FinanceProduct = new()
                        {
                            FinanceLoan = new()
                            {
                                // Set properties for FinanceLoan
                            }
                        }
                    },
                    new()
                    {
                        ProductType = "CreditCard",
                        FinanceProduct = new()
                        {
                            // Set properties for FinanceProduct (CreditCard)
                        }
                    }
        ]
    };
    
    public static List<FinanceQuote> FinanceLoanQuote =>
    [
        new()
        {
            QuoteId = "2ba977a3-a1c1-41b6-a7d9-3a7f8e0f5bac",
            LoanType = "DEBT_CONSOLIDATION",
            LoanUse = "PRIVATE",
            QuoteDate = DateTime.Today,
            LoanAmount = 8123.0M,
            Secured = true,
            LoanTermYears = 3,
            InterestRate = 12.25M,
            RepaymentFrequency = "FORTNIGHTLY",
            RepaymentAmount = 130.168770268766M,
            ContactFirstName = "RefinanceOrDebtConsolidation",
            CampaignCode = null,
            GapInsuranceOption = "NONE",
            EmailAddress = "test@qlmpuxmd.mailosaur.net",
            Expired = DateTime.Today.AddDays(30),
            CCI = "NONE",
            ConvertedIntoApplication = false
        }];
            public static List<FinanceQuote> FinanceLoanQuoteUnsecured =>
    [
        new()
        {
            QuoteId = "2ba977a3-a1c1-41b6-a7d9-3a7f8e0f5bac",
            LoanType = "OTHER",
            LoanUse = "PRIVATE",
            QuoteDate = DateTime.Today,
            LoanAmount = 8123.0M,
            Secured = false,
            LoanTermYears = 3,
            InterestRate = 12.25M,
            RepaymentFrequency = "FORTNIGHTLY",
            RepaymentAmount = 130.168770268766M,
            ContactFirstName = "RefinanceOrDebtConsolidation",
            CampaignCode = null,
            GapInsuranceOption = "NONE",
            EmailAddress = "test@qlmpuxmd.mailosaur.net",
            Expired = DateTime.Today.AddDays(30),
            CCI = "NONE",
            ConvertedIntoApplication = false
        }];            
        public static List<FinanceQuote> FinanceLoanQuoteVehicle =>
    [
        new()
        {
            QuoteId = "2ba977a3-a1c1-41b6-a7d9-3a7f8e0f5bac",
            LoanType = "CAR",
            LoanUse = "PRIVATE",
            QuoteDate = DateTime.Today,
            LoanAmount = 8123.0M,
            Secured = true,
            LoanTermYears = 3,
            InterestRate = 12.25M,
            RepaymentFrequency = "FORTNIGHTLY",
            RepaymentAmount = 130.168770268766M,
            ContactFirstName = "RefinanceOrDebtConsolidation",
            CampaignCode = null,
            GapInsuranceOption = "NONE",
            EmailAddress = "test@qlmpuxmd.mailosaur.net",
            Expired = DateTime.Today.AddDays(30),
            CCI = "NONE",
            ConvertedIntoApplication = false
        }];
    public static FinanceProductResponse PersonalLoanSecured => new()
    {
        Success = "true",
        PartyProductList =
        [
            new()
                    {
                        ProductType = "Personal Loan",
                        FinanceProduct = new()
                        {
                            FinanceLoan = new()
                            {
                                    AccountType = "IL",
                                    AccountTitle1 = "A P Kitson",
                                    AccountTitle2 = "",
                                    AccountNumber = 412345678,
                                    CurrentLimit = 12657.0,
                                    CurrentBalance = 7603.93,
                                    FinanceOverdueAmount = 0.0,
                                    FinanceProductType = "Personal Loan",
                                    FinanceProductSubType = "Personal Loan - Secured",
                                    NextInstalmentDate = DateTime.Today.AddDays(30),
                                    InterestRate = 7.75,
                                    InterestFrequency = string.Empty,
                                    LoanTerm = string.Empty,
                                    ExpiryDate = DateTime.Today.AddDays(365),
                                    LoanAmount = 12657.0,
                                    NextInstalmentAmount = 182.1,
                                    ProjectAddress = "",
                                    ProjectAddress2 = "301 - Personal Loan - Secured",
                                    NextPayment = DateTime.Today.AddDays(30),
                                    Amount = 182.1,
                                    MaturityDate = DateTime.Today.AddDays(365),
                            }
                        }
                    }
        ]
    };
    public static FinanceProductResponse PersonalLoanUnsecured => new()
    {
        Success = "true",
        PartyProductList =
        [
            new()
                    {
                        ProductType = "Personal Loan",
                        FinanceProduct = new()
                        {
                            FinanceLoan = new()
                            {
                                AccountType = "IL",
                                AccountTitle1 = "Jane D'sylva",
                                AccountTitle2 = "",
                                AccountNumber = 485042855,
                                CurrentLimit = 8299.0,
                                CurrentBalance = 5653.71,
                                FinanceOverdueAmount = 0.0,
                                FinanceProductType = "Personal Loan",
                                FinanceProductSubType = "Personal Loan - Unsecured",
                                NextInstalmentDate = DateTime.Today.AddDays(30),
                                InterestRate = 13.0,
                                InterestFrequency = string.Empty,
                                LoanTerm = string.Empty,
                                ExpiryDate = DateTime.Today.AddDays(365),
                                LoanAmount = 8299.0,
                                NextInstalmentAmount = 279.62,
                                ProjectAddress = "",
                                ProjectAddress2 = "300 - Personal Loan - Unsecured",
                                NextPayment = DateTime.Today.AddDays(30),
                                Amount = 279.62,
                                MaturityDate = null
                            }
                        }
                    }
        ]
    };
    public static FinanceProductResponse BusinessLoan => new()
    {
        Success = "true",
        PartyProductList =
        [
            new()
                    {
                        ProductType = "Personal Loan",
                        FinanceProduct = new()
                        {
                            FinanceLoan = new()
                            {
                                AccountType = "IL",
                                AccountTitle1 = "A B Cangy",
                                AccountTitle2 = "C D Cangy",
                                AccountNumber = 485040400,
                                CurrentLimit = 59277.96,
                                CurrentBalance = 46688.06,
                                FinanceOverdueAmount = 0.0,
                                FinanceProductType = "Personal Loan",
                                FinanceProductSubType = "Business Loan - Secured",
                                NextInstalmentDate = DateTime.Today.AddDays(30),
                                InterestRate = 5.38,
                                InterestFrequency = string.Empty,
                                LoanTerm = string.Empty,
                                ExpiryDate = DateTime.Today.AddDays(365),
                                LoanAmount = 59277.96,
                                NextInstalmentAmount = 391.2,
                                ProjectAddress = "",
                                ProjectAddress2 = "302 - Business Loan - Secured",
                                NextPayment = DateTime.Today.AddDays(30),
                                Amount = 391.2,
                                MaturityDate = null
                            }
                        }
                    }
        ]
    };
    public static FinanceProductResponse SecuredInvestmentTwoYearAnnual => new()
    {
        Success = "true",
        PartyProductList =
        [
            new()
            {
                ProductType = "Fixed Term Deposit",
                FinanceProduct = new()
                {
                    FinanceLoan = new()
                    {
                        AccountType = "CD",
                        AccountTitle1 = "X Y Uren",
                        AccountTitle2 = "",
                        AccountNumber = 483073910,
                        CurrentLimit = 0.0,
                        CurrentBalance = 10000.0,
                        FinanceOverdueAmount = 0.0,
                        FinanceProductType = "Fixed Term Deposit",
                        FinanceProductSubType = "214",
                        NextInstalmentDate = null,
                        InterestRate = 4.3,
                        InterestFrequency = "2 year interest annually",
                        LoanTerm = "24 Month(s)",
                        ExpiryDate = null,
                        LoanAmount = 0.0,
                        NextInstalmentAmount = 0.0,
                        ProjectAddress = "",
                        ProjectAddress2 = "2 year interest annually",
                        NextPayment = null,
                        Amount = 0.0,
                        MaturityDate = DateTime.Today.AddDays(365)
                    }
                }
            }
        ]
    };
    public static FinanceProductResponse SecuredInvestmentSixMonthly => new()
    {
        Success = "true",
        PartyProductList =
        [
            new()
            {
                ProductType = "Fixed Term Deposit",
                FinanceProduct = new()
                {
                    FinanceLoan = new()

                    {
                        AccountType = "CD",
                        AccountTitle1 = "A B Smith",
                        AccountTitle2 = "",
                        AccountNumber = 483075465,
                        CurrentLimit = 0.0,
                        CurrentBalance = 274036.49,
                        FinanceOverdueAmount = 0.0,
                        FinanceProductType = "Fixed Term Deposit",
                        FinanceProductSubType = "212",
                        NextInstalmentDate = null,
                        InterestRate = 4.1,
                        InterestFrequency = "6 monthly interest",
                        LoanTerm = "12 Month(s)",
                        ExpiryDate = null,
                        LoanAmount = 0.0,
                        NextInstalmentAmount = 0.0,
                        ProjectAddress = "",
                        ProjectAddress2 = "6 monthly interest",
                        NextPayment = null,
                        Amount = 0.0,
                        MaturityDate = DateTime.Today.AddDays(365)
                    }
                }
            }
        ]
    };
    public static FinanceProductResponse PropertyLoan => new()
    {
        Success = "true",
        PartyProductList =
        [
            new()
            {
                ProductType = "Commercial Loan",
                FinanceProduct = new()
                {
                    FinanceLoan = new()
                    {
                                AccountType = "CL",
                                AccountTitle1 = "Acme Holdings Pty Ltd",
                                AccountTitle2 = "",
                                AccountNumber = 484000003,
                                CurrentLimit = 1000000.0,
                                CurrentBalance = 464586.16,
                                FinanceOverdueAmount = 0.0,
                                FinanceProductType = "Commercial Loan",
                                FinanceProductSubType = "700",
                                NextInstalmentDate = DateTime.Parse("1901-01-01T00:00:00+08:00"),
                                InterestRate = 10.35,
                                InterestFrequency = string.Empty,
                                LoanTerm = string.Empty,
                                ExpiryDate = DateTime.Today.AddDays(365),
                                LoanAmount = 0.0,
                                NextInstalmentAmount = 0.0,
                                ProjectAddress = "Cinnamon Meander, Two Rocks",
                                ProjectAddress2 = "123 Breakwater Drive Two Rocks",
                                NextPayment = DateTime.Today.AddDays(30),
                                Amount = 0.0,
                                MaturityDate = null
                    }
                }
            }
        ]
    };

    public static string ValidPersonLoanSecured => JsonSerializer.Serialize(
                                                new
                                                {
                                                    Status = "",
                                                    Asset = "",
                                                    ExpiryDate = DateTime.Today.AddDays(365).ToString("dd MMM yyyy"),
                                                    PolicyNumber = "",
                                                    NextPayment = DateTime.Today.AddDays(30).ToString("dd MMM yyyy"),
                                                    IsNextPaymentAmountBlank = false,
                                                    NextPaymentAmount = "182.10",
                                                    LoanAmount = "12,657.00",
                                                    CurrentBalance = "7,603.93",
                                                    InterestRate = "7.75",
                                                    InterestFrequency = "",
                                                    Alert = "",
                                                    AccountName = "A P Kitson",
                                                    Id = "412345678",
                                                    AccountNumber = "412345678",
                                                    Title = "Personal Loan",
                                                    BusinessType = BusinessType.Finance.ToString(),
                                                    Type = "PERSONAL LOAN",
                                                    Subtitle = "Secured",
                                                    IsBusinessLoan = false,
                                                    IsSecuredInvestment = false,
                                                    IsPropertyFinanceLoan = false,
                                                    IsPersonalLoan = true,
                                                    IsFinanceQuote = false,
                                                    IsUnsecured = false,
                                                    IsSecured = true,
                                                    Payments = "",
                                                    QuoteAmount = string.Empty,
                                                    QuoteId = string.Empty,
                                                    QuoteType = string.Empty,
                                                    NextPaymentActionDate = DateTime.MaxValue,
                                                    ShowPayNow = false
                                                });

    public static string ValidPersonLoanUnSecured => JsonSerializer.Serialize(
                                                new
                                                {
                                                    Status = "",
                                                    Asset = "",
                                                    ExpiryDate = DateTime.Today.AddDays(365).ToString("dd MMM yyyy"),
                                                    PolicyNumber = "",
                                                    NextPayment = DateTime.Today.AddDays(30).ToString("dd MMM yyyy"),
                                                    IsNextPaymentAmountBlank = false,
                                                    NextPaymentAmount = "279.62",
                                                    LoanAmount = "8,299.00",
                                                    CurrentBalance = "5,653.71",
                                                    InterestRate = "13",
                                                    InterestFrequency = "",
                                                    Alert = "",
                                                    AccountName = "Jane D'sylva",
                                                    Id = "485042855",
                                                    AccountNumber = "485042855",
                                                    Title = "Personal Loan",
                                                    BusinessType = BusinessType.Finance.ToString(),
                                                    Type = "PERSONAL LOAN",
                                                    Subtitle = "Unsecured",
                                                    IsBusinessLoan = false,
                                                    IsSecuredInvestment = false,
                                                    IsPropertyFinanceLoan = false,
                                                    IsPersonalLoan = true,
                                                    IsFinanceQuote = false,
                                                    IsUnsecured = true,
                                                    IsSecured = false,
                                                    Payments = "",
                                                    QuoteAmount = string.Empty,
                                                    QuoteId = string.Empty,
                                                    QuoteType = string.Empty,
                                                    NextPaymentActionDate = DateTime.MaxValue,
                                                    ShowPayNow = false
                                                });

    public static string ValidSecuredInvestmentTwoYearAnnual => JsonSerializer.Serialize(
                                                new
                                                {
                                                    Status = "",
                                                    Asset = "",
                                                    ExpiryDate = DateTime.Today.AddDays(365).ToString("dd MMM yyyy"),
                                                    PolicyNumber = "",
                                                    NextPayment = "",
                                                    IsNextPaymentAmountBlank = true,
                                                    NextPaymentAmount = "0.00",
                                                    LoanAmount = "0.00",
                                                    CurrentBalance = "10,000.00",
                                                    InterestRate = "4.3",
                                                    InterestFrequency = "paid annually",
                                                    Alert = "",
                                                    AccountName = "X Y Uren",
                                                    Id = "483073910",
                                                    AccountNumber = "483073910",
                                                    Title = "Secured Investment",
                                                    BusinessType = BusinessType.Finance.ToString(),
                                                    Type = "SECURED INVESTMENT",
                                                    Subtitle = "24 month(s)",
                                                    IsBusinessLoan = false,
                                                    IsSecuredInvestment = true,
                                                    IsPropertyFinanceLoan = false,
                                                    IsPersonalLoan = false,
                                                    IsFinanceQuote = false,
                                                    IsUnsecured = false,
                                                    IsSecured = false,
                                                    Payments = "",
                                                    QuoteAmount = string.Empty,
                                                    QuoteId = string.Empty,
                                                    QuoteType = string.Empty,
                                                    NextPaymentActionDate = DateTime.MaxValue,
                                                    ShowPayNow = false
                                                });

    public static string ValidSecuredInvestmentSixMonthly => JsonSerializer.Serialize(
                                                new
                                                {
                                                    Status = "",
                                                    Asset = "",
                                                    ExpiryDate = DateTime.Today.AddDays(365).ToString("dd MMM yyyy"),
                                                    PolicyNumber = "",
                                                    NextPayment = "",
                                                    IsNextPaymentAmountBlank = true,
                                                    NextPaymentAmount = "0.00",
                                                    LoanAmount = "0.00",
                                                    CurrentBalance = "274,036.49",
                                                    InterestRate = "4.1",
                                                    InterestFrequency = "paid 6 monthly",
                                                    Alert = "",
                                                    AccountName = "A B Smith",
                                                    Id = "483075465",
                                                    AccountNumber = "483075465",
                                                    Title = "Secured Investment",
                                                    BusinessType = BusinessType.Finance.ToString(),
                                                    Type = "SECURED INVESTMENT",
                                                    Subtitle = "12 month(s)",
                                                    IsBusinessLoan = false,
                                                    IsSecuredInvestment = true,
                                                    IsPropertyFinanceLoan = false,
                                                    IsPersonalLoan = false,
                                                    IsFinanceQuote = false,
                                                    IsUnsecured = false,
                                                    IsSecured = false,
                                                    Payments = "",
                                                    QuoteAmount = string.Empty,
                                                    QuoteId = string.Empty,
                                                    QuoteType = string.Empty,
                                                    NextPaymentActionDate = DateTime.MaxValue,
                                                    ShowPayNow = false,
                                                });

    public static string ValidBusinessLoan => JsonSerializer.Serialize(
                                                new
                                                {
                                                    Status = "",
                                                    Asset = "",
                                                    ExpiryDate = DateTime.Today.AddDays(365).ToString("dd MMM yyyy"),
                                                    PolicyNumber = "",
                                                    NextPayment = DateTime.Today.AddDays(30).ToString("dd MMM yyyy"),
                                                    IsNextPaymentAmountBlank = false,
                                                    NextPaymentAmount = "391.20",
                                                    LoanAmount = "59,277.96",
                                                    CurrentBalance = "46,688.06",
                                                    InterestRate = "5.38",
                                                    InterestFrequency = "",
                                                    Alert = "",
                                                    AccountName = "A B Cangy & C D Cangy",
                                                    Id = "485040400",
                                                    AccountNumber = "485040400",
                                                    Title = "Car Loan",
                                                    BusinessType = BusinessType.Finance.ToString(),
                                                    Type = "PERSONAL LOAN",
                                                    Subtitle = "Business use",
                                                    IsBusinessLoan = true,
                                                    IsSecuredInvestment = false,
                                                    IsPropertyFinanceLoan = false,
                                                    IsPersonalLoan = true,
                                                    IsFinanceQuote = false,
                                                    IsUnsecured = false,
                                                    IsSecured = true,
                                                    Payments = "",
                                                    QuoteAmount = string.Empty,
                                                    QuoteId = string.Empty,
                                                    QuoteType = string.Empty,
                                                    NextPaymentActionDate = DateTime.MaxValue,
                                                    ShowPayNow = false,
                                                });

    public static string ValidPropertyLoan => JsonSerializer.Serialize(
                                                new
                                                {
                                                    Status = "",
                                                    Asset = "",
                                                    ExpiryDate = DateTime.Today.AddDays(365).ToString("dd MMM yyyy"),
                                                    PolicyNumber = "",
                                                    NextPayment = DateTime.Today.AddDays(30).ToString("dd MMM yyyy"),
                                                    IsNextPaymentAmountBlank = true,
                                                    NextPaymentAmount = "0.00",
                                                    LoanAmount = "1,000,000.00",
                                                    CurrentBalance = "464,586.16",
                                                    InterestRate = "10.35",
                                                    InterestFrequency = "",
                                                    Alert = "",
                                                    AccountName = "Acme Holdings Pty Ltd",
                                                    Id = "484000003",
                                                    AccountNumber = "484000003",
                                                    Title = "Property Finance Loan",
                                                    BusinessType = BusinessType.Finance.ToString(),
                                                    Type = "PROPERTY INVESTMENT",
                                                    Subtitle = "Cinnamon Meander, Two Rocks",
                                                    IsBusinessLoan = false,
                                                    IsSecuredInvestment = false,
                                                    IsPropertyFinanceLoan = true,
                                                    IsPersonalLoan = false,
                                                    IsFinanceQuote = false,
                                                    IsUnsecured = false,
                                                    IsSecured = false,
                                                    Payments = "",
                                                    QuoteAmount = string.Empty,
                                                    QuoteId = string.Empty,
                                                    QuoteType = string.Empty,
                                                    NextPaymentActionDate = DateTime.MaxValue,
                                                    ShowPayNow = false,
                                                });

    public static string ValidFinanceLoanQuote => JsonSerializer.Serialize(
                                                new
                                                {
                                                    Status = "",
                                                    Asset = "",
                                                    ExpiryDate = DateTime.Today.AddDays(30).ToString("dd MMM yyyy"),
                                                    PolicyNumber = "",
                                                    NextPayment = "",
                                                    IsNextPaymentAmountBlank = true,
                                                    NextPaymentAmount = "",
                                                    LoanAmount = "",
                                                    CurrentBalance = "",
                                                    InterestRate = "",
                                                    InterestFrequency = "",
                                                    Alert = "",
                                                    AccountName = "RefinanceOrDebtConsolidation",
                                                    Id = "",
                                                    AccountNumber = "",
                                                    Title = "Loan Quote",
                                                    BusinessType = BusinessType.Finance.ToString(),
                                                    Type = "PERSONAL LOAN",
                                                    Subtitle = "Secured",
                                                    IsBusinessLoan = false,
                                                    IsSecuredInvestment = false,
                                                    IsPropertyFinanceLoan = false,
                                                    IsPersonalLoan = false,
                                                    IsFinanceQuote = true,
                                                    IsUnsecured = false,
                                                    IsSecured = true,
                                                    Payments = "$130.17 paying fortnightly",
                                                    QuoteAmount = "$8,123.00 over 3 years @ 12.25% interest P.A.",
                                                    QuoteId = "2ba977a3-a1c1-41b6-a7d9-3a7f8e0f5bac",
                                                    QuoteType = "Refinancing",
                                                    NextPaymentActionDate = DateTime.MaxValue,
                                                    ShowPayNow = false,
                                                });   
                                                public static string ValidFinanceLoanQuoteUnsecured => JsonSerializer.Serialize(
                                                new
                                                {
                                                    Status = "",
                                                    Asset = "",
                                                    ExpiryDate = DateTime.Today.AddDays(30).ToString("dd MMM yyyy"),
                                                    PolicyNumber = "",
                                                    NextPayment = "",
                                                    IsNextPaymentAmountBlank = true,
                                                    NextPaymentAmount = "",
                                                    LoanAmount = "",
                                                    CurrentBalance = "",
                                                    InterestRate = "",
                                                    InterestFrequency = "",
                                                    Alert = "",
                                                    AccountName = "RefinanceOrDebtConsolidation",
                                                    Id = "",
                                                    AccountNumber = "",
                                                    Title = "Loan Quote",
                                                    BusinessType = BusinessType.Finance.ToString(),
                                                    Type = "PERSONAL LOAN",
                                                    Subtitle = "Unsecured",
                                                    IsBusinessLoan = false,
                                                    IsSecuredInvestment = false,
                                                    IsPropertyFinanceLoan = false,
                                                    IsPersonalLoan = false,
                                                    IsFinanceQuote = true,
                                                    IsUnsecured = true,
                                                    IsSecured = false,
                                                    Payments = "$130.17 paying fortnightly",
                                                    QuoteAmount = "$8,123.00 over 3 years @ 12.25% interest P.A.",
                                                    QuoteId = "2ba977a3-a1c1-41b6-a7d9-3a7f8e0f5bac",
                                                    QuoteType = "Other",
                                                    NextPaymentActionDate = DateTime.MaxValue,
                                                    ShowPayNow = false,
                                                });
                                                public static string ValidFinanceLoanQuoteVehicle => JsonSerializer.Serialize(
                                                new
                                                {
                                                    Status = "",
                                                    Asset = "",
                                                    ExpiryDate = DateTime.Today.AddDays(30).ToString("dd MMM yyyy"),
                                                    PolicyNumber = "",
                                                    NextPayment = "",
                                                    IsNextPaymentAmountBlank = true,
                                                    NextPaymentAmount = "",
                                                    LoanAmount = "",
                                                    CurrentBalance = "",
                                                    InterestRate = "",
                                                    InterestFrequency = "",
                                                    Alert = "",
                                                    AccountName = "RefinanceOrDebtConsolidation",
                                                    Id = "",
                                                    AccountNumber = "",
                                                    Title = "Loan Quote",
                                                    BusinessType = BusinessType.Finance.ToString(),
                                                    Type = "PERSONAL LOAN",
                                                    Subtitle = "Secured",
                                                    IsBusinessLoan = false,
                                                    IsSecuredInvestment = false,
                                                    IsPropertyFinanceLoan = false,
                                                    IsPersonalLoan = false,
                                                    IsFinanceQuote = true,
                                                    IsUnsecured = false,
                                                    IsSecured = true,
                                                    Payments = "$130.17 paying fortnightly",
                                                    QuoteAmount = "$8,123.00 over 3 years @ 12.25% interest P.A.",
                                                    QuoteId = "2ba977a3-a1c1-41b6-a7d9-3a7f8e0f5bac",
                                                    QuoteType = "Vehicle",
                                                    NextPaymentActionDate = DateTime.MaxValue,
                                                    ShowPayNow = false,
                                                });
}
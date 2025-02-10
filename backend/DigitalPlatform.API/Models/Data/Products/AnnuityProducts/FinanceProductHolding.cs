using DigitalPlatform.API.Models.SourceSystem.Finance;
using HotChocolate.Utilities;

namespace DigitalPlatform.API.Models.Products.AnnuityProducts;
public class FinanceProductHolding(FinanceLoan? loan = null, FinanceQuote? quote = null) : AnnuityProduct
{
    public string Status { get; set; } = string.Empty;
    public string Asset { get; set; } = string.Empty;
    public string ExpiryDate
    {
        get
        {
            if (loan is null)
            {
                return quote?.Expired.ToString("dd MMM yyyy") ?? "";
            }
            else
            {
                var resultDate = loan?.ExpiryDate ?? loan?.MaturityDate;
                return resultDate?.ToString("dd MMM yyyy") ?? "";
            }
        }
    }
    public string PolicyNumber { get; set; } = string.Empty;
    public string NextPayment => loan?.NextPayment?.ToString("dd MMM yyyy") ?? "";
    public bool IsNextPaymentAmountBlank => string.IsNullOrWhiteSpace(NextPaymentAmount) || loan?.NextInstalmentAmount == 0.0;
    public string NextPaymentAmount => loan?.NextInstalmentAmount != null ? $"{loan.NextInstalmentAmount:n2}" : "";
    public string LoanAmount
    {
        get
        {
            if (IsPropertyFinanceLoan)
            {
                return $"{loan?.CurrentLimit:n2}" ?? "";
            }
            return $"{loan?.LoanAmount:n2}" ?? "";
        }
    }
    public string CurrentBalance => loan?.CurrentBalance != null ? $"{loan.CurrentBalance:n2}" : "";
    public string InterestRate => loan?.InterestRate.ToString() ?? "";
    public string InterestFrequency
    {
        get
        {
            if (loan?.InterestFrequency is null)
            {
                return string.Empty;
            }
            var frequency = loan.InterestFrequency.ToLowerInvariant();
            if (frequency.Contains("annual"))
            {
                return "paid annually";
            }
            if (frequency.Contains("quarterly"))
            {
                return "paid quarterly";
            }
            if (frequency.Equals("6 monthly interest"))
            {
                return "paid 6 monthly";
            }
            if (frequency.Contains("monthly"))
            {
                return "paid monthly";
            }
            return string.Empty;
        }
    }
    public string Alert { get; set; } = string.Empty;
    public string AccountName
    {
        get
        {
            if (quote is not null) return quote.ContactFirstName;
            var conditionalAmpersand = string.IsNullOrWhiteSpace(loan?.AccountTitle2) ? "" : " & ";
            return $"{loan?.AccountTitle1}{conditionalAmpersand}{loan?.AccountTitle2}";
        }
    }
    public override string Id => AccountNumber;
    public string AccountNumber => loan?.AccountNumber.ToString() ?? "";
    public override string Title
    {
        get
        {
            if (loan is null && quote is null)
            {
                return string.Empty;
            }
            if (IsSecuredInvestment)
            {
                return "Secured Investment";
            }
            if (IsPropertyFinanceLoan)
            {
                return "Property Finance Loan";
            }
            if (IsBusinessLoan)
            {
                return "Car Loan";
            }
            if (IsPersonalLoan)
            {
                return "Personal Loan";
            }
            if (quote is not null)
            {
                return "Loan Quote";
            }
            return base.Title;
        }
    }
    public override string BusinessType => Descriptors.BusinessType.Finance.ToString();
    public override string Type
    {
        get
        {
            if (IsSecuredInvestment)
            {
                return "SECURED INVESTMENT";    //piggy bank icon
            }
            if (IsPropertyFinanceLoan)
            {
                return "PROPERTY INVESTMENT";    //house icon
            }
            return "PERSONAL LOAN";             //dollar bill icon
        }
    }
    public override string Subtitle
    {
        get
        {
            if (loan is null && quote is null)
            {
                return string.Empty;
            }
            if (IsSecuredInvestment && !string.IsNullOrEmpty(loan?.LoanTerm))
            {
                return loan.LoanTerm.ToLower();
            }
            if (IsPropertyFinanceLoan)
            {
                return loan?.ProjectAddress ?? "";
            }
            if (IsBusinessLoan)
            {
                return "Business use";
            }
            if (IsUnsecured)
            {
                return "Unsecured";
            }
            if (IsSecured)
            {
                return "Secured";
            }
            var splitDescriptions = loan?.FinanceProductSubType?.Split(" - ");
            if (splitDescriptions is null)
            {
                return string.Empty;
            }
            var shouldGetSecondPart = splitDescriptions.Length > 1;
            if (shouldGetSecondPart)
            {
                return splitDescriptions[1];
            }
            return string.Empty;
        }
    }
    public bool IsBusinessLoan => loan?.FinanceProductSubType?.EqualsInvariantIgnoreCase("business loan - secured") ?? false;
    public bool IsSecuredInvestment => loan?.AccountType?.EqualsInvariantIgnoreCase("CD") ?? false;
    public bool IsPropertyFinanceLoan => loan?.AccountType?.EqualsInvariantIgnoreCase("CL") ?? false;
    public bool IsPersonalLoan => loan?.AccountType?.EqualsInvariantIgnoreCase("IL") ?? false;
    public bool IsFinanceQuote => quote is not null;
    public bool IsUnsecured
    {
        get
        {
            if (loan != null)
            {
                return loan?.FinanceProductSubType?.Contains(" unsecured", StringComparison.InvariantCultureIgnoreCase) ?? false;
            }
            else if (quote != null)
            {
                return !quote.Secured;
            }
            return false;
        }
    }
    public bool IsSecured
    {
        get
        {
            if (loan != null)
            {
                return loan?.FinanceProductSubType?.Contains(" secured", StringComparison.InvariantCultureIgnoreCase) ?? false;
            }
            else if (quote != null)
            {
                return quote.Secured;
            }
            return false;
        }
    }
    public string Payments
    {
        get
        {
            if (quote is not null)
            {
                return $"${quote.RepaymentAmount:n2} paying {quote.RepaymentFrequency.ToLowerInvariant()}";
            }
            return string.Empty;
        }
    }
    public string QuoteAmount
    {
        get
        {
            if (quote is not null)
            {
                return $"${quote.LoanAmount:n2} over {quote.LoanTermYears} years @ {quote.InterestRate}% interest P.A.";
            }
            return string.Empty;
        }
    }
    public string QuoteId => quote?.QuoteId ?? string.Empty;
    public string QuoteType
    {
        get
        {
            if(loan is not null) return string.Empty;
            return (quote?.LoanType) switch
            {
                "DEBT_CONSOLIDATION" => "Refinancing",
                "CAR" => "Vehicle",
                _ => "Other",
            };
        }
    }
}
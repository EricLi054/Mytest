using Membership.Types.Finance;
using Membership.Types.Products.AnnuityProducts;

namespace Membership.Tests.Types.Products.AnnuityProducts;

[TestFixture]
public class FinanceProductHoldingTests
{
    [Test]
    public void FinanceProductHolding_WhenPersonLoanSecured_ReturnsCorrectData()
    {
        // Arrange
        FinanceLoan loan = new()
        {
            AccountType = "IL",
            AccountTitle1 = "John Smith",
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
        };

        // Act
        var financeProductHolding = new FinanceProductHolding(loan);

        // Assert
        Assert.That(financeProductHolding.Title, Is.EqualTo("Personal Loan"));
        Assert.That(financeProductHolding.Subtitle, Is.EqualTo("Secured"));
    }

    [Test]
    public void FinanceProductHolding_WhenPersonLoanUnsecured_ReturnsCorrectData()
    {
        // Arrange
        FinanceLoan loan = new()
        {
            AccountType = "IL",
            AccountTitle1 = "John Smith",
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
        };

        // Act
        var financeProductHolding = new FinanceProductHolding(loan);

        // Assert
        Assert.That(financeProductHolding.Title, Is.EqualTo("Personal Loan"));
        Assert.That(financeProductHolding.Subtitle, Is.EqualTo("Unsecured"));
    }

    [Test]
    public void FinanceProductHolding_WhenSecuredInvestmentTwoYear_ReturnsCorrectData()
    {
        // Arrange
        FinanceLoan loan = new()
        {
            AccountType = "CD",
            AccountTitle1 = "John Smith",
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
        };

        // Act
        var financeProductHolding = new FinanceProductHolding(loan);

        // Assert
        Assert.That(financeProductHolding.Title, Is.EqualTo("Secured Investment"));
        Assert.That(financeProductHolding.Subtitle, Is.EqualTo("24 month(s)"));
    }

    [Test]
    public void FinanceProductHolding_WhenSecuredInvestmentSixMonths_ReturnsCorrectData()
    {
        // Arrange
        FinanceLoan loan = new()
        {
            AccountType = "CD",
            AccountTitle1 = "John Smith",
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
        };

        // Act
        var financeProductHolding = new FinanceProductHolding(loan);

        // Assert
        Assert.That(financeProductHolding.Title, Is.EqualTo("Secured Investment"));
        Assert.That(financeProductHolding.Subtitle, Is.EqualTo("12 month(s)"));
        Assert.That(financeProductHolding.InterestFrequency, Is.EqualTo("paid 6 monthly"));
    }

    [Test]
    public void FinanceProductHolding_WhenBusinessLoan_ReturnsCorrectData()
    {
        // Arrange
        FinanceLoan loan = new()
        {
            AccountType = "IL",
            AccountTitle1 = "John Smith",
            AccountTitle2 = "",
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
        };

        // Act
        var financeProductHolding = new FinanceProductHolding(loan);

        // Assert
        Assert.That(financeProductHolding.Title, Is.EqualTo("Car Loan"));
        Assert.That(financeProductHolding.Subtitle, Is.EqualTo("Business use"));
    }

    [Test]
    public void FinanceProductHolding_WhenPropertyLoan_ReturnsCorrectData()
    {
        // Arrange
        FinanceLoan loan = new()
        {
            AccountType = "CL",
            AccountTitle1 = "John Smith",
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
        };

        // Act
        var financeProductHolding = new FinanceProductHolding(loan);

        // Assert
        Assert.That(financeProductHolding.Title, Is.EqualTo("Property Finance Loan"));
        Assert.That(financeProductHolding.Subtitle, Is.EqualTo("Cinnamon Meander, Two Rocks"));
    }

    [Test]
    public void FinanceProductHolding_WhenFinanceQuote_ReturnsCorrectData()
    {
        // Arrange
        FinanceQuote quote = new()
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
        };

        // Act
        var financeProductHolding = new FinanceProductHolding(quote: quote);

        // Assert
        Assert.That(financeProductHolding.Title, Is.EqualTo("Loan Quote"));
        Assert.That(financeProductHolding.Subtitle, Is.EqualTo("Secured"));
    }

    [Test]
    public void FinanceProductHolding_WhenVehicleFinanceQuote_ReturnsCorrectData()
    {
        // Arrange
        FinanceQuote quote = new()
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
        };

        // Act
        var financeProductHolding = new FinanceProductHolding(quote: quote);

        // Assert
        Assert.That(financeProductHolding.Title, Is.EqualTo("Loan Quote"));
        Assert.That(financeProductHolding.Subtitle, Is.EqualTo("Secured"));
        Assert.That(financeProductHolding.QuoteType, Is.EqualTo("Vehicle"));
    }

    [Test]
    public void ExpiryDate_WhenLoanIsNull_ReturnsEmptyString()
    {
        // Arrange
        var financeProductHolding = new FinanceProductHolding(null!);

        // Act
        var expiryDate = financeProductHolding.ExpiryDate;

        // Assert
        Assert.That(expiryDate, Is.EqualTo(string.Empty));
    }

    [Test]
    public void ExpiryDate_WhenExpiryDateAndMaturityDateAreNull_ReturnsEmptyString()
    {
        // Arrange
        var product = new FinanceLoan { ExpiryDate = null, MaturityDate = null };
        var financeProductHolding = new FinanceProductHolding(product);

        // Act
        var expiryDate = financeProductHolding.ExpiryDate;

        // Assert
        Assert.That(expiryDate, Is.EqualTo(string.Empty));
    }

    [Test]
    public void ExpiryDate_WhenExpiryDateIsNull_ReturnsMaturityDate()
    {
        // Arrange
        var maturityDate = new DateTime(2024, 1, 1);
        var product = new FinanceLoan { ExpiryDate = null, MaturityDate = maturityDate };
        var financeProductHolding = new FinanceProductHolding(product);

        // Act
        var expiryDate = financeProductHolding.ExpiryDate;

        // Assert
        Assert.That(expiryDate, Is.EqualTo(maturityDate.ToString("dd MMM yyyy")));
    }

    [Test]
    public void ExpiryDate_WhenMaturityDateIsNull_ReturnsExpiryDate()
    {
        // Arrange
        var expiryDate = new DateTime(2024, 1, 1);
        var product = new FinanceLoan { ExpiryDate = expiryDate, MaturityDate = null };
        var financeProductHolding = new FinanceProductHolding(product);

        // Act
        var result = financeProductHolding.ExpiryDate;

        // Assert
        Assert.That(result, Is.EqualTo(expiryDate.ToString("dd MMM yyyy")));
    }
    [Test]
    public void InterestFrequency_WhenLoanIsNull_ReturnsEmptyString()
    {
        // Arrange
        var financeProductHolding = new FinanceProductHolding(null!);

        // Act
        var result = financeProductHolding.InterestFrequency;

        // Assert
        Assert.That(result, Is.EqualTo(string.Empty));
    }

    [TestCase("Annual", "paid annually")]
    [TestCase("Quarterly", "paid quarterly")]
    [TestCase("Monthly", "paid monthly")]
    [TestCase("6 Monthly Interest", "paid 6 monthly")]
    public void InterestFrequency_WhenLoanInterestFrequencyIsValid_ReturnsExpectedResult(string interestFrequency, string expectedResult)
    {
        // Arrange
        var product = new FinanceLoan { InterestFrequency = interestFrequency };
        var financeProductHolding = new FinanceProductHolding(product);
        // Act
        var result = financeProductHolding.InterestFrequency;

        // Assert
        Assert.That(result, Is.EqualTo(expectedResult));
    }

    [Test]
    public void InterestFrequency_WhenLoanInterestFrequencyIsNull_ReturnsEmptyString()
    {
        // Arrange
        var product = new FinanceLoan { InterestFrequency = null! };
        var financeProductHolding = new FinanceProductHolding(product);

        // Act
        var result = financeProductHolding.InterestFrequency;

        // Assert
        Assert.That(result, Is.EqualTo(string.Empty));
    }

    [Test]
    public void InterestFrequency_WhenLoanInterestFrequencyIsEmpty_ReturnsEmptyString()
    {
        // Arrange
        var product = new FinanceLoan { InterestFrequency = null! };
        var financeProductHolding = new FinanceProductHolding(product);

        // Act
        var result = financeProductHolding.InterestFrequency;

        // Assert
        Assert.That(result, Is.EqualTo(string.Empty));
    }

}
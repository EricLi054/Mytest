using DigitalPlatform.API.Models.Products.AnnuityProducts;
using DigitalPlatform.API.Helpers.ProductMapping;
using DigitalPlatform.API.Models.SourceSystem.Finance;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.Tests.Helpers.ProductMapping
{
    [TestFixture]
    public class FinanceMapperTests
    {
        private FinanceMapper _mapper;

        private ILogger<FinanceMapper> _mockLogger;

        [SetUp]
        public void Setup()
        {
            _mockLogger = Substitute.For<ILogger<FinanceMapper>>();
            _mapper = new FinanceMapper(_mockLogger);
        }

        [Test]
        public void Map_ShouldReturnNullAndLogError_WhenBusinessTypeIsNotFinance()
        {
            var product = new AnnuityProduct
            {
                BusinessType = "NotFinance"
            };

            var result = _mapper.Map(product);

            Assert.That(result, Is.Null);
            _mockLogger.Received(1).LogError("Not supported product type NotFinance");
        }

        [Test]
        public void Map_ShouldReturnNullAndLogError_WhenProductIsNotFinanceProductHolding()
        {
            var product = new AnnuityProduct
            {
                BusinessType = "Finance"
            };

            var result = _mapper.Map(product);
            Assert.That(result, Is.Null);
            _mockLogger.Received(1).LogError("Unexpected product type AnnuityProduct");
        }

        [Test]
        public void Map_ShouldMapFieldsCorrectly_WhenProductIsFinanceProductHolding()
        {
            var loanMock = new FinanceLoan
            {
                AccountNumber = 123456789,
                AccountTitle1 = "John",
                AccountTitle2 = "Doe",
                CurrentBalance = 5000.00,
                InterestRate = 5.5,
                InterestFrequency = "annual",
                CurrentLimit = 10000.00,
                ExpiryDate = DateTime.Parse("2025-12-31"),
                NextInstalmentAmount = 200.00,
                LoanAmount = 10000.00
            };

            var financeProduct = new FinanceProductHolding(loan: loanMock)
            {
                Type = "Loan",
                Title = "Personal Loan",
                Subtitle = "Home Loan"
            };

            var mappedPolicy = _mapper.Map(financeProduct);

            Assert.That(mappedPolicy?.Type, Is.EqualTo(financeProduct.Type));
            Assert.That(mappedPolicy?.Title, Is.EqualTo(financeProduct.Title));
            Assert.That(mappedPolicy?.Subtitle, Is.EqualTo(financeProduct.Subtitle));
            Assert.That(mappedPolicy?.PolicyItems.Count, Is.EqualTo(5)); // Next payment, Current balance, Account Name, Loan Amount, Account no.
            Assert.That(mappedPolicy?.PolicyItems[1].Label, Is.EqualTo("Current balance"));
            Assert.That(mappedPolicy?.PolicyItems[1].Value, Is.EqualTo("$5,000.00@5.5% P.A. paid annually"));
        }

        [Test]
        public void Map_ShouldMapActionsCorrectly_WhenActionsExist()
        {
            var quoteMock = new FinanceQuote
            {
                QuoteId = "Q12345",
                RepaymentAmount = 500.00M,
                RepaymentFrequency = "monthly",
                LoanAmount = 15000.00M,
                LoanTermYears = 5,
                InterestRate = 5.5M,
                LoanType = "DEBT_CONSOLIDATION"
            };

            var financeProduct = new FinanceProductHolding(quote: quoteMock)
            {
                Subtitle = "Loan Quote",
                Title = "Home Loan",
            };

            var mappedPolicy = _mapper.Map(financeProduct);

            Assert.That(mappedPolicy?.Actions.Count, Is.EqualTo(1));
            Assert.That(mappedPolicy?.Actions[0].Label, Is.EqualTo("Apply now"));
            Assert.That(mappedPolicy?.Actions[0].Link, Is.EqualTo("/products/finance/apply?quoteId=Q12345"));
            Assert.That(mappedPolicy?.Actions[0].Type, Is.EqualTo("primary"));
        }

        [Test]
        public void Map_ShouldHandleSecureInvestmentItemsCorrectly()
        {
            var loanMock = new FinanceLoan
            {
                AccountNumber = 987654321,
                AccountType = "CD",
                AccountTitle1 = "Secured",
                AccountTitle2 = "Investment",
                CurrentBalance = 10000.00,
                InterestRate = 5.0,
                InterestFrequency = "annual",
                LoanAmount = 10000.00,
                ExpiryDate = DateTime.Parse("2025-12-31")
            };

            var financeProduct = new FinanceProductHolding(loan: loanMock);

            var mappedPolicy = _mapper.Map(financeProduct);

            Assert.That(mappedPolicy?.PolicyItems.Count, Is.EqualTo(4));
            Assert.That(mappedPolicy?.PolicyItems[0].Label, Is.EqualTo("Current balance"));
            Assert.That(mappedPolicy?.PolicyItems[0].Value, Is.EqualTo("$10,000.00@5% P.A. paid annually"));
            Assert.That(mappedPolicy?.PolicyItems[2].Label, Is.EqualTo("Matures"));
            Assert.That(mappedPolicy?.PolicyItems[2].Value, Is.EqualTo("31 Dec 2025"));
        }

        [Test]
        public void Map_ShouldHandleFinanceQuoteItemsCorrectly()
        {
            var quoteMock = new FinanceQuote
            {
                LoanAmount = 25000.00M,
                LoanTermYears = 10,
                InterestRate = 5.5M,
                RepaymentAmount = 240.00M,
                RepaymentFrequency = "FORTNIGHTLY"
            };

            var financeProduct = new FinanceProductHolding(quote: quoteMock);

            var mappedPolicy = _mapper.Map(financeProduct);

            Assert.That(mappedPolicy?.PolicyItems.Count, Is.EqualTo(4));
            Assert.That(mappedPolicy?.PolicyItems[0].Label, Is.EqualTo("Payments"));
            Assert.That(mappedPolicy?.PolicyItems[0].Value, Is.EqualTo("$240.00 paying fortnightly"));
            Assert.That(mappedPolicy?.PolicyItems[1].Label, Is.EqualTo("Quote Amount"));
            Assert.That(mappedPolicy?.PolicyItems[1].Value, Is.EqualTo("$25,000.00 over 10 years @ 5.5% interest P.A."));
        }

        [Test]
        public void Map_ShouldAddNextPaymentItem_WhenNextPaymentAmountIsNotBlank()
        {
            var loanMock = new FinanceLoan
            {
                AccountNumber = 123456789,
                NextInstalmentAmount = 250.00,
                NextPayment = DateTime.Parse("2025-02-01")
            };

            var financeProduct = new FinanceProductHolding(loan: loanMock);

            var mappedPolicy = _mapper.Map(financeProduct);

            Assert.That(mappedPolicy?.PolicyItems.Count, Is.EqualTo(5));
            Assert.That(mappedPolicy?.PolicyItems[0].Label, Is.EqualTo("Next payment"));
            Assert.That(mappedPolicy?.PolicyItems[0].Value, Is.EqualTo("$250.00 on 01 Feb 2025"));
        }

        [Test]
        public void Map_ShouldAddTooltipToNextPaymentItem_WhenTooltipIsAvailable()
        {
            var loanMock = new FinanceLoan
            {
                AccountNumber = 123456789,
                AccountType = "CL",
                NextInstalmentAmount = 300.00,
                NextPayment = DateTime.Parse("2025-03-01")
            };

            var financeProduct = new FinanceProductHolding(loan: loanMock);

            var mappedPolicy = _mapper.Map(financeProduct);

            Assert.That(mappedPolicy?.PolicyItems[0].Label, Is.EqualTo("Next payment"));
            Assert.That(mappedPolicy?.PolicyItems[0].Value, Is.EqualTo("$300.00 on 01 Mar 2025"));
            Assert.That(mappedPolicy?.PolicyItems[0].Tooltip, Is.Not.Null);
            Assert.That(mappedPolicy?.PolicyItems[0].Tooltip?.Title, Is.EqualTo("Repayment Method"));
            Assert.That(mappedPolicy?.PolicyItems[0].Tooltip?.Message, Is.EqualTo("The repayment amount is the amount that appears on your loan contract and does not include any outstanding payments. Please contact {RAC Finance|tel:6150 6249} for further details."));
        }

        [Test]
        public void Map_ShouldHandleQuoteAmountFormattingCorrectly()
        {
            var quoteMock = new FinanceQuote
            {
                LoanAmount = 25000.00M,
                LoanTermYears = 10,
                InterestRate = 5.5M
            };

            var financeProduct = new FinanceProductHolding(quote: quoteMock);

            var mappedPolicy = _mapper.Map(financeProduct);

            Assert.That(mappedPolicy?.PolicyItems.Count, Is.EqualTo(4));
            Assert.That(mappedPolicy?.PolicyItems[1].Label, Is.EqualTo("Quote Amount"));
            Assert.That(mappedPolicy?.PolicyItems[1].Value, Is.EqualTo("$25,000.00 over 10 years @ 5.5% interest P.A."));
        }
    }
}
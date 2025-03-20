using Membership.Services;
using Membership.Types.Finance;
using Shared.Tests.Helpers;

namespace Membership.Tests.Services;

[TestFixture]
public class FinanceServiceTests : BaseServiceTests<FinanceService>
{
    private FinanceService _financeService = null!;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.FinanceLoansApiEndpointKey, "/loans");
        MockConfigurationValue(ConfigurationKeys.FinanceQuotesApiEndpointKey, "/quotes");
        MockConfigurationValue(ConfigurationKeys.FinanceOrganisation, "UAT_RACF");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "EXAMPLEAPIKEY");

        _financeService = new FinanceService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object,
            LoggerMock.Object);
    }

    [Test]
    public async Task GetProductListAsync_MultiplePartyProducts_ReturnsAllPartyProducts()
    {
        // Arrange
        string rimId = "1234";

        FinanceProductResponse expectedFinanceLoansResponse = new()
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
                    }
                },
                new()
                {
                    ProductType = "CreditCard",
                    FinanceProduct = new()
                }
            ]
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedFinanceLoansResponse);
        MockHttpResponse(responseMessage);

        // Act
        FinanceProductResponse? result = await _financeService.GetProductListAsync(rimId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.PartyProductList, Is.Not.Null);
        Assert.That(result?.PartyProductList!.Count, Is.EqualTo(2));
    }

    [Test]
    public async Task GetProductListAsync_NullResponse_ReturnsEmptyFinanceProductResponse()
    {
        var rimId = "1234";

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage<FinanceProductResponse?>(null);
        MockHttpResponse(responseMessage);

        // Act
        FinanceProductResponse? result = await _financeService.GetProductListAsync(rimId);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetFinanceQuotesAsync_ValidCRMId_ReturnsFinanceQuotes()
    {
        // Arrange
        string crmId = "1234";

        List<FinanceQuote> expectedFinanceQuoteResponse =
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
            }
        ];

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedFinanceQuoteResponse);
        MockHttpResponse(responseMessage);

        // Act
        List<FinanceQuote>? result = await _financeService.GetFinanceQuotesAsync(crmId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result?.Count, Is.EqualTo(1));
        Assert.That(result?.First().LoanAmount, Is.EqualTo(8123.0M));
        Assert.That(result?.First().LoanType, Is.EqualTo("DEBT_CONSOLIDATION"));
    }
}
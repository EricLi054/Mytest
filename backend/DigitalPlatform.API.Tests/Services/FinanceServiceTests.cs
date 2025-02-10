using Dapr;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.Finance;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Tests.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NSubstitute.ExceptionExtensions;
using NSubstitute.Extensions;
using NUnit.Framework.Internal;

namespace DigitalPlatform.API.Tests.Services;
[TestFixture]
public class FinanceServiceTests
{
    private readonly IDaprService _daprService;
    private readonly IConfiguration _configuration;
    private readonly FinanceService _financeService;

    public FinanceServiceTests()
    {
        _daprService = Substitute.For<IDaprService>();
        _configuration = Substitute.For<IConfiguration>();
        var _logger = Substitute.For<ILogger<FinanceService>>();
        _financeService = new FinanceService(_daprService, _configuration, _logger);
    }

    [Test]
    public async Task GetProductList_ValidRimId_ReturnsFinanceProductResponse()
    {
        // Arrange
        string rimId = FinanceTestData.RimID;

        string baseUrl = "https://example.com";
        string endpoint = "api/getProductList";
        string serviceId = "123";
        string userName = "FinanceUserName";
        string organisation = "RAC";
        string query = $"?RIMNumber={rimId}&ServiceId={serviceId}&UserName={userName}&Organisation={organisation}";

        _configuration[ConfigDescriptors.API_BASE_URL].Returns(baseUrl);
        _configuration[ConfigDescriptors.FINANCE_API_GET_PRODUCT_LIST_URL].Returns(endpoint);
        _configuration[SecretDescriptors.FINANCE_SERVICE_ID].Returns(serviceId);
        _configuration[SecretDescriptors.FINANCE_USER_NAME].Returns(userName);
        _configuration[SecretDescriptors.FINANCE_ORGANISATION].Returns(organisation);

        _daprService.InvokeDaprGetMethodAsync<FinanceProductResponse>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(FinanceTestData.EmptyFinanceProductResponse));

        _daprService.Configure().InvokeDaprGetMethodAsync<FinanceProductResponse>(baseUrl, $"{endpoint}{query}")
            .Returns(Task.FromResult(FinanceTestData.ValidFinanceProductResponse));

        // Act
        FinanceProductResponse result = await _financeService.GetProductList(rimId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Success, Is.EqualTo("true"));
        Assert.That(result.PartyProductList, Is.Not.Null);
        Assert.That(result?.PartyProductList!.Count, Is.EqualTo(1));
    }

    [Test]
    public void GetProductList_HttpRequestException_LogsErrorAndReturnsEmptyResponse()
    {
        // Arrange
        string rimId = FinanceTestData.RimID;
        HttpRequestException httpRequestException = new("Simulated HTTP error");

        _daprService.InvokeDaprGetMethodAsync<FinanceProductResponse>(Arg.Any<string>(), Arg.Any<string>())
            .Throws(httpRequestException);

        // Act & Assert       

        Assert.ThrowsAsync<HttpRequestException>(async () => await _financeService.GetProductList(rimId));
    }

    [Test]
    public async Task GetProductList_NullResponse_ReturnsEmptyFinanceProductResponse()
    {
        // Arrange
        string rimId = FinanceTestData.RimID;

        _daprService.InvokeDaprGetMethodAsync<FinanceProductResponse>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(FinanceTestData.EmptyFinanceProductResponse));

        _daprService.Configure().InvokeDaprGetMethodAsync<FinanceProductResponse>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult<FinanceProductResponse>(null!));

        // Act
        FinanceProductResponse result = await _financeService.GetProductList(rimId);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public void GetProductList_ExceptionInDaprService_ThrowsError()
    {
        // Arrange
        string rimId = FinanceTestData.RimID;
        DaprException daprException = new("Simulated error");

        _daprService.InvokeDaprGetMethodAsync<FinanceProductResponse>(Arg.Any<string>(), Arg.Any<string>())
            .Throws(daprException);

        // Assert
        Assert.ThrowsAsync<DaprException>(async () => await _financeService.GetProductList(rimId));
        // Add more assertions based on your specific requirements
    }

    [Test]
    public void GetProductList_ExceptionInDaprService_ThrowsJsonReaderException()
    {
        // Arrange
        string rimId = FinanceTestData.RimID;
        JsonReaderException jsonReaderException = new("Simulated error");

        _daprService.InvokeDaprGetMethodAsync<FinanceProductResponse>(Arg.Any<string>(), Arg.Any<string>())
            .Throws(jsonReaderException);

        // Assert
        Assert.ThrowsAsync<JsonReaderException>(async () => await _financeService.GetProductList(rimId));
        // Add more assertions based on your specific requirements
    }

    [Test]
    public async Task GetProductList_MultiplePartyProducts_ReturnsAllPartyProducts()
    {
        // Arrange
        string rimId = FinanceTestData.RimID;

        string baseUrl = "https://example.com";
        string endpoint = "api/getProductList";
        string serviceId = "123";
        string userName = "FinanceUserName";
        string organisation = "RAC";
        string query = $"?RIMNumber={rimId}&ServiceId={serviceId}&UserName={userName}&Organisation={organisation}";

        _configuration[ConfigDescriptors.API_BASE_URL].Returns(baseUrl);
        _configuration[ConfigDescriptors.FINANCE_API_GET_PRODUCT_LIST_URL].Returns(endpoint);
        _configuration[SecretDescriptors.FINANCE_SERVICE_ID].Returns(serviceId);
        _configuration[SecretDescriptors.FINANCE_USER_NAME].Returns(userName);
        _configuration[SecretDescriptors.FINANCE_ORGANISATION].Returns(organisation);

        _daprService.InvokeDaprGetMethodAsync<FinanceProductResponse>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(FinanceTestData.EmptyFinanceProductResponse));

        _daprService.Configure().InvokeDaprGetMethodAsync<FinanceProductResponse>(baseUrl, $"{endpoint}{query}")
            .Returns(Task.FromResult(FinanceTestData.ValidFinanceProductResponseWithMultipleProducts));

        // Act
        FinanceProductResponse result = await _financeService.GetProductList(rimId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.PartyProductList, Is.Not.Null);
        Assert.That(result?.PartyProductList!.Count, Is.EqualTo(2));
        // Add more assertions based on your specific requirements
    }

    [Test]
    public async Task GetFinanceQuotes_ValidCRMId_ReturnsFinanceQuotes()
    {
        // Arrange
        string crmId = FinanceTestData.CRMID;

        string baseUrl = "https://example.com";
        string endpoint = $"/{crmId}/finance-quotes";

        _configuration[ConfigDescriptors.API_BASE_URL].Returns(baseUrl);
        _configuration[ConfigDescriptors.PERSON_API_GET_FINANCE_QUOTES].Returns(endpoint);

        _daprService.InvokeDaprGetMethodAsync<List<FinanceQuote>>(baseUrl, $"{endpoint}")
            .Returns(Task.FromResult(FinanceTestData.FinanceLoanQuote));

        // Act
        List<FinanceQuote> result = await _financeService.GetFinanceQuotes(crmId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result?.Count, Is.EqualTo(1));
        Assert.That(result?.First().LoanAmount, Is.EqualTo(8123.0M));
        Assert.That(result?.First().LoanType, Is.EqualTo("DEBT_CONSOLIDATION"));
    }
}
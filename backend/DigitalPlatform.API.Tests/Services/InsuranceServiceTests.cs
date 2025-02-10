using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.Insurance;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Tests.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute.ExceptionExtensions;
using NSubstitute.Extensions;
using NUnit.Framework.Internal;

namespace DigitalPlatform.API.Tests.Services;
[TestFixture]
public class InsuranceServiceTests
{
    private IDaprService _daprService;
    private IConfiguration _configuration;
    private InsuranceService _insuranceService;

    public InsuranceServiceTests()
    {
        _daprService = Substitute.For<IDaprService>();
        _configuration = Substitute.For<IConfiguration>();
        ILogger<InsuranceService> _logger = Substitute.For<ILogger<InsuranceService>>();
        _insuranceService = new InsuranceService(_daprService, _configuration, _logger);
    }

    [Test]
    public async Task GetPortfolioSummary_ValidShieldContactNumber_ReturnsInsurancePortfolioSummary()
    {
        // Arrange
        string shieldContactNumber = InsuranceTestData.ShieldContactNumber;

        string baseUrl = "https://example.com";
        string endpoint = "api/getInsurancePortfolioSummary";
        string query = $"?contactId={shieldContactNumber}";
        string environmentHeaderKey = "Environment";
        string environment = "Test";

        _configuration[ConfigDescriptors.API_BASE_URL].Returns(baseUrl);
        _configuration[ConfigDescriptors.INSURANCE_API_GET_PORTFOLIO_SUMMARY_URL].Returns(endpoint);
        _configuration[ConfigDescriptors.INSURANCE_API_ENVIRONMENT_HEADER_KEY].Returns(environmentHeaderKey);
        _configuration[ConfigDescriptors.INSURANCE_API_ENVIRONMENT].Returns(environment);

        _daprService.InvokeDaprGetMethodAsync<InsurancePortfolioSummary>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<Dictionary<string, string>>())
            .Returns(Task.FromResult(InsuranceTestData.EmptySummary));

        _daprService.Configure().InvokeDaprGetMethodAsync<InsurancePortfolioSummary>(baseUrl, $"{endpoint}{query}", Arg.Any<Dictionary<string, string>>())
            .Returns(Task.FromResult(InsuranceTestData.SummaryWithValidPolicyList));

        // Act
        InsurancePortfolioSummary result = await _insuranceService.GetPortfolioSummary(shieldContactNumber);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(InsuranceTestData.SummaryWithValidPolicyList));
    }

    [Test]
    public async Task GetContactByExternalShieldNumber_ValidExternalShieldNumber_ReturnsContact()
    {
        // Arrange
        string externalShieldNumber = InsuranceTestData.ExternalShieldNumber;

        string baseUrl = "https://example.com";
        string endpoint = "api/getContact";
        string query = $"?externalNumber={externalShieldNumber}";
        string environmentHeaderKey = "Environment";
        string environment = "Test";

        _configuration[ConfigDescriptors.API_BASE_URL].Returns(baseUrl);
        _configuration[ConfigDescriptors.INSURANCE_API_GET_CONTACTS_URL].Returns(endpoint);
        _configuration[ConfigDescriptors.INSURANCE_API_ENVIRONMENT_HEADER_KEY].Returns(environmentHeaderKey);
        _configuration[ConfigDescriptors.INSURANCE_API_ENVIRONMENT].Returns(environment);

        _daprService.InvokeDaprGetMethodAsync<Contact>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<Dictionary<string, string>>())
            .Returns(Task.FromResult(InsuranceTestData.EmptyContact));

        _daprService.Configure().InvokeDaprGetMethodAsync<Contact>(baseUrl, $"{endpoint}{query}", Arg.Any<Dictionary<string, string>>())
            .Returns(Task.FromResult(InsuranceTestData.ValidContact));

        // Act
        Contact result = await _insuranceService.GetContactByExternalShieldNumber(externalShieldNumber);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(InsuranceTestData.ValidContact.Id));
    }

    [Test]
    public async Task GetInsurancePolicies_ValidPolicyNumber_ReturnsInsuranceProductResponse()
    {
        // Arrange
        string policyNumber = InsuranceTestData.PolicyNumber;

        string baseUrl = "https://example.com";
        string endpoint = "api/getPolicy/";
        string query = $"?excludeInstallment=false";
        string environmentHeaderKey = "Environment";
        string environment = "Test";

        _configuration[ConfigDescriptors.API_BASE_URL].Returns(baseUrl);
        _configuration[ConfigDescriptors.INSURANCE_API_GET_POLICY_URL].Returns(endpoint);
        _configuration[ConfigDescriptors.INSURANCE_API_ENVIRONMENT_HEADER_KEY].Returns(environmentHeaderKey);
        _configuration[ConfigDescriptors.INSURANCE_API_ENVIRONMENT].Returns(environment);

        _daprService.InvokeDaprGetMethodAsync<InsuranceProductResponse>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<Dictionary<string, string>>())
            .Returns(Task.FromResult(InsuranceTestData.EmptyInsuranceProductResponse));

        _daprService.Configure().InvokeDaprGetMethodAsync<InsuranceProductResponse>(baseUrl, $"{endpoint}{policyNumber}{query}", Arg.Any<Dictionary<string, string>>())
            .Returns(Task.FromResult(InsuranceTestData.ValidMotorInsuranceProductResponse1));

        // Act
        InsuranceProductResponse result = await _insuranceService.GetInsurancePolicies(policyNumber);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(InsuranceTestData.ValidMotorInsuranceProductResponse1.Id));
    }
}
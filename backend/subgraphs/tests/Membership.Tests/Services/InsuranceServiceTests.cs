using Membership.Services;
using Membership.Tests.Data;
using Membership.Types.FinOps;
using Membership.Types.Insurance;
using Shared.Exceptions;
using Shared.Tests.Helpers;

namespace Membership.Tests.Services;
public class InsuranceServiceTests : BaseServiceTests<InsuranceService>
{
    private InsuranceService _insuranceService = null!;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "EXAMPLEAPIKEY");
        MockConfigurationValue(ConfigurationKeys.ShieldEnvironment, "SomeShieldEnvironmentValue");

        _insuranceService = new InsuranceService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object,
            LoggerMock.Object);
    }

    [Test]
    public async Task GetPortfolioSummaryAsync_ValidShieldContactNumber_ReturnsInsurancePortfolioSummary()
    {
        // Arrange
        string shieldContactNumber = InsuranceTestData.ShieldContactNumber;

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(InsuranceTestData.SummaryWithValidPolicyList);
        MockHttpResponse(responseMessage);

        // Act
        InsurancePortfolioSummary result = await _insuranceService.GetPortfolioSummaryAsync(shieldContactNumber);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(InsuranceTestData.SummaryWithValidPolicyList).UsingPropertiesComparer());
    }

    [Test]
    public void GetPortfolioSummaryAsync_ShouldThrowNotFoundException_WhenPortfolioSummaryNotFound()
    {
        string shieldContactNumber = InsuranceTestData.ShieldContactNumber;

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage<InsurancePortfolioSummary?>(null);
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<NotFoundException>(async () =>
          await _insuranceService.GetPortfolioSummaryAsync(shieldContactNumber));
    }

    [Test]
    public void GetPortfolioSummaryAsync_ShouldThrowArgumentException_WhenInputIsEmpty()
    {
        string shieldContactNumber = "";

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage<InsurancePortfolioSummary?>(null);
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<ArgumentException>(async () =>
          await _insuranceService.GetPortfolioSummaryAsync(shieldContactNumber));
    }


    [Test]
    public async Task GetContactByExternalShieldNumberAsync_ValidExternalShieldNumber_ReturnsContact()
    {
        // Arrange
        string externalShieldNumber = InsuranceTestData.ExternalShieldNumber;

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(InsuranceTestData.ValidContact);
        MockHttpResponse(responseMessage);

        // Act
        Contact result = await _insuranceService.GetContactByExternalShieldNumberAsync(externalShieldNumber);

        //// Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(InsuranceTestData.ValidContact).UsingPropertiesComparer());
    }

    [Test]
    public void GetContactByExternalShieldNumberAsync_ShouldThrowNotFoundException_WhenContactNotFound()
    {
        string externalShieldNumber = InsuranceTestData.ExternalShieldNumber;

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage<Contact?>(null);
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<NotFoundException>(async () =>
        await _insuranceService.GetContactByExternalShieldNumberAsync(externalShieldNumber));
    }

    [Test]
    public void GetContactByExternalShieldNumberAsync_ShouldThrowArgumentException_WhenInputIsEmpty()
    {
        string externalShieldNumber = "";

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage<Contact?>(null);
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<ArgumentException>(async () =>
        await _insuranceService.GetContactByExternalShieldNumberAsync(externalShieldNumber));
    }

    [Test]
    public async Task GetInsurancePoliciesAsync_ValidPolicyNumber_ReturnsInsuranceProductResponse()
    {
        //// Arrange
        string policyNumber = InsuranceTestData.PolicyNumber;

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(InsuranceTestData.ValidMotorInsuranceProductResponse1);
        MockHttpResponse(responseMessage);

        // Act
        InsuranceProductResponse result = await _insuranceService.GetInsurancePoliciesAsync(policyNumber);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(InsuranceTestData.ValidMotorInsuranceProductResponse1).UsingPropertiesComparer());
    }

    [Test]
    public void GetInsurancePoliciesAsync_ShouldThrowNotFoundException_WhenPolicyNotFound()
    {
        string policyNumber = InsuranceTestData.PolicyNumber;

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage<InsuranceProductResponse?>(null);
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<NotFoundException>(async () =>
          await _insuranceService.GetInsurancePoliciesAsync(policyNumber));
    }

    [Test]
    public void GetInsurancePoliciesAsync_ShouldThrowArgumentException_WhenInputIsEmpty()
    {
        string policyNumber = "";

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage<InsuranceProductResponse?>(null);
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<ArgumentException>(async () =>
          await _insuranceService.GetInsurancePoliciesAsync(policyNumber));
    }

}

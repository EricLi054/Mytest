using Membership.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Tests.Helpers;

namespace Membership.Tests.Services;

[TestFixture]
public class AddressServiceTests : BaseServiceTests<AddressService>
{
    private AddressService _addressService;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.AddressManagementApiEndpointKey, "/ADDRMGMT/v1");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "SECRET");

        _addressService = new AddressService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object,
            LoggerMock.Object);
    }

    [Test]
    public void GetGnafAddressList_HttpRequestException_LogsError()
    {
        MockHttpError("Unknown error occurred");

        Assert.ThrowsAsync<HttpRequestException>(async () =>
        {
            await _addressService.GetPafAddressAsync("");
        });

        LoggerMock.VerifyLog(LogLevel.Error, "Unknown error occurred", Times.Once);
    }

    [Test]
    public async Task GetPafAddressList_ValidConfiguration_ReturnsAddressLookup()
    {
        var expectedResponse = AddressTestData.ValidAddressLookupResponse;
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedResponse);
        MockHttpResponse(responseMessage);

        var result = await _addressService.GetPafAddressListAsync("832 wellington");

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Meta?.Count, Is.EqualTo(expectedResponse.Meta?.Count));
        Assert.That(result.Data?[0].Id, Is.EqualTo(expectedResponse.Data?[0].Id));
    }

    [Test]
    public async Task GetPafAddress_ValidConfiguration_ReturnsPAFVerification()
    {
        var expectedResponse = AddressTestData.ValidPAFVerificationResponse;
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedResponse);
        MockHttpResponse(responseMessage);

        var result = await _addressService.GetPafAddressAsync("123456");

        Assert.That(result?.Data, Is.Not.Null);
        Assert.That(result.Data.Type, Is.EqualTo("addresses"));
        Assert.That(result.Data.Attributes.BuildingNumber, Is.EqualTo("832"));
    }

    [Test]
    public async Task GetPafAddress_ValidConfiguration_ReturnsPAFVerificationWith404()
    {
        var expectedResponse = AddressTestData.NotFoundPAFVerificationResponse;
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedResponse);
        MockHttpResponse(responseMessage);

        var result = await _addressService.GetPafAddressAsync("123456");

        Assert.That(result?.Data, Is.Null);
        Assert.That(result?.Errors, Is.Not.Null);
        Assert.That(result?.Errors?.Length, Is.EqualTo(1));
        Assert.That(result?.Errors?[0].Status, Is.EqualTo("404"));
        Assert.That(result?.Errors?[0].Title, Is.EqualTo("Address not found"));
    }
}
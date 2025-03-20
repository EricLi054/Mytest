using Membership.Services;
using Shared.Tests.Helpers;
using Membership.Types.ADB2CGraph;
using Microsoft.Extensions.Logging;
using Moq;

namespace Membership.Tests.Services;

[TestFixture]
public class ADB2CGraphServiceTests : BaseServiceTests<ADB2CGraphService>
{
    private ADB2CGraphService _adb2cService = null!;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "EXAMPLEAPIKEY");

        _adb2cService = new ADB2CGraphService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object, LoggerMock.Object);
    }

    [Test]
    public async Task GetUserByEmailAsync_ValidLinkedUser_ReturnsADB2CAccount()
    {
        var expectedAccount = new ADB2CAccount { Id = Guid.NewGuid(), AccountEnabled = true, DisplayName = "Test User", CrmId = Guid.NewGuid() };
        var accounts = new List<ADB2CAccount> { expectedAccount };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(accounts);
        MockHttpResponse(responseMessage);

        var result = await _adb2cService.GetUserByEmailAsync("test@test.com");

        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedAccount).UsingPropertiesComparer());
    }

    [Test]
    public async Task GetUserByEmailAsync_ValidUnlinkedUser_ReturnsADB2CAccount()
    {
        var expectedAccount = new ADB2CAccount { Id = Guid.NewGuid(), AccountEnabled = true, DisplayName = "Test User", CrmId = null };
        var accounts = new List<ADB2CAccount> { expectedAccount };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(accounts);
        MockHttpResponse(responseMessage);

        var result = await _adb2cService.GetUserByEmailAsync("test@test.com");

        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedAccount).UsingPropertiesComparer());
    }

    [Test]
    public void GetUserByEmailAsync_ValidUser_ThrowsException()
    {
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(new List<ADB2CAccount>());
        MockHttpResponse(responseMessage);
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, new Exception("Exception message"));

        Assert.ThrowsAsync<Exception>(async () => await _adb2cService.GetUserByEmailAsync("i-will-break@test.com"));
        LoggerMock.VerifyLog(LogLevel.Error, "Exception message", Times.Once);
    }

    [Test]
    public void GetUserByEmailAsync_InvalidInput_ThrowsException()
    {
        var invalidEmail = "  ";
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(new List<ADB2CAccount>());
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<ArgumentException>(async () => await _adb2cService.GetUserByEmailAsync(invalidEmail));
        LoggerMock.VerifyLog(LogLevel.Error, "emailAddress cannot be null or empty. (Parameter 'emailAddress')", Times.Once);
    }
}

using Shared.Tests.Helpers;
using Microsoft.Extensions.Logging;
using Moq;
using Person.API.ADB2C.Services;
using Person.GraphQL.Types.ADB2CGraph;
using System.Net;

namespace Person.Tests.API.ADB2C;

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
        var expectedAccount = new ADB2CUserAccount { Id = Guid.NewGuid(), AccountEnabled = true, DisplayName = "Test User", CrmId = Guid.NewGuid() };
        var accounts = new List<ADB2CUserAccount> { expectedAccount };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(accounts);
        MockHttpResponse(responseMessage);

        var result = await _adb2cService.GetUserByEmailAsync("test@test.com");

        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedAccount).UsingPropertiesComparer());
    }

    [Test]
    public async Task GetUserByEmailAsync_ValidUnlinkedUser_ReturnsADB2CAccount()
    {
        var expectedAccount = new ADB2CUserAccount { Id = Guid.NewGuid(), AccountEnabled = true, DisplayName = "Test User", CrmId = null };
        var accounts = new List<ADB2CUserAccount> { expectedAccount };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(accounts);
        MockHttpResponse(responseMessage);

        var result = await _adb2cService.GetUserByEmailAsync("test@test.com");

        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedAccount).UsingPropertiesComparer());
    }

    [Test]
    public void GetUserByEmailAsync_ValidUser_ThrowsException()
    {
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(new List<ADB2CUserAccount>());
        MockHttpResponse(responseMessage);
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, new Exception("Exception message"));

        Assert.ThrowsAsync<Exception>(async () => await _adb2cService.GetUserByEmailAsync("i-will-break@test.com"));
        LoggerMock.VerifyLog(LogLevel.Error, "Exception message", Times.Once);
    }

    [Test]
    public void GetUserByEmailAsync_InvalidInput_ThrowsException()
    {
        var invalidEmail = "  ";
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(new List<ADB2CUserAccount>());
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<ArgumentException>(async () => await _adb2cService.GetUserByEmailAsync(invalidEmail));
        LoggerMock.VerifyLog(LogLevel.Error, "emailAddress cannot be null or empty. (Parameter 'emailAddress')", Times.Once);
    }

    [Test]
    public async Task UpdateUserCrmIdByAccountIdAsync_SuccessfulUpdate_ReturnsTrue()
    {
        // Arrange
        var accountId = "test-account-id";
        var crmId = "test-crm-id";
        var responseMessage = new HttpResponseMessage(HttpStatusCode.OK);

        MockHttpResponse(responseMessage);

        // Act
        var result = await _adb2cService.UpdateUserCrmIdByAccountIdAsync(accountId, crmId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IsSuccessful, Is.True);
    }

    [Test]
    public async Task UpdateUserCrmIdByAccountIdAsync_FailedUpdate_ReturnsFalse()
    {
        // Arrange
        var accountId = "test-account-id";
        var crmId = "test-crm-id";
        var responseMessage = new HttpResponseMessage(HttpStatusCode.BadRequest);

        MockHttpResponse(responseMessage);


        // Act
        var result = await _adb2cService.UpdateUserCrmIdByAccountIdAsync(accountId, crmId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IsSuccessful, Is.False);
    }

    [Test]
    public void UpdateUserCrmIdByAccountIdAsync_ExceptionThrown_LogsError()
    {
        // Arrange
        var accountId = "test-account-id";
        var crmId = "test-crm-id";
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, new Exception("Test exception"));

        // Act & Assert
        var ex = Assert.ThrowsAsync<Exception>(() => _adb2cService.UpdateUserCrmIdByAccountIdAsync(accountId, crmId));
        Assert.That(ex.Message, Is.EqualTo("Test exception"));
        LoggerMock.Verify(
            logger => logger.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true),
                It.IsAny<Exception>(),
                (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()),
            Times.Once);
    }

    [Test]
    public async Task UpdateUserEmailByIdAsync_SuccessfulUpdate_ReturnsUpdatedUser()
    {
        // Arrange
        var accountId = "test-account-id";
        var newEmailAddress = "new-email@test.com";
        var expectedUser = new ADB2CUserAccount { Id = Guid.NewGuid(), AccountEnabled = true, DisplayName = "Test User", Email = newEmailAddress };
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedUser);

        MockHttpResponse(responseMessage);

        // Act
        var result = await _adb2cService.UpdateUserEmailByIdAsync(accountId, newEmailAddress);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Email, Is.EqualTo(newEmailAddress));
    }

    [Test]
    public void UpdateUserEmailByIdAsync_FailedUpdate_ThrowsException()
    {
        // Arrange
        var accountId = "test-account-id";
        var newEmailAddress = "new-email@test.com";
        var responseMessage = new HttpResponseMessage(HttpStatusCode.BadRequest);

        MockHttpResponse(responseMessage);

        // Act & Assert
        var ex = Assert.ThrowsAsync<Exception>(() => _adb2cService.UpdateUserEmailByIdAsync(accountId, newEmailAddress));
        Assert.That(ex.Message, Is.EqualTo("Failed to update email address for account: test-account-id. Status Code: BadRequest."));
    }

    [Test]
    public void UpdateUserEmailByIdAsync_ExceptionThrown_LogsError()
    {
        // Arrange
        var accountId = "test-account-id";
        var newEmailAddress = "new-email@test.com";
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, new Exception("Test exception"));

        // Act & Assert
        var ex = Assert.ThrowsAsync<Exception>(() => _adb2cService.UpdateUserEmailByIdAsync(accountId, newEmailAddress));
        Assert.That(ex.Message, Is.EqualTo("Test exception"));
        LoggerMock.Verify(
            logger => logger.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true),
                It.IsAny<Exception>(),
                (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()),
            Times.Once);
    }
}

using Microsoft.Extensions.Logging;
using Moq;
using Person.API.MFA.Models;
using Person.API.MFA.Services;
using Person.GraphQL.Enums;
using Person.GraphQL.Types;
using Shared.Exceptions;
using Shared.Tests.Helpers;
using System.Net;

namespace Person.Tests.API.MFA.Services;

[TestFixture]
public class MfaServiceTests : BaseServiceTests<MfaService>
{
    private const string ServiceName = nameof(MfaService);
    private const string TestOtpCode = "000000";
    private string _testCrmId;
    private string _testSessionKey;
    private MfaService _mfaService = null!;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        _testCrmId = Guid.NewGuid().ToString();
        _testSessionKey = Guid.NewGuid().ToString();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.MfaApiEndpoint, "/insurance/mfa/api/v1");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "EXAMPLEAPIKEY");

        _mfaService = new MfaService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object, LoggerMock.Object);
    }

    [Test]
    public async Task GetOtpVerificationDetailsAsync_ShouldReturnOtpVerificationDetailsResponse_WhenSuccessful()
    {
        var expected = new OtpVerificationDetailsResponse { IsAuthenticated = false, IsMobile = true, PhoneNumberSuffix = "123" };
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expected);
        MockHttpResponse(responseMessage);

        var result = await _mfaService.GetOtpVerificationDetailsAsync(_testCrmId, _testSessionKey);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.IsAuthenticated, Is.EqualTo(expected.IsAuthenticated));
            Assert.That(result.IsMobile, Is.EqualTo(expected.IsMobile));
            Assert.That(result.PhoneNumberSuffix, Is.EqualTo(expected.PhoneNumberSuffix));
        });
        LoggerMock.VerifyLog(LogLevel.Information,
            $"[{ServiceName}] Getting OTP VerificationDetails for CrmID [{_testCrmId}] and Key [{_testSessionKey}] with CorrelationID [{TestCorrelationId}]",
            Times.Once);
    }

    [Test]
    public void GetOtpVerificationDetailsAsync_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () => await _mfaService.GetOtpVerificationDetailsAsync(_testCrmId, _testSessionKey));
        VerifyException<HttpRequestException>($"HTTP request error while fetching entity with ID {_testCrmId}");
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void GetOtpVerificationDetailsAsync_ShouldThrowArgumentException_WhenCrmIdIsWhiteSpaceOrEmptyOrNull(string crmId)
    {
        Assert.ThrowsAsync<ArgumentException>(async () =>
            await _mfaService.GetOtpVerificationDetailsAsync(crmId, Guid.NewGuid().ToString()));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void GetOtpVerificationDetailsAsync_ShouldThrowArgumentException_WhenKeyIsWhiteSpaceOrEmptyOrNull(string key)
    {
        Assert.ThrowsAsync<ArgumentException>(async () => 
            await _mfaService.GetOtpVerificationDetailsAsync(Guid.NewGuid().ToString(), key));
    }

    [Test]
    public async Task SendOtpAsync_ShouldReturnSendOtpResponse_WhenSuccessful()
    {
        const OtpChannel channel = OtpChannel.SMS;
        var expected = new SendOtpResponse { HasSendAttemptsRemaining = true };
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expected);
        MockHttpResponse(responseMessage);

        var result = await _mfaService.SendOtpAsync(_testCrmId, _testSessionKey, channel);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.HasSendAttemptsRemaining, Is.EqualTo(expected.HasSendAttemptsRemaining));
        LoggerMock.VerifyLog(LogLevel.Information,
            $"[{ServiceName}] Sending OTP via Channel [{channel}] for CrmID [{_testCrmId}] and Key [{_testSessionKey}] with CorrelationID [{TestCorrelationId}]",
            Times.Once);
    }

    [Test]
    public void SendOtpAsync_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () => 
            await _mfaService.SendOtpAsync(_testCrmId, Guid.NewGuid().ToString(), OtpChannel.SMS));
        VerifyException<HttpRequestException>($"HTTP request error while fetching entity with ID {_testCrmId}");
    }

    [Test]
    public void SendOtpAsync_ShouldThrowInternalServerException_WhenRequestFailsWithInternalServerErrorStatusCode()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock,
            nameof(HttpStatusCode.InternalServerError), HttpStatusCode.InternalServerError);

        Assert.ThrowsAsync<InternalServerException>(async () =>
            await _mfaService.SendOtpAsync(Guid.NewGuid().ToString(), Guid.NewGuid().ToString(), OtpChannel.SMS));
    }

    [Test]
    public void SendOtpAsync_ShouldThrowNotFoundException_WhenRequestFailsWithNotFoundStatusCode()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock,
            nameof(HttpStatusCode.NotFound), HttpStatusCode.NotFound);

        Assert.ThrowsAsync<NotFoundException>(async () =>
            await _mfaService.SendOtpAsync(Guid.NewGuid().ToString(), Guid.NewGuid().ToString(), OtpChannel.SMS));
    }

    [Test]
    public void SendOtpAsync_ShouldThrowTooManyRequestsException_WhenRequestFailsWithTooManyRequestsStatusCode()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock,
            nameof(HttpStatusCode.TooManyRequests), HttpStatusCode.TooManyRequests);

        Assert.ThrowsAsync<TooManyRequestsException>(async () =>
            await _mfaService.SendOtpAsync(Guid.NewGuid().ToString(), Guid.NewGuid().ToString(), OtpChannel.Call));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void SendOtpAsync_ShouldThrowArgumentException_WhenCrmIdIsWhiteSpaceOrEmptyOrNull(string crmId)
    {
        Assert.ThrowsAsync<ArgumentException>(async () => 
            await _mfaService.SendOtpAsync(crmId, Guid.NewGuid().ToString(), OtpChannel.SMS));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void SendOtpAsync_ShouldThrowArgumentException_WhenKeyIsWhiteSpaceOrEmptyOrNull(string key)
    {
        Assert.ThrowsAsync<ArgumentException>(async () => 
            await _mfaService.SendOtpAsync(Guid.NewGuid().ToString(), key, OtpChannel.SMS));
    }

    [Test]
    public async Task VerifyOtpAsync_ShouldReturnVerifyOtpResponse_WhenSuccessful()
    {
        var expected = new VerifyOtpResponse { IsVerified = true };
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expected);
        MockHttpResponse(responseMessage);

        var result = await _mfaService.VerifyOtpAsync(_testCrmId, _testSessionKey, TestOtpCode);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.IsVerified, Is.EqualTo(expected.IsVerified));
        LoggerMock.VerifyLog(LogLevel.Information,
            $"[{ServiceName}] Verifying OTP for CrmID [{_testCrmId}] and Key [{_testSessionKey}] with CorrelationID [{TestCorrelationId}]",
            Times.Once);
    }

    [Test]
    public void VerifyOtpAsync_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () => 
            await _mfaService.VerifyOtpAsync(_testCrmId, Guid.NewGuid().ToString(), TestOtpCode));
        VerifyException<HttpRequestException>($"HTTP request error while fetching entity with ID {_testCrmId}");
    }

    [Test]
    public void VerifyOtpAsync_ShouldThrowInternalServerException_WhenRequestFailsWithInternalServerErrorStatusCode()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock,
            nameof(HttpStatusCode.InternalServerError), HttpStatusCode.InternalServerError);

        Assert.ThrowsAsync<InternalServerException>(async () =>
            await _mfaService.VerifyOtpAsync(Guid.NewGuid().ToString(), Guid.NewGuid().ToString(), TestOtpCode));
    }

    [Test]
    public void VerifyOtpAsync_ShouldThrowNotFoundException_WhenRequestFailsWithNotFoundStatusCode()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock,
            nameof(HttpStatusCode.NotFound), HttpStatusCode.NotFound);

        Assert.ThrowsAsync<NotFoundException>(async () => 
            await _mfaService.VerifyOtpAsync(Guid.NewGuid().ToString(), Guid.NewGuid().ToString(), TestOtpCode));
    }

    [Test]
    public void VerifyOtpAsync_ShouldThrowTooManyRequestsException_WhenRequestFailsWithTooManyRequestsStatusCode()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock,
            nameof(HttpStatusCode.TooManyRequests), HttpStatusCode.TooManyRequests);

        Assert.ThrowsAsync<TooManyRequestsException>(async () => 
            await _mfaService.VerifyOtpAsync(Guid.NewGuid().ToString(), Guid.NewGuid().ToString(), TestOtpCode));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void VerifyOtpAsync_ShouldThrowArgumentException_WhenCrmIdIsWhiteSpaceOrEmptyOrNull(string crmId)
    {
        Assert.ThrowsAsync<ArgumentException>(async () => 
            await _mfaService.VerifyOtpAsync(crmId, Guid.NewGuid().ToString(), TestOtpCode));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void VerifyOtpAsync_ShouldThrowArgumentException_WhenKeyIsWhiteSpaceOrEmptyOrNull(string key)
    {
        Assert.ThrowsAsync<ArgumentException>(async () => 
            await _mfaService.VerifyOtpAsync(Guid.NewGuid().ToString(), key, TestOtpCode));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void VerifyOtpAsync_ShouldThrowArgumentException_WhenCodeIsWhiteSpaceOrEmptyOrNull(string code)
    {
        Assert.ThrowsAsync<ArgumentException>(async () => 
            await _mfaService.VerifyOtpAsync(Guid.NewGuid().ToString(), Guid.NewGuid().ToString(), code));
    }

    [TestCase(HttpStatusCode.NoContent)]
    [TestCase(HttpStatusCode.Unauthorized)]
    public async Task CheckOtpAsync_ShouldReturnCheckOtp_WhenHttpStatusResponseIs(HttpStatusCode statusCode)
    {
        var expected = new CheckOtp
        {
            CrmId = _testCrmId,
            SessionKey = _testSessionKey,
            IsAuthenticated = statusCode == HttpStatusCode.NoContent
        };
        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expected, statusCode);
        MockHttpResponse(responseMessage);

        var result = await _mfaService.CheckOtpAsync(_testCrmId, _testSessionKey);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.IsAuthenticated, Is.EqualTo(expected.IsAuthenticated));
        LoggerMock.VerifyLog(LogLevel.Information,
            $"[{ServiceName}] Checking OTP for CrmID [{_testCrmId}] and Key [{_testSessionKey}] with CorrelationID [{TestCorrelationId}]",
            Times.Once);
        LoggerMock.VerifyLog(LogLevel.Information, 
            $"[{ServiceName}] Check OTP response status code for CrmID [{_testCrmId}] and Key [{_testSessionKey}] with CorrelationID [{TestCorrelationId}]: {statusCode}",
            Times.Once);
    }

    [Test]
    public void CheckOtpAsync_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () => 
            await _mfaService.CheckOtpAsync(_testCrmId, Guid.NewGuid().ToString()));
        VerifyException<HttpRequestException>(
            $"[{ServiceName}] HTTP request error while fetching entity for CrmID [{_testCrmId}] with CorrelationID [{TestCorrelationId}]");
    }

    [Test]
    public void CheckOtpAsync_ShouldThrowException_WhenRequestFails()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, new Exception("Exception message"));

        Assert.ThrowsAsync<Exception>(async () => 
            await _mfaService.CheckOtpAsync(_testCrmId, Guid.NewGuid().ToString()));
        VerifyException<Exception>(
            $"[{ServiceName}] An unexpected error occurred while fetching entity for CrmID [{_testCrmId}] with CorrelationID [{TestCorrelationId}]");
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void CheckOtpAsync_ShouldThrowArgumentException_WhenCrmIdIsWhiteSpaceOrEmptyOrNull(string crmId)
    {
        Assert.ThrowsAsync<ArgumentException>(async () =>
            await _mfaService.CheckOtpAsync(crmId, Guid.NewGuid().ToString()));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void CheckOtpAsync_ShouldThrowArgumentException_WhenKeyIsWhiteSpaceOrEmptyOrNull(string key)
    {
        Assert.ThrowsAsync<ArgumentException>(async () => 
            await _mfaService.CheckOtpAsync(Guid.NewGuid().ToString(), key));
    }

    [TestCase(HttpStatusCode.NoContent)]
    [TestCase(HttpStatusCode.OK)]
    public async Task GetHealthStatusAsync_ShouldReturnTrue_WithSuccessfulCodes(HttpStatusCode statusCode)
    {
        MockHttpResponse(new HttpResponseMessage
        {
            StatusCode = statusCode,
            Content = null
        });

        var result = await _mfaService.GetHealthStatusAsync();

        Assert.That(result, Is.True);
    }

    [Test]
    public void GetHealthStatusAsync_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () => await _mfaService.GetHealthStatusAsync());
        VerifyException<HttpRequestException>(
            $"[{ServiceName}] HTTP request error while calling health check with CorrelationID [{TestCorrelationId}]");
    }

    [Test]
    public void GetHealthStatusAsync_ShouldThrowException_WhenRequestFails()
    {
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, new Exception("Exception message"));

        Assert.ThrowsAsync<Exception>(async () => await _mfaService.GetHealthStatusAsync());
        VerifyException<Exception>(
            $"[{ServiceName}] An unexpected error occurred while calling health check with CorrelationID [{TestCorrelationId}]");
    }

    // TODO - Can this (or Raci.Core.Testing.Extensions.LoggingExtensions.cs) be moved to a shared testing project for reuse?
    private void VerifyException<T>(string message) where T : Exception
    {
        LoggerMock.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) =>
                    v.ToString() == message),
                It.IsAny<T>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
            Times.Once);
    }
}
using System.Net;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.Insurance;
using DigitalPlatform.API.Models.SourceSystem.Otp;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Tests.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute.ExceptionExtensions;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class OtpServiceTests
{
    private IDaprService daprService;
    private IConfiguration configuration;
    private ILogger<OtpService> logger;
    private OtpService otpService;
    private IFeatureService featureService;
    private readonly string sitOTPURL = "https://az-api-sit.ractest.com.au";
    private readonly string overrideNumber = "+6100000000";

    [SetUp]
    public void Setup()
    {
        daprService = Substitute.For<IDaprService>();
        configuration = Substitute.For<IConfiguration>();
        logger = Substitute.For<ILogger<OtpService>>();
        featureService = Substitute.For<IFeatureService>();
        otpService = new OtpService(daprService, configuration, logger, featureService);
        configuration[ConfigDescriptors.API_BASE_URL].Returns("apiBaseUrl");

        configuration[ConfigDescriptors.OTP_API_SEND_OTP_URL].Returns("sendOtpEndpoint");
        configuration[ConfigDescriptors.OTP_API_VERIFY_OTP_URL].Returns("verifyOtpEndpoint");
        configuration[ConfigDescriptors.OTP_API_CHECK_OTP_URL].Returns("checkOtpEndpoint");
    }

    [Test]
    public async Task SendOtp_ValidRequest_ReturnsSendOtpResponse()
    {
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "testKey" };
        SendOtpResponse response = new() { HasSendAttemptsRemaining = true };

        daprService.InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        var result = await otpService.SendOtpAsync(request);

        Assert.That(result, Is.EqualTo(response));
    }

    [Test]
    public async Task SendOtp_Sends_UserAgent()
    {
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "testKey" };
        SendOtpResponse response = new() { HasSendAttemptsRemaining = true };

        daprService.InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.SendOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => x.ContainsKey("User-Agent")));
    }

    [Test]
    public async Task SendOtp_Sends_BypassHeader_When_FeatureEnabled()
    {
        configuration[ConfigDescriptors.API_BASE_URL].Returns(sitOTPURL);
        featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass).Returns(true);
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "testKey" };
        SendOtpResponse response = new() { HasSendAttemptsRemaining = true };

        daprService.InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.SendOtpAsync(request);

        var actualBypassHeaderValue = string.Empty;
        await daprService.Received().InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => x.ContainsKey(OtpConfigs.bypassOtpHeaderKey) && x.TryGetValue(OtpConfigs.bypassOtpHeaderKey, out actualBypassHeaderValue)));
        Assert.That(actualBypassHeaderValue, Is.EqualTo("true"));
    }

    [Test]
    public async Task SendOtp_Omits_BypassHeader_When_FeatureDisabled()
    {
        featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass).Returns(false);
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "testKey" };
        SendOtpResponse response = new() { HasSendAttemptsRemaining = true };

        daprService.InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.SendOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => !x.ContainsKey(OtpConfigs.bypassOtpHeaderKey)));
    }

    [Test]
    public async Task SendOtp_Omits_BypassHeader_When_FeatureEnabled_Non_Whitelisted_url()
    {
        configuration[ConfigDescriptors.API_BASE_URL].Returns("https://non-whitelisted-uyrl.com.au");
        featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass).Returns(true);
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "testKey" };
        SendOtpResponse response = new() { HasSendAttemptsRemaining = true };

        daprService.InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.SendOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => !x.ContainsKey(OtpConfigs.bypassOtpHeaderKey)));
    }

    [Test]
    public async Task SendOtp_Sends_Number_Override_Header_When_Configured()
    {
        configuration[ConfigDescriptors.OTP_API_OVERRIDE_NUMBER].Returns(overrideNumber);
        configuration[ConfigDescriptors.API_BASE_URL].Returns(sitOTPURL);

        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "testKey" };
        SendOtpResponse response = new() { HasSendAttemptsRemaining = true };

        daprService.InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.SendOtpAsync(request);

        var actualNumberOverridValue = string.Empty;
        await daprService.Received().InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => x.ContainsKey(OtpConfigs.overrideNumberOtpHeaderKey) && x.TryGetValue(OtpConfigs.overrideNumberOtpHeaderKey, out actualNumberOverridValue)));
        Assert.That(actualNumberOverridValue, Is.EqualTo(overrideNumber));
    }

    [Test]
    public async Task SendOtp_Omits_Number_Override_Header_When_Configured_non_whitelisted_environment()
    {
        configuration[ConfigDescriptors.OTP_API_OVERRIDE_NUMBER].Returns(overrideNumber);
        configuration[ConfigDescriptors.API_BASE_URL].Returns("http://non-whitelisted-environment.com");

        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "testKey" };
        SendOtpResponse response = new() { HasSendAttemptsRemaining = true };

        daprService.InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.SendOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => !x.ContainsKey(OtpConfigs.overrideNumberOtpHeaderKey)));
    }


    [Test]
    public void SendOtp_ExceptionThrown_RethrowsException()
    {
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "testKey" };

        daprService.InvokeDaprPostMethodAsync<SendOtpResponse, SendOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<SendOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Throws<Exception>();

        Assert.ThrowsAsync<Exception>(async () => { await otpService.SendOtpAsync(request); });

        Assert.That(logger.ReceivedCalls().Count, Is.EqualTo(1));
    }

    [Test]
    public async Task VerifyOtp_ValidRequest_ReturnsVerifyOtpResponse()
    {
        VerifyOtpRequest request = new() { Code = "12345", Key = "testKey" };
        VerifyOtpResponse response = new() { IsVerified = true };

        daprService.InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        var result = await otpService.VerifyOtpAsync(request);

        Assert.That(result, Is.EqualTo(response));
    }


    [Test]
    public async Task VerifyOtp_Sends_UserAgent()
    {
        VerifyOtpRequest request = new() { Code = "12345", Key = "testKey" };
        VerifyOtpResponse response = new() { IsVerified = true };

        daprService.InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.VerifyOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => x.ContainsKey("User-Agent")));
    }

    [Test]
    public async Task VerifyOtp_Sends_BypassHeader_When_FeatureEnabled()
    {
        configuration[ConfigDescriptors.API_BASE_URL].Returns(sitOTPURL);
        featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass).Returns(true);
        VerifyOtpRequest request = new() { Code = "12345", Key = "testKey" };
        VerifyOtpResponse response = new() { IsVerified = true };

        daprService.InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.VerifyOtpAsync(request);

        var actualBypassHeaderValue = string.Empty;
        await daprService.Received().InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => x.ContainsKey(OtpConfigs.bypassOtpHeaderKey) && x.TryGetValue(OtpConfigs.bypassOtpHeaderKey, out actualBypassHeaderValue)));
        Assert.That(actualBypassHeaderValue, Is.EqualTo("true"));
    }

    [Test]
    public async Task VerifyOtp_Omits_BypassHeader_When_FeatureDisabled()
    {
        featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass).Returns(false);
        VerifyOtpRequest request = new() { Code = "12345", Key = "testKey" };
        VerifyOtpResponse response = new() { IsVerified = true };

        daprService.InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.VerifyOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => !x.ContainsKey(OtpConfigs.bypassOtpHeaderKey)));
    }

    public async Task VerifyOtp_Omits_BypassHeader_When_FeatureEnabled_Non_Whitelisted_url()
    {
        configuration[ConfigDescriptors.API_BASE_URL].Returns("https://non-whitelisted-uyrl.com.au");

        featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass).Returns(true);
        VerifyOtpRequest request = new() { Code = "12345", Key = "testKey" };
        VerifyOtpResponse response = new() { IsVerified = true };

        daprService.InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.VerifyOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => !x.ContainsKey(OtpConfigs.bypassOtpHeaderKey)));
    }

    [Test]
    public async Task VerifyOtp_Sends_Number_Override_Header_When_Configured()
    {
        configuration[ConfigDescriptors.OTP_API_OVERRIDE_NUMBER].Returns(overrideNumber);
        configuration[ConfigDescriptors.API_BASE_URL].Returns(sitOTPURL);

        VerifyOtpRequest request = new() { Code = "12345", Key = "testKey" };
        VerifyOtpResponse response = new() { IsVerified = true };

        daprService.InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.VerifyOtpAsync(request);

        var actualNumberOverridValue = string.Empty;
        await daprService.Received().InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => x.ContainsKey(OtpConfigs.overrideNumberOtpHeaderKey) && x.TryGetValue(OtpConfigs.overrideNumberOtpHeaderKey, out actualNumberOverridValue)));
        Assert.That(actualNumberOverridValue, Is.EqualTo(overrideNumber));
    }

    [Test]
    public async Task VerifyOtp_Omits_Number_Override_Header_When_Configured_non_whitelisted_environment()
    {
        configuration[ConfigDescriptors.OTP_API_OVERRIDE_NUMBER].Returns(overrideNumber);
        configuration[ConfigDescriptors.API_BASE_URL].Returns("http://non-whitelisted-environment.com");

        VerifyOtpRequest request = new() { Code = "12345", Key = "testKey" };
        VerifyOtpResponse response = new() { IsVerified = true };

        daprService.InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns(response);

        await otpService.VerifyOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => !x.ContainsKey(OtpConfigs.bypassOtpHeaderKey)));
    }


    [Test]
    public void VerifyOtp_ExceptionThrown_RethrowsException()
    {
        VerifyOtpRequest request = new() { Code = "12345", Key = "testKey" };

        daprService.InvokeDaprPostMethodAsync<VerifyOtpResponse, VerifyOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<VerifyOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Throws<Exception>();

        Assert.ThrowsAsync<Exception>(async () => { await otpService.VerifyOtpAsync(request); });

        Assert.That(logger.ReceivedCalls().Count, Is.EqualTo(1));
    }

    [Test]
    public async Task CheckOtp_ValidRequest_ReturnsCheckOtpMutationResponse()
    {
        CheckOtpRequest request = new() { CrmId = "12345", Key = "testKey" };
        CheckOtpQueryResponse mutationResponse = new() { IsVerified = true };

        daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns("");

        var result = await otpService.CheckOtpAsync(request);

        Assert.That(result, Is.EqualTo(mutationResponse));
    }

    [Test]
    public async Task CheckOtp_NotVerified_ReturnsCheckOtpMutationResponse()
    {
        CheckOtpRequest request = new() { CrmId = "12345", Key = "testKey" };
        HttpRequestException exception = new("test", null, HttpStatusCode.Unauthorized);
        CheckOtpQueryResponse mutationResponse = new() { IsVerified = false };

        daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Throws(exception);

        var result = await otpService.CheckOtpAsync(request);

        Assert.That(result, Is.EqualTo(mutationResponse));
    }

    [Test]
    public void CheckOtp_ExceptionThrown_RethrowsException()
    {
        CheckOtpRequest request = new() { CrmId = "12345", Key = "testKey" };

        daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Throws<Exception>();

        Assert.ThrowsAsync<Exception>(async () => { await otpService.CheckOtpAsync(request); });

        Assert.That(logger.ReceivedCalls().Count, Is.EqualTo(1));
    }

    [Test]
    public async Task CheckOtp_Sends_UserAgent()
    {
        CheckOtpRequest request = new() { CrmId = "12345", Key = "testKey" };

        daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns("");

        await otpService.CheckOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => x.ContainsKey("User-Agent")));
    }

    [Test]
    public async Task CheckOtp_Sends_BypassHeader_When_FeatureEnabled()
    {
        configuration[ConfigDescriptors.API_BASE_URL].Returns(sitOTPURL);
        featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass).Returns(true);
        CheckOtpRequest request = new() { CrmId = "12345", Key = "testKey" };

        daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns("");

        await otpService.CheckOtpAsync(request);

        var actualBypassHeaderValue = string.Empty;
        await daprService.Received().InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => x.ContainsKey(OtpConfigs.bypassOtpHeaderKey) && x.TryGetValue(OtpConfigs.bypassOtpHeaderKey, out actualBypassHeaderValue)));
        Assert.That(actualBypassHeaderValue, Is.EqualTo("true"));
    }

    [Test]
    public async Task CheckOtp_Omits_BypassHeader_When_FeatureDisabled()
    {
        featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass).Returns(false);
        CheckOtpRequest request = new() { CrmId = "12345", Key = "testKey" };

        daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns("");

        await otpService.CheckOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => !x.ContainsKey(OtpConfigs.bypassOtpHeaderKey)));
    }

    public async Task CheckOtp_Omits_BypassHeader_When_FeatureEnabled_Non_Whitelisted_url()
    {
        configuration[ConfigDescriptors.API_BASE_URL].Returns("https://non-whitelisted-uyrl.com.au");

        featureService.IsFeatureEnabled(FeatureFlags.OTP_Bypass).Returns(true);
        CheckOtpRequest request = new() { CrmId = "12345", Key = "testKey" };

        daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns("");

        await otpService.CheckOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => !x.ContainsKey(OtpConfigs.bypassOtpHeaderKey)));
    }

    [Test]
    public async Task CheckOtp_Sends_Number_Override_Header_When_Configured()
    {
        configuration[ConfigDescriptors.OTP_API_OVERRIDE_NUMBER].Returns(overrideNumber);
        configuration[ConfigDescriptors.API_BASE_URL].Returns(sitOTPURL);

        CheckOtpRequest request = new() { CrmId = "12345", Key = "testKey" };

        daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns("");

        await otpService.CheckOtpAsync(request);

        var actualNumberOverridValue = string.Empty;
        await daprService.Received().InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => x.ContainsKey(OtpConfigs.overrideNumberOtpHeaderKey) && x.TryGetValue(OtpConfigs.overrideNumberOtpHeaderKey, out actualNumberOverridValue)));
        Assert.That(actualNumberOverridValue, Is.EqualTo(overrideNumber));
    }

    [Test]
    public async Task CheckOtp_Omits_Number_Override_Header_When_Configured_non_whitelisted_environment()
    {
        configuration[ConfigDescriptors.OTP_API_OVERRIDE_NUMBER].Returns(overrideNumber);
        configuration[ConfigDescriptors.API_BASE_URL].Returns("http://non-whitelisted-environment.com");

        CheckOtpRequest request = new() { CrmId = "12345", Key = "testKey" };

        daprService.InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Any<Dictionary<string, string>>()).Returns("");
        await otpService.CheckOtpAsync(request);

        await daprService.Received().InvokeDaprPostMethodAsync<string, CheckOtpRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CheckOtpRequest>(), Arg.Is<Dictionary<string, string>>(x => !x.ContainsKey(OtpConfigs.bypassOtpHeaderKey)));
    }
}


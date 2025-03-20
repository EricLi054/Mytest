using HotChocolate.Resolvers;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Person.API.ADB2C.Interfaces;
using Person.API.MFA.Interfaces;
using Person.API.MFA.Models;
using Person.API.Person.Interfaces;
using Person.API.Person.Models;
using Person.Attributes;
using Person.GraphQL.Enums;
using Person.GraphQL.Resolvers;
using Person.GraphQL.Types;
using Person.GraphQL.Types.ADB2CGraph;
using Person.GraphQL.Validators;
using Shared.Constants;
using Shared.Exceptions;
using Shared.Tests.Helpers;
using System.Security.Claims;
using PersonType = Person.GraphQL.Types.Person;

namespace Person.Tests.GraphQL.Resolvers;

[TestFixture]
public class MutationTests
{
    private const string TestOtpCode = "000000";
    private string _testCrmId;
    private string _testSessionKey;
    private string _testCorrelationId;

    private Mock<IPersonService> _personServiceMock = null!;
    private Mock<IADB2CGraphService> _adb2cServiceMock = null!;
    private Mock<IMfaService> _mfaServiceMock = null!;
    private Mock<ILogger<Mutation>> _loggerMock = null!;
    private Mock<IHttpContextAccessor> _mockHttpContextAccessor = null!;
    private Mock<HttpContext> _httpContext = null!;
    private Mock<HttpRequest> _httpRequest = null!;
    private Mutation _mutation = null!;
    const string adAccountId = "AdAccountId_UpdateAdAccountCrmId";

    [SetUp]
    public void SetUp()
    {
        _testCrmId = Guid.NewGuid().ToString();
        _testSessionKey = Guid.NewGuid().ToString();
        _testCorrelationId = Guid.NewGuid().ToString();

        _personServiceMock = new Mock<IPersonService>();
        _adb2cServiceMock = new Mock<IADB2CGraphService>();
        _mfaServiceMock = new Mock<IMfaService>();
        _loggerMock = new Mock<ILogger<Mutation>>();
        _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
        _httpContext = new Mock<HttpContext>();
        _httpRequest = new Mock<HttpRequest>();

        _httpRequest.Setup(r => r.Headers).Returns(new HeaderDictionary
        {
            { Headers.SourceSystem, "TestSourceSystem" },
            { Headers.CorrelationId, _testCorrelationId }
        });
        _httpContext.Setup(c => c.Request).Returns(_httpRequest.Object);
        _mockHttpContextAccessor.Setup(a => a.HttpContext).Returns(_httpContext.Object);

        _mutation = new Mutation(_loggerMock.Object);
    }

    [Test]
    public void GetMatch_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.GetMatch));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdPolicyAttribute found on GetMatch mutation");
    }

    [TestCase("0400000000", "Member")]
    [TestCase(null, "Member")]
    [TestCase("0400000000", null)]
    public async Task GetMatch_ShouldReturnMatchedPerson_WhenSuccessful(string? mobilePhone, string? membershipType)
    {
        var expectedMatchedPerson = new MatchedPerson
        {
            PersonId = Guid.NewGuid().ToString(),
            RacId = "rac123",
            FirstName = "John",
            MobilePhone = mobilePhone,
            MembershipType = membershipType
        };
        var matchPersonRequest = new MatchPersonRequest
        {
            FirstName = "John",
            DateOfBirth = "1990-01-01",
            Surname = "Doe",
            MobilePhone = "0400000000",
            RacId = "rac123",
            ProductNumber = "product123"
        };

        _personServiceMock.Setup(service => service.GetMatchPersonAsync(It.IsAny<MatchPersonRequest>()))
            .ReturnsAsync(expectedMatchedPerson);

        var result = await _mutation.GetMatch(_personServiceMock.Object, matchPersonRequest);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.PersonId, Is.EqualTo(expectedMatchedPerson.PersonId));
            Assert.That(result.RacId, Is.EqualTo(expectedMatchedPerson.RacId));
            Assert.That(result.FirstName, Is.EqualTo(expectedMatchedPerson.FirstName));
            Assert.That(result.MobilePhone, Is.EqualTo(expectedMatchedPerson.MobilePhone));
            Assert.That(result.MembershipType, Is.EqualTo(expectedMatchedPerson.MembershipType));
        });
    }

    [Test]
    public void GetMatch_ShouldThrowException_WhenServiceThrowsException()
    {
        var matchPersonRequest = new MatchPersonRequest
        {
            FirstName = "John",
            DateOfBirth = "1990-01-01",
            Surname = "Doe",
            MobilePhone = "1234567890",
            RacId = "rac123",
            ProductNumber = "product123"
        };

        _personServiceMock.Setup(service => service.GetMatchPersonAsync(It.IsAny<MatchPersonRequest>()))
            .ThrowsAsync(new Exception("Service error"));

        Assert.ThrowsAsync<Exception>(async () => await _mutation.GetMatch(_personServiceMock.Object, matchPersonRequest));
    }

    [Test]
    public void GetRegistrationOtpVerificationDetails_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.GetRegistrationOtpVerificationDetails));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdPolicyAttribute found on GetRegistrationOtpVerificationDetails mutation");
    }

    [TestCaseSource(typeof(TestCases.MfaModels), nameof(TestCases.MfaModels.OtpVerificationDetailsResponse))]
    public async Task GetRegistrationOtpVerificationDetails_ShouldReturnOtpVerificationDetailsResponse_WhenSuccessful(
        OtpVerificationDetailsResponse expected)
    {
        // Arrange
        _mfaServiceMock.Setup(service => service.GetOtpVerificationDetailsAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expected);

        // Act
        var result = await _mutation.GetRegistrationOtpVerificationDetails(_mfaServiceMock.Object, _testCrmId, _testSessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(OtpVerificationDetailsResponse)));
            Assert.That(result.IsAuthenticated, Is.EqualTo(expected.IsAuthenticated));
            Assert.That(result.IsMobile, Is.EqualTo(expected.IsMobile));
            Assert.That(result.PhoneNumberSuffix, Is.EqualTo(expected.PhoneNumberSuffix));
        });
    }

    [Test]
    public void GetRegistrationOtpVerificationDetails_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        _mfaServiceMock.Setup(service => service.GetOtpVerificationDetailsAsync(_testCrmId, _testSessionKey))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () =>
            await _mutation.GetRegistrationOtpVerificationDetails(_mfaServiceMock.Object, _testCrmId, _testSessionKey));
    }

    [Test]
    public void GetOtpVerificationDetails_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdB2CPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.GetOtpVerificationDetails));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdB2CPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdB2CPolicyAttribute found on GetOtpVerificationDetails mutation");
    }

    [TestCaseSource(typeof(TestCases.MfaModels), nameof(TestCases.MfaModels.OtpVerificationDetailsResponse))]
    public async Task GetOtpVerificationDetails_ShouldReturnOtpVerificationDetailsResponse_WhenSuccessful(
        OtpVerificationDetailsResponse expected)
    {
        // Arrange
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        _mfaServiceMock.Setup(service => service.GetOtpVerificationDetailsAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expected);

        // Act
        var result = await _mutation.GetOtpVerificationDetails(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(OtpVerificationDetailsResponse)));
            Assert.That(result.IsAuthenticated, Is.EqualTo(expected.IsAuthenticated));
            Assert.That(result.IsMobile, Is.EqualTo(expected.IsMobile));
            Assert.That(result.PhoneNumberSuffix, Is.EqualTo(expected.PhoneNumberSuffix));
        });
    }

    [Test]
    public void GetOtpVerificationDetails_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        _mfaServiceMock.Setup(service => service.GetOtpVerificationDetailsAsync(_testCrmId, _testSessionKey))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () =>
            await _mutation.GetOtpVerificationDetails(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey));
    }

    [Test]
    public void GetOtpVerificationDetails_ShouldThrowUnauthorizedAccessException_WhenClaimsPrincipalDoesNotContainCrmId()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
            await _mutation.GetOtpVerificationDetails(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey));
    }

    [Test]
    public void SendRegistrationOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.SendRegistrationOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdPolicyAttribute found on SendRegistrationOtp mutation");
    }

    [Test]
    public void SendRegistrationOtp_Mutation_ShouldBeDecoratedWithExpectedErrorAttributes()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.SendRegistrationOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(ErrorAttribute), true);

        Assert.That(attributes, Is.Not.Null.And.Not.Empty, "No ErrorAttribute found on SendRegistrationOtp mutation");
        Assert.Multiple(() =>
        {
            var errorAttributes = attributes!.Cast<ErrorAttribute>().ToList();
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(NotFoundException)), Is.True,
                "No ErrorAttribute with ErrorType NotFoundException found on SendRegistrationOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(TooManyRequestsException)), Is.True,
                "No ErrorAttribute with ErrorType TooManyRequestsException found on SendRegistrationOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(InternalServerException)), Is.True,
                "No ErrorAttribute with ErrorType InternalServerException found on SendRegistrationOtp mutation");
        });
    }

    [Test]
    public async Task SendRegistrationOtp_ShouldReturnSendOtpResponse_WhenSuccessful()
    {
        // Arrange
        const OtpChannel channel = OtpChannel.SMS;
        var expected = new SendOtpResponse { HasSendAttemptsRemaining = true };
        _mfaServiceMock.Setup(service => service.SendOtpAsync(_testCrmId, _testSessionKey, channel))
            .ReturnsAsync(expected);

        // Act
        var result = await _mutation.SendRegistrationOtp(_mfaServiceMock.Object, _testCrmId, _testSessionKey, channel);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(SendOtpResponse)));
            Assert.That(result.HasSendAttemptsRemaining, Is.EqualTo(expected.HasSendAttemptsRemaining));
        });
    }

    [Test]
    public void SendRegistrationOtp_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        const OtpChannel channel = OtpChannel.Call;
        _mfaServiceMock.Setup(service => service.SendOtpAsync(_testCrmId, _testSessionKey, channel))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () =>
            await _mutation.SendRegistrationOtp(_mfaServiceMock.Object, _testCrmId, _testSessionKey, channel));
    }

    [Test]
    public void SendOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdB2CPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.SendOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdB2CPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdB2CPolicyAttribute found on SendOtp mutation");
    }

    [Test]
    public void SendOtp_Mutation_ShouldBeDecoratedWithExpectedErrorAttributes()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.SendOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(ErrorAttribute), true);

        Assert.That(attributes, Is.Not.Null.And.Not.Empty, "No ErrorAttribute found on SendOtp mutation");
        Assert.Multiple(() =>
        {
            var errorAttributes = attributes!.Cast<ErrorAttribute>().ToList();
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(NotFoundException)), Is.True,
                "No ErrorAttribute with ErrorType NotFoundException found on SendOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(TooManyRequestsException)), Is.True,
                "No ErrorAttribute with ErrorType TooManyRequestsException found on SendOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(InternalServerException)), Is.True,
                "No ErrorAttribute with ErrorType InternalServerException found on SendOtp mutation");
        });
    }

    [Test]
    public async Task SendOtp_ShouldReturnSendOtpResponse_WhenSuccessful()
    {
        // Arrange
        const OtpChannel channel = OtpChannel.SMS;
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        var expected = new SendOtpResponse { HasSendAttemptsRemaining = false };
        _mfaServiceMock.Setup(service => service.SendOtpAsync(_testCrmId, _testSessionKey, channel))
            .ReturnsAsync(expected);

        // Act
        var result = await _mutation.SendOtp(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey, channel);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(SendOtpResponse)));
            Assert.That(result.HasSendAttemptsRemaining, Is.EqualTo(expected.HasSendAttemptsRemaining));
        });
    }

    [Test]
    public void SendOtp_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        const OtpChannel channel = OtpChannel.SMS;
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        _mfaServiceMock.Setup(service => service.SendOtpAsync(_testCrmId, _testSessionKey, channel))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () =>
            await _mutation.SendOtp(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey, channel));
    }

    [Test]
    public void SendOtp_ShouldThrowUnauthorizedAccessException_WhenClaimsPrincipalDoesNotContainCrmId()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
            await _mutation.SendOtp(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey, OtpChannel.Call));
    }

    [Test]
    public void VerifyRegistrationOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.VerifyRegistrationOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdPolicyAttribute found on VerifyRegistrationOtp mutation");
    }

    [Test]
    public void VerifyRegistrationOtp_Mutation_ShouldBeDecoratedWithExpectedErrorAttributes()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.VerifyRegistrationOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(ErrorAttribute), true);

        Assert.That(attributes, Is.Not.Null.And.Not.Empty, "No ErrorAttribute found on VerifyRegistrationOtp mutation");
        Assert.Multiple(() =>
        {
            var errorAttributes = attributes!.Cast<ErrorAttribute>().ToList();
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(NotFoundException)), Is.True,
                "No ErrorAttribute with ErrorType NotFoundException found on VerifyRegistrationOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(TooManyRequestsException)), Is.True,
                "No ErrorAttribute with ErrorType TooManyRequestsException found on VerifyRegistrationOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(InternalServerException)), Is.True,
                "No ErrorAttribute with ErrorType InternalServerException found on VerifyRegistrationOtp mutation");
        });
    }

    [Test]
    public async Task VerifyRegistrationOtp_ShouldReturnVerifyOtpResponse_WhenSuccessful()
    {
        // Arrange
        var expected = new VerifyOtpResponse { IsVerified = false };
        _mfaServiceMock.Setup(service => service.VerifyOtpAsync(_testCrmId, _testSessionKey, TestOtpCode))
            .ReturnsAsync(expected);

        // Act
        var result = await _mutation.VerifyRegistrationOtp(_mfaServiceMock.Object, _testCrmId, _testSessionKey, TestOtpCode);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(VerifyOtpResponse)));
            Assert.That(result.IsVerified, Is.EqualTo(expected.IsVerified));
        });
    }

    [Test]
    public void VerifyRegistrationOtp_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        _mfaServiceMock.Setup(service => service.VerifyOtpAsync(_testCrmId, _testSessionKey, TestOtpCode))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () =>
            await _mutation.VerifyRegistrationOtp(_mfaServiceMock.Object, _testCrmId, _testSessionKey, TestOtpCode));
    }

    [Test]
    public void VerifyOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdB2CPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.VerifyOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdB2CPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdB2CPolicyAttribute found on VerifyOtp mutation");
    }

    [Test]
    public void VerifyOtp_Mutation_ShouldBeDecoratedWithExpectedErrorAttributes()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.VerifyOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(ErrorAttribute), true);

        Assert.That(attributes, Is.Not.Null.And.Not.Empty, "No ErrorAttribute found on VerifyOtp mutation");
        Assert.Multiple(() =>
        {
            var errorAttributes = attributes!.Cast<ErrorAttribute>().ToList();
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(NotFoundException)), Is.True,
                "No ErrorAttribute with ErrorType NotFoundException found on VerifyOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(TooManyRequestsException)), Is.True,
                "No ErrorAttribute with ErrorType TooManyRequestsException found on VerifyOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(InternalServerException)), Is.True,
                "No ErrorAttribute with ErrorType InternalServerException found on VerifyOtp mutation");
        });
    }

    [Test]
    public async Task VerifyOtp_ShouldReturnVerifyOtpResponse_WhenSuccessful()
    {
        // Arrange
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        var expected = new VerifyOtpResponse { IsVerified = false };
        _mfaServiceMock.Setup(service => service.VerifyOtpAsync(_testCrmId, _testSessionKey, TestOtpCode))
            .ReturnsAsync(expected);

        // Act
        var result = await _mutation.VerifyOtp(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey, TestOtpCode);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(VerifyOtpResponse)));
            Assert.That(result.IsVerified, Is.EqualTo(expected.IsVerified));
        });
    }

    [Test]
    public void VerifyOtp_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        _mfaServiceMock.Setup(service => service.VerifyOtpAsync(_testCrmId, _testSessionKey, TestOtpCode))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () =>
            await _mutation.VerifyOtp(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey, TestOtpCode));
    }

    [Test]
    public void VerifyOtp_ShouldThrowUnauthorizedAccessException_WhenClaimsPrincipalDoesNotContainCrmId()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
            await _mutation.VerifyOtp(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey, TestOtpCode));
    }

    [Test]
    public void CheckRegistrationOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckRegistrationOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdPolicyAttribute found on CheckRegistrationOtp mutation");
    }

    [Test]
    public async Task CheckRegistrationOtp_ShouldReturnCheckOtp_WhenSuccessful()
    {
        // Arrange
        var expectedResponse = new CheckOtpResponse { IsAuthenticated = false };
        var expected = new CheckRegistrationOtp
        {
            CrmId = _testCrmId,
            SessionKey = _testSessionKey,
            IsAuthenticated = expectedResponse.IsAuthenticated
        };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _mutation.CheckRegistrationOtp(_mfaServiceMock.Object, _testCrmId, _testSessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(CheckRegistrationOtp)));
            Assert.That(result.IsAuthenticated, Is.EqualTo(expected.IsAuthenticated));
        });
    }

    [Test]
    public void CheckRegistrationOtp_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () =>
            await _mutation.CheckRegistrationOtp(_mfaServiceMock.Object, _testCrmId, _testSessionKey));
    }

    [Test]
    public void CheckOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdB2CPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdB2CPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdB2CPolicyAttribute found on CheckOtp mutation");
    }

    [Test]
    public async Task CheckOtp_ShouldReturnCheckOtp_WhenSuccessful()
    {
        // Arrange
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        var expectedResponse = new CheckOtpResponse { IsAuthenticated = false };
        var expected = new CheckOtp
        {
            CrmId = _testCrmId,
            SessionKey = _testSessionKey,
            IsAuthenticated = expectedResponse.IsAuthenticated
        };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _mutation.CheckOtp(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(CheckOtp)));
            Assert.That(result.IsAuthenticated, Is.EqualTo(expected.IsAuthenticated));
        });
    }

    [Test]
    public void CheckOtp_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () =>
            await _mutation.CheckOtp(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey));
    }

    [Test]
    public void CheckOtp_ShouldThrowUnauthorizedAccessException_WhenClaimsPrincipalDoesNotContainCrmId()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
            await _mutation.CheckOtp(_mfaServiceMock.Object, claimsPrincipal, _testSessionKey));
    }

    [Test]
    public void CheckAndSendRegistrationOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckAndSendRegistrationOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdPolicyAttribute found on CheckAndSendRegistrationOtp mutation");
    }

    [Test]
    public void CheckAndSendRegistrationOtp_Mutation_ShouldBeDecoratedWithExpectedErrorAttributes()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckAndSendRegistrationOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(ErrorAttribute), true);

        Assert.That(attributes, Is.Not.Null.And.Not.Empty, "No ErrorAttribute found on CheckAndSendRegistrationOtp mutation");
        Assert.Multiple(() =>
        {
            var errorAttributes = attributes!.Cast<ErrorAttribute>().ToList();
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(NotFoundException)), Is.True,
                "No ErrorAttribute with ErrorType NotFoundException found on CheckAndSendRegistrationOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(TooManyRequestsException)), Is.True,
                "No ErrorAttribute with ErrorType TooManyRequestsException found on CheckAndSendRegistrationOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(InternalServerException)), Is.True,
                "No ErrorAttribute with ErrorType InternalServerException found on CheckAndSendRegistrationOtp mutation");
        });
    }

    [Test]
    public async Task CheckAndSendRegistrationOtp_ShouldReturnSendOtpResponse_WhenIsNotAuthenticatedAndSendOtpAsyncReturnsSuccessfully()
    {
        // Arrange
        const bool isAuthenticated = false;
        const OtpChannel channel = OtpChannel.SMS;
        var expectedCheckOtpResponse = new CheckOtpResponse { IsAuthenticated = isAuthenticated };
        var expectedSendOtpResponse = new SendOtpResponse { HasSendAttemptsRemaining = true };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedCheckOtpResponse);
        _mfaServiceMock.Setup(service => service.SendOtpAsync(_testCrmId, _testSessionKey, channel))
            .ReturnsAsync(expectedSendOtpResponse);

        // Act
        var result = await _mutation.CheckAndSendRegistrationOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, _testCrmId, _testSessionKey, channel);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(SendOtpResponse)));
            Assert.That(result.HasSendAttemptsRemaining, Is.EqualTo(expectedSendOtpResponse.HasSendAttemptsRemaining));
        });
        VerifyLogCheckAndActOtpIsAuthenticated("CheckAndSendRegistrationOtp", isAuthenticated);
    }

    [Test]
    public async Task CheckAndSendRegistrationOtp_ShouldReturnNullAndNotCallSendOtpAsync_WhenCheckOtpResponseIsNull()
    {
        // Arrange
        const OtpChannel channel = OtpChannel.SMS;
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(null as CheckOtpResponse);

        // Act
        var result = await _mutation.CheckAndSendRegistrationOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, _testCrmId, _testSessionKey, channel);

        // Assert
        Assert.That(result, Is.Null);
        _mfaServiceMock.Verify(service => service.SendOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<OtpChannel>()),
            Times.Never);
        VerifyLogCheckAndActOtpNullResponse("CheckAndSendRegistrationOtp", Times.Once);
    }

    [Test]
    public async Task CheckAndSendRegistrationOtp_ShouldReturnNullAndNotCallSendOtpAsync_WhenCheckOtpResponseIsAuthenticatedIsTrue()
    {
        // Arrange
        const bool isAuthenticated = true;
        const OtpChannel channel = OtpChannel.SMS;
        var expectedCheckOtpResponse = new CheckOtpResponse { IsAuthenticated = isAuthenticated };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedCheckOtpResponse);

        // Act
        var result = await _mutation.CheckAndSendRegistrationOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, _testCrmId, _testSessionKey, channel);

        // Assert
        Assert.That(result, Is.Null);
        _mfaServiceMock.Verify(service => service.SendOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<OtpChannel>()),
            Times.Never);
        VerifyLogCheckAndActOtpIsAuthenticated("CheckAndSendRegistrationOtp", isAuthenticated);
    }

    [Test]
    public void CheckAndSendOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdB2CPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckAndSendOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdB2CPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdB2CPolicyAttribute found on CheckAndSendOtp mutation");
    }

    [Test]
    public void CheckAndSendOtp_Mutation_ShouldBeDecoratedWithExpectedErrorAttributes()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckAndSendOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(ErrorAttribute), true);

        Assert.That(attributes, Is.Not.Null.And.Not.Empty, "No ErrorAttribute found on CheckAndSendOtp mutation");
        Assert.Multiple(() =>
        {
            var errorAttributes = attributes!.Cast<ErrorAttribute>().ToList();
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(NotFoundException)), Is.True,
                "No ErrorAttribute with ErrorType NotFoundException found on CheckAndSendOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(TooManyRequestsException)), Is.True,
                "No ErrorAttribute with ErrorType TooManyRequestsException found on CheckAndSendOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(InternalServerException)), Is.True,
                "No ErrorAttribute with ErrorType InternalServerException found on CheckAndSendOtp mutation");
        });
    }

    [Test]
    public async Task CheckAndSendOtp_ShouldReturnSendOtpResponse_WhenIsNotAuthenticatedAndSendOtpAsyncReturnsSuccessfully()
    {
        // Arrange
        const bool isAuthenticated = false;
        const OtpChannel channel = OtpChannel.SMS;
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        var expectedCheckOtpResponse = new CheckOtpResponse { IsAuthenticated = isAuthenticated };
        var expectedSendOtpResponse = new SendOtpResponse { HasSendAttemptsRemaining = true };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedCheckOtpResponse);
        _mfaServiceMock.Setup(service => service.SendOtpAsync(_testCrmId, _testSessionKey, channel))
            .ReturnsAsync(expectedSendOtpResponse);

        // Act
        var result = await _mutation.CheckAndSendOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, claimsPrincipal, _testSessionKey, channel);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(SendOtpResponse)));
            Assert.That(result.HasSendAttemptsRemaining, Is.EqualTo(expectedSendOtpResponse.HasSendAttemptsRemaining));
        });
        VerifyLogCheckAndActOtpIsAuthenticated("CheckAndSendOtp", isAuthenticated);
    }

    [Test]
    public async Task CheckAndSendOtp_ShouldReturnNullAndNotCallSendOtpAsync_WhenCheckOtpResponseIsNull()
    {
        // Arrange
        const bool isAuthenticated = true;
        const OtpChannel channel = OtpChannel.SMS;
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        var expectedCheckOtpResponse = new CheckOtpResponse { IsAuthenticated = isAuthenticated };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedCheckOtpResponse);

        // Act
        var result = await _mutation.CheckAndSendOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, claimsPrincipal, _testSessionKey, channel);

        // Assert
        Assert.That(result, Is.Null);
        _mfaServiceMock.Verify(service => service.SendOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<OtpChannel>()),
            Times.Never);
        VerifyLogCheckAndActOtpIsAuthenticated("CheckAndSendOtp", isAuthenticated);
    }

    [Test]
    public async Task CheckAndSendOtp_ShouldReturnNullAndNotCallSendOtpAsync_WhenCheckOtpResponseIsAuthenticatedIsTrue()
    {
        // Arrange
        const bool isAuthenticated = true;
        const OtpChannel channel = OtpChannel.SMS;
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        var expectedCheckOtpResponse = new CheckOtpResponse { IsAuthenticated = isAuthenticated };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedCheckOtpResponse);

        // Act
        var result = await _mutation.CheckAndSendOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, claimsPrincipal, _testSessionKey, channel);

        // Assert
        Assert.That(result, Is.Null);
        _mfaServiceMock.Verify(service => service.SendOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<OtpChannel>()),
            Times.Never);
        VerifyLogCheckAndActOtpIsAuthenticated("CheckAndSendOtp", isAuthenticated);
    }

    [Test]
    public void CheckAndSendOtp_ShouldThrowUnauthorizedAccessException_WhenClaimsPrincipalDoesNotContainCrmId()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
            await _mutation.CheckAndSendOtp(_mfaServiceMock.Object, _mockHttpContextAccessor.Object, claimsPrincipal, _testSessionKey, OtpChannel.Call));
    }

    [Test]
    public void CheckAndVerifyRegistrationOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckAndVerifyRegistrationOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdPolicyAttribute found on CheckAndVerifyRegistrationOtp mutation");
    }

    [Test]
    public void CheckAndVerifyRegistrationOtp_Mutation_ShouldBeDecoratedWithExpectedErrorAttributes()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckAndVerifyRegistrationOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(ErrorAttribute), true);

        Assert.That(attributes, Is.Not.Null.And.Not.Empty, "No ErrorAttribute found on CheckAndVerifyRegistrationOtp mutation");
        Assert.Multiple(() =>
        {
            var errorAttributes = attributes!.Cast<ErrorAttribute>().ToList();
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(NotFoundException)), Is.True,
                "No ErrorAttribute with ErrorType NotFoundException found on CheckAndVerifyRegistrationOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(TooManyRequestsException)), Is.True,
                "No ErrorAttribute with ErrorType TooManyRequestsException found on CheckAndVerifyRegistrationOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(InternalServerException)), Is.True,
                "No ErrorAttribute with ErrorType InternalServerException found on CheckAndVerifyRegistrationOtp mutation");
        });
    }

    [Test]
    public async Task CheckAndVerifyRegistrationOtp_ShouldReturnVerifyOtpResponse_WhenIsNotAuthenticatedAndVerifyOtpAsyncReturnsSuccessfully()
    {
        // Arrange
        const bool isAuthenticated = false;
        var expectedCheckOtpResponse = new CheckOtpResponse { IsAuthenticated = isAuthenticated };
        var expectedVerifyOtpResponse = new VerifyOtpResponse { IsVerified = true };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedCheckOtpResponse);
        _mfaServiceMock.Setup(service => service.VerifyOtpAsync(_testCrmId, _testSessionKey, TestOtpCode))
            .ReturnsAsync(expectedVerifyOtpResponse);

        // Act
        var result = await _mutation.CheckAndVerifyRegistrationOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, _testCrmId, _testSessionKey, TestOtpCode);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(VerifyOtpResponse)));
            Assert.That(result.IsVerified, Is.EqualTo(expectedVerifyOtpResponse.IsVerified));
        });
        VerifyLogCheckAndActOtpIsAuthenticated("CheckAndVerifyRegistrationOtp", isAuthenticated);
    }

    [Test]
    public async Task CheckAndVerifyRegistrationOtp_ShouldReturnNullAndNotCallVerifyOtpAsync_WhenCheckOtpResponseIsNull()
    {
        // Arrange
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(null as CheckOtpResponse);

        // Act
        var result = await _mutation.CheckAndVerifyRegistrationOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, _testCrmId, _testSessionKey, TestOtpCode);

        // Assert
        Assert.That(result, Is.Null);
        _mfaServiceMock.Verify(service => service.VerifyOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),
            Times.Never);
        VerifyLogCheckAndActOtpNullResponse("CheckAndVerifyRegistrationOtp", Times.Once);
    }

    [Test]
    public async Task CheckAndVerifyRegistrationOtp_ShouldReturnNullAndNotCallVerifyOtpAsync_WhenCheckOtpResponseIsAuthenticatedIsTrue()
    {
        // Arrange
        const bool isAuthenticated = true;
        var expectedCheckOtpResponse = new CheckOtpResponse { IsAuthenticated = isAuthenticated };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedCheckOtpResponse);

        // Act
        var result = await _mutation.CheckAndVerifyRegistrationOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, _testCrmId, _testSessionKey, TestOtpCode);

        // Assert
        Assert.That(result, Is.Null);
        _mfaServiceMock.Verify(service => service.VerifyOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),
            Times.Never);
        VerifyLogCheckAndActOtpIsAuthenticated("CheckAndVerifyRegistrationOtp", isAuthenticated);
    }

    [Test]
    public void CheckAndVerifyOtp_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdB2CPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckAndVerifyOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdB2CPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdB2CPolicyAttribute found on CheckAndVerifyOtp mutation");
    }

    [Test]
    public void CheckAndVerifyOtp_Mutation_ShouldBeDecoratedWithExpectedErrorAttributes()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.CheckAndVerifyOtp));
        var attributes = methodInfo?.GetCustomAttributes(typeof(ErrorAttribute), true);

        Assert.That(attributes, Is.Not.Null.And.Not.Empty, "No ErrorAttribute found on CheckAndVerifyOtp mutation");
        Assert.Multiple(() =>
        {
            var errorAttributes = attributes!.Cast<ErrorAttribute>().ToList();
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(NotFoundException)), Is.True,
                "No ErrorAttribute with ErrorType NotFoundException found on CheckAndVerifyOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(TooManyRequestsException)), Is.True,
                "No ErrorAttribute with ErrorType TooManyRequestsException found on CheckAndVerifyOtp mutation");
            Assert.That(errorAttributes.Any(a => a.ErrorType == typeof(InternalServerException)), Is.True,
                "No ErrorAttribute with ErrorType InternalServerException found on CheckAndVerifyOtp mutation");
        });
    }

    [Test]
    public async Task CheckAndVerifyOtp_ShouldReturnVerifyOtpResponse_WhenIsNotAuthenticatedAndVerifyOtpAsyncReturnsSuccessfully()
    {
        // Arrange
        const bool isAuthenticated = false;
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        var expectedCheckOtpResponse = new CheckOtpResponse { IsAuthenticated = isAuthenticated };
        var expectedVerifyOtpResponse = new VerifyOtpResponse { IsVerified = true };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedCheckOtpResponse);
        _mfaServiceMock.Setup(service => service.VerifyOtpAsync(_testCrmId, _testSessionKey, TestOtpCode))
            .ReturnsAsync(expectedVerifyOtpResponse);

        // Act
        var result = await _mutation.CheckAndVerifyOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, claimsPrincipal, _testSessionKey, TestOtpCode);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.GetType(), Is.EqualTo(typeof(VerifyOtpResponse)));
            Assert.That(result.IsVerified, Is.EqualTo(expectedVerifyOtpResponse.IsVerified));
        });
        VerifyLogCheckAndActOtpIsAuthenticated("CheckAndVerifyOtp", isAuthenticated);
    }

    [Test]
    public async Task CheckAndVerifyOtp_ShouldReturnNullAndNotCallVerifyOtpAsync_WhenCheckOtpResponseIsNull()
    {
        // Arrange
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(null as CheckOtpResponse);

        // Act
        var result = await _mutation.CheckAndVerifyOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, claimsPrincipal, _testSessionKey, TestOtpCode);

        // Assert
        Assert.That(result, Is.Null);
        _mfaServiceMock.Verify(service => service.VerifyOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),
            Times.Never);
        VerifyLogCheckAndActOtpNullResponse("CheckAndVerifyOtp", Times.Once);
    }

    [Test]
    public async Task CheckAndVerifyOtp_ShouldReturnNullAndNotCallVerifyOtpAsync_WhenCheckOtpResponseIsAuthenticatedIsTrue()
    {
        // Arrange
        const bool isAuthenticated = true;
        var claimsPrincipal = CreateClaimsPrincipal(_testCrmId);
        var expectedCheckOtpResponse = new CheckOtpResponse { IsAuthenticated = isAuthenticated };
        _mfaServiceMock.Setup(service => service.CheckOtpAsync(_testCrmId, _testSessionKey))
            .ReturnsAsync(expectedCheckOtpResponse);

        // Act
        var result = await _mutation.CheckAndVerifyOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, claimsPrincipal, _testSessionKey, TestOtpCode);

        // Assert
        Assert.That(result, Is.Null);
        _mfaServiceMock.Verify(service => service.VerifyOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),
            Times.Never);
        VerifyLogCheckAndActOtpIsAuthenticated("CheckAndVerifyOtp", isAuthenticated);
    }

    [Test]
    public void CheckAndVerifyOtp_ShouldThrowUnauthorizedAccessException_WhenClaimsPrincipalDoesNotContainCrmId()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await _mutation.CheckAndVerifyOtp(
            _mfaServiceMock.Object, _mockHttpContextAccessor.Object, claimsPrincipal, _testSessionKey, TestOtpCode));
    }

    [Test]
    public void UpdatePerson_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdB2CPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.UpdatePerson));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdB2CPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdB2CPolicyAttribute found on UpdatePerson mutation");
    }

    [Test]
    public void UpdatePerson_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        const string crmId = "CrmId_UpdatePerson";
        var claimsPrincipal = CreateClaimsPrincipal(crmId);
        var validator = new UpdatePersonRequestValidator();

        var request = new UpdatePersonRequest
        {
            FirstName = "Updated"
        };

        _personServiceMock.Setup(service => service.UpdatePersonAsync(request, crmId))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () => await _mutation.UpdatePerson(
            _personServiceMock.Object, request, claimsPrincipal, validator));
    }

    [Test]
    public async Task UpdatePerson_ShouldReturnUpdatedPersonResponse_WhenSuccessful()
    {
        // Arrange
        const string crmId = "CrmId_UpdatePerson";
        var validator = new UpdatePersonRequestValidator();

        var expected = new PersonType
        {
            PersonId = crmId,
            RacId = "RacId_UpdatePerson",
            FirstName = "Updated"
        };

        var request = new UpdatePersonRequest
        {
            FirstName = "Updated"
        };

        _personServiceMock.Setup(service => service.UpdatePersonAsync(request, crmId))
            .ReturnsAsync(expected);

        var claimsPrincipal = CreateClaimsPrincipal(crmId);

        // Act
        var result = await _mutation.UpdatePerson(
            _personServiceMock.Object,
            request,
            claimsPrincipal,
            validator);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.FirstName, Is.EqualTo(expected.FirstName));
    }

    [Test]
    public async Task UpdatePerson_ShouldReturnUpdatedPersonResponse_WhenInputContainsSpaces()
    {
        // Arrange
        const string crmId = "CrmId_UpdatePerson";
        var resolverContext = new Mock<IResolverContext>();
        var validator = new UpdatePersonRequestValidator();

        var expected = new PersonType
        {
            PersonId = crmId,
            RacId = "RacId_UpdatePerson",
            FirstName = "Updated",
            MobilePhone = "0423456789",
            HomePhone = "0745678901",
            WorkPhone = "0745678901",
        };

        var request = new UpdatePersonRequest
        {
            FirstName = "Updated",
            MobilePhone = "042 345 6789",
            HomePhone = "074 567  8901 ",
            WorkPhone = " 074 567 8901"
        };

        _personServiceMock.Setup(service => service.UpdatePersonAsync(request, crmId))
            .ReturnsAsync(expected);

        var claimsPrincipal = CreateClaimsPrincipal(crmId);

        // Act
        var result = await _mutation.UpdatePerson(
            _personServiceMock.Object,
            request,
            claimsPrincipal,
            validator);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.FirstName, Is.EqualTo(expected.FirstName));
        Assert.That(result.MobilePhone, Is.EqualTo(expected.MobilePhone));
        Assert.That(result.HomePhone, Is.EqualTo(expected.HomePhone));
        Assert.That(result.WorkPhone, Is.EqualTo(expected.WorkPhone));
    }

    [Test]
    public void UpdatePerson_ShouldThrowUnauthorizedAccessException_WhenClaimsPrincipalDoesNotContainCrmId()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());
        var request = new UpdatePersonRequest { FirstName = "Updated" };

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await _mutation.UpdatePerson(
            _personServiceMock.Object, request, claimsPrincipal, new UpdatePersonRequestValidator()));
    }

    [Test]
    public void UpdateAdAccountCrmId_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.UpdateAdAccountCrmId));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdB2CPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdPolicyAttribute found on UpdateAdAccountCrmId mutation");
    }

    [Test]
    public void UpdateAdAccountCrmId_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        const string adAccountId = "AdAccountId_UpdateAdAccountCrmId";
        var claimsPrincipal = CreateClaimsPrincipal(adAccountId);
        var request = new UpdateUserCrmIdRequest
        {
            CrmId = "NewCrmId"
        };

        _adb2cServiceMock.Setup(service => service.UpdateUserCrmIdByAccountIdAsync(adAccountId, request.CrmId))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () => await _mutation.UpdateAdAccountCrmId(
            _adb2cServiceMock.Object, adAccountId, request.CrmId));
    }

    [Test]
    public async Task UpdateAdAccountCrmId_ShouldReturnUpdatedAdAccountResponse_WhenSuccessful()
    {
        // Arrange
        var expected = new PatchAdb2cAccountResponse
        {
            IsSuccessful = true
        };

        var request = new UpdateUserCrmIdRequest
        {
            CrmId = "NewCrmId"
        };

        _adb2cServiceMock.Setup(service => service.UpdateUserCrmIdByAccountIdAsync(adAccountId, request.CrmId))
            .ReturnsAsync(expected);

        var claimsPrincipal = CreateClaimsPrincipal(adAccountId);

        // Act
        var result = await _mutation.UpdateAdAccountCrmId(
            _adb2cServiceMock.Object,
            adAccountId,
            request.CrmId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IsSuccessful, Is.True);
    }

    [Test]
    public void UpdateAdAccountEmail_Mutation_ShouldBeDecoratedWithAuthorizeAzureAdB2CPolicyAttribute()
    {
        var methodInfo = _mutation.GetType().GetMethod(nameof(Mutation.UpdateAdAccountEmail));
        var attributes = methodInfo?.GetCustomAttributes(typeof(AuthorizeAzureAdB2CPolicyAttribute), true);

        Assert.That(attributes?.Length, Is.EqualTo(1),
            "No AuthorizeAzureAdB2CPolicyAttribute found on UpdateAdAccountEmail mutation");
    }

    [Test]
    public void UpdateAdAccountEmail_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange
        const string adAccountId = "AdAccountId_UpdateAdAccountEmail";
        var claimsPrincipal = CreateClaimsPrincipal(adAccountId);
        var newEmailAddress = "newemail@example.com";

        _adb2cServiceMock.Setup(service => service.UpdateUserEmailByIdAsync(adAccountId, newEmailAddress))
            .ThrowsAsync(new Exception("Service error"));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () => await _mutation.UpdateAdAccountEmail(
            _adb2cServiceMock.Object, adAccountId, newEmailAddress));
    }

    [Test]
    public async Task UpdateAdAccountEmail_ShouldReturnUpdatedAdAccountResponse_WhenSuccessful()
    {
        // Arrange
        var adAccountId = new Guid();
        var expected = new UpdateUserEmailRequest
        {
            Email = "newemail@example.com"
        };

        var newEmailAddress = "newemail@example.com";

        _adb2cServiceMock.Setup(service => service.UpdateUserEmailByIdAsync(adAccountId.ToString(), newEmailAddress))
            .ReturnsAsync(new ADB2CUserAccount { Id = adAccountId, Email = newEmailAddress });

        var claimsPrincipal = CreateClaimsPrincipal(adAccountId.ToString());

        // Act
        var result = await _mutation.UpdateAdAccountEmail(
            _adb2cServiceMock.Object,
            adAccountId.ToString(),
            newEmailAddress);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Email, Is.EqualTo(expected.Email));
    }

    private static ClaimsPrincipal CreateClaimsPrincipal(string crmId) =>
        new(new ClaimsIdentity(
        [
            new Claim("extension_crmId", crmId)
        ]));

    private void VerifyLogCheckAndActOtpNullResponse(string name, Func<Times> times)
    {
        _loggerMock.VerifyLog(Microsoft.Extensions.Logging.LogLevel.Information,
            $"{name} mutation called with CorrelationID [{_testCorrelationId}] for person with CrmID [{_testCrmId}] and SessionKey [{_testSessionKey}], but CheckOtp response was null",
            times);
    }

    private void VerifyLogCheckAndActOtpIsAuthenticated(string name, bool isAuthenticated)
    {
        VerifyLogCheckAndActOtpNullResponse(name, Times.Never);
        var isAuthenticatedMessage = isAuthenticated ? "authenticated" : "unauthenticated";
        _loggerMock.VerifyLog(Microsoft.Extensions.Logging.LogLevel.Information,
            $"{name} mutation called with CorrelationID [{_testCorrelationId}] for {isAuthenticatedMessage} person with CrmID [{_testCrmId}] and SessionKey [{_testSessionKey}]",
            Times.Once);
    }
}

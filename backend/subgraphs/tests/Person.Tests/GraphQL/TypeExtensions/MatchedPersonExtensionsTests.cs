using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Person.API.MFA.Interfaces;
using Person.API.MFA.Models;
using Person.GraphQL.TypeExtensions;
using Shared.Constants;
using Shared.Tests.Helpers;

namespace Person.Tests.GraphQL.TypeExtensions;

[TestFixture]
public class MatchedPersonExtensionsTests
{
    private string _testCrmId;
    private string _testSessionKey;
    private string _testCorrelationId;

    private Mock<IMfaService> _mockMfaService = null!;
    private Mock<IHttpContextAccessor> _mockHttpContextAccessor = null!;
    private Mock<ILogger<MatchedPersonExtensions>> _mockLogger = null!;
    private Mock<HttpContext> _httpContext = null!;
    private Mock<HttpRequest> _httpRequest = null!;
    private MatchedPersonExtensions _matchedPersonExtensions = null!;

    [SetUp]
    public void SetUp()
    {
        _testCrmId = Guid.NewGuid().ToString();
        _testSessionKey = Guid.NewGuid().ToString();
        _testCorrelationId = Guid.NewGuid().ToString();

        _mockMfaService = new Mock<IMfaService>();
        _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
        _mockLogger = new Mock<ILogger<MatchedPersonExtensions>>();
        _httpContext = new Mock<HttpContext>();
        _httpRequest = new Mock<HttpRequest>();

        _httpRequest.Setup(r => r.Headers).Returns(new HeaderDictionary
        {
            { Headers.SourceSystem, "TestSourceSystem"},
            { Headers.CorrelationId,  _testCorrelationId}
        });
        _httpContext.Setup(c => c.Request).Returns(_httpRequest.Object);
        _mockHttpContextAccessor.Setup(a => a.HttpContext).Returns(_httpContext.Object);

        _matchedPersonExtensions = new MatchedPersonExtensions();
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void GetOtpVerificationDetails_ShouldThrowArgumentException_WhenPersonIdIsNullOrEmptyOrWhiteSpace(string personId)
    {
        var person = new Person.GraphQL.Types.MatchedPerson
        {
            PersonId = personId,
            RacId = "123456789",
            FirstName = "FirstName"
        };

        Assert.ThrowsAsync<ArgumentException>(async () => 
            await _matchedPersonExtensions.GetOtpVerificationDetails(person, _mockMfaService.Object, _mockHttpContextAccessor.Object, _mockLogger.Object, _testSessionKey));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void GetOtpVerificationDetails_ShouldThrowArgumentException_WhenSessionKeyIsNullOrEmptyOrWhiteSpace(string sessionKey)
    {
        var person = new Person.GraphQL.Types.MatchedPerson
        {
            PersonId = _testCrmId,
            RacId = "123456789",
            FirstName = "FirstName"
        };

        Assert.ThrowsAsync<ArgumentException>(async () =>
            await _matchedPersonExtensions.GetOtpVerificationDetails(person, _mockMfaService.Object, _mockHttpContextAccessor.Object, _mockLogger.Object, sessionKey));
    }

    [Test]
    public async Task GetOtpVerificationDetails_ShouldReturnNull_WhenServiceReturnsNull()
    {
        var person = new Person.GraphQL.Types.MatchedPerson
        {
            PersonId = _testCrmId,
            RacId = "123456789",
            FirstName = "FirstName"
        };
        var mockResponse = Mock.Of<Response<OtpVerificationDetailsResponse>>(r => r.Value == null!);
        _mockMfaService
            .Setup(s => s.GetOtpVerificationDetailsAsync(person.PersonId, _testSessionKey))
            .ReturnsAsync(mockResponse);

        var result =
            await _matchedPersonExtensions.GetOtpVerificationDetails(person, _mockMfaService.Object, _mockHttpContextAccessor.Object, _mockLogger.Object, _testSessionKey);

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetOtpVerificationDetails_ShouldReturnOtpVerificationDetails_WhenServiceReturnsResult()
    {
        var person = new Person.GraphQL.Types.MatchedPerson
        {
            PersonId = _testCrmId,
            RacId = "123456789",
            FirstName = "FirstName"
        };
        var expectedServiceResponse = new OtpVerificationDetailsResponse
        {
            IsAuthenticated = true,
            IsMobile = true,
            PhoneNumberSuffix = "1234"
        };
        var mockResponse = Mock.Of<Response<OtpVerificationDetailsResponse>>(r => 
            r.Value == expectedServiceResponse);
        _mockMfaService
            .Setup(s => s.GetOtpVerificationDetailsAsync(person.PersonId, _testSessionKey))
            .ReturnsAsync(mockResponse);

        var result =
            await _matchedPersonExtensions.GetOtpVerificationDetails(person, _mockMfaService.Object, _mockHttpContextAccessor.Object, _mockLogger.Object, _testSessionKey);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.SessionKey, Is.EqualTo(_testSessionKey));
            Assert.That(result.IsAuthenticated, Is.EqualTo(expectedServiceResponse.IsAuthenticated));
            Assert.That(result.IsMobile, Is.EqualTo(expectedServiceResponse.IsMobile));
            Assert.That(result.PhoneNumberSuffix, Is.EqualTo(expectedServiceResponse.PhoneNumberSuffix));
        });
        _mockLogger.VerifyLog(LogLevel.Information,
            $"MatchedPerson.GetOtpVerificationDetails mutation called with CorrelationID [{_testCorrelationId}] for matched person with CrmID [{_testCrmId}] and SessionKey [{_testSessionKey}]",
            Times.Once);
    }
}

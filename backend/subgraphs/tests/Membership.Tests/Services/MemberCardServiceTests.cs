using Membership.Services;
using Membership.Types.MemberCards;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Tests.Helpers;

namespace Membership.Tests.Services;

[TestFixture]
public class MemberCardsServiceTests : BaseServiceTests<MemberCardService>
{
    private MemberCardService _memberCardsService;

    [SetUp]
    public void Setup()
    {
        base.SetUp();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.test.com");
        MockConfigurationValue(ConfigurationKeys.MemberCardApiEndpointKey, "/membercard/v1");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "SECRET");

        _memberCardsService = new MemberCardService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object, LoggerMock.Object);
    }

    [Test]
    public async Task RequestPhysicalCard_ValidRequest_ReturnsValidResponse()
    {
        PhysicalCardResponse response = new() { IsSuccess = true, Value = "Physical card successfully requested" };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(response);
        MockHttpResponse(responseMessage);

        var result = await _memberCardsService.CreatePhysicalCardRequestAsync("12345");

        Assert.That(result, Is.EqualTo(response));
    }

    [Test]
    public void RequestPhysicalCard_ValidRequest_RethrowsAndLogsUnhandledException()
    {
        MockHttpError("Unknown error occurred");

        Assert.ThrowsAsync<HttpRequestException>(async () =>
        {
            await _memberCardsService.CreatePhysicalCardRequestAsync("12345");
        });

        LoggerMock.VerifyLog(LogLevel.Error, "Unknown error occurred", Times.Once);
    }
}


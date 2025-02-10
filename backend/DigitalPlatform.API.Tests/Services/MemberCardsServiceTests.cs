using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.MemberCards;
using DigitalPlatform.API.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute.ExceptionExtensions;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class MemberCardsServiceTests
{
    private IDaprService _daprService;
    private IConfiguration _configuration;
    private ILogger<MemberCardsService> _logger;
    private MemberCardsService _memberCardsService;

    [SetUp]
    public void Setup()
    {
        _daprService = Substitute.For<IDaprService>();
        _configuration = Substitute.For<IConfiguration>();
        _logger = Substitute.For<ILogger<MemberCardsService>>();
        _memberCardsService = new MemberCardsService(_daprService, _configuration, _logger);

        _configuration[ConfigDescriptors.API_BASE_URL].Returns("apiBaseUrl");
        _configuration[ConfigDescriptors.MEMBER_CARDS_CREATE_PHYSICAL_CARD_REQUEST_URL].Returns("requestPhysicalCardUrl");
    }

    [Test]
    public async Task RequestPhysicalCard_ValidRequest_ReturnsValidResponse()
    {
        PhysicalCardRequest request = new() { MemberId = "12345" };
        PhysicalCardResponse response = new() { IsSuccess = true, Value = "Physical card successfully requested" };

        _daprService.InvokeDaprPostMethodAsync<PhysicalCardResponse, PhysicalCardRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<PhysicalCardRequest>()).Returns(response);
        var result = await _memberCardsService.CreatePhysicalCardRequestAsync(request);

        Assert.That(result, Is.EqualTo(response));
    }

    [Test]
    public void RequestPhysicalCard_ValidRequest_RethrowsAndLogsUnhandledException()
    {
        PhysicalCardRequest request = new() { MemberId = "12345" };

        _daprService.InvokeDaprPostMethodAsync<PhysicalCardResponse, PhysicalCardRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<PhysicalCardRequest>()).Throws<HttpRequestException>();

        Assert.ThrowsAsync<HttpRequestException>(async () => { await _memberCardsService.CreatePhysicalCardRequestAsync(request); });
        Assert.That(_logger.ReceivedCalls().Count, Is.EqualTo(1));
    }
}


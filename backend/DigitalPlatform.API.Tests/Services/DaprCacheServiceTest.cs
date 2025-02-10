using Dapr.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Tests.Data;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Models.Services;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;

namespace DigitalPlatform.API.Tests.Services;
[TestFixture]
public class DaprCacheServiceTests
{
    private DaprClient _daprClient;
    private IConfiguration _config;
    private ILogger<DaprCacheService> _logger;
    private DaprCacheService _service;

    [TearDown]
    public void TearDown()
    {
        _daprClient.Dispose();
    }

    [SetUp]
    public void Setup()
    {
        _daprClient = Substitute.For<DaprClient>();
        _config = Substitute.For<IConfiguration>();
        _logger = Substitute.For<ILogger<DaprCacheService>>();
        _service = new DaprCacheService(_daprClient, _config, _logger);
    }

    [Test]
    public async Task GetOrCreateAsync_StateExists_ReturnsContent()
    {
        // Arrange
        var key = "testKey";
        var expectedContent = new DaprCacheItem<PersonV2Response> { Content = PersonTestData.ValidPersonResponse };
        var etag = "testEtag";
        _daprClient.GetStateAndETagAsync<DaprCacheItem<PersonV2Response>>("Arg.Any<string>()", Arg.Any<string>(), null, null, default)
            .Returns(Task.FromResult<(DaprCacheItem<PersonV2Response>, string)>((expectedContent, etag)));

        // Act
        var result = await _service.GetOrCreateAsync(key, () => Task.FromResult(expectedContent.Content));

        // Assert
        Assert.That(result, Is.EqualTo(expectedContent.Content));
    }

    [Test]
    public async Task GetOrCreateAsync_StateDoesNotExist_CreatesState()
    {
        // Arrange
        var key = "testKey";
        var factoryResponse = PersonTestData.ValidPersonResponse;
        _daprClient.GetStateAndETagAsync<DaprCacheItem<PersonV2Response>>("Arg.Any<string>()", Arg.Any<string>(), null, null, default)
            .Returns(Task.FromResult<(DaprCacheItem<PersonV2Response>, string?)>((null!, null)));

        // Act
        var result = await _service.GetOrCreateAsync(key, () => Task.FromResult(factoryResponse));

        // Assert
        await _daprClient.Received().SaveStateAsync(Arg.Any<string>(), key, Arg.Is<DaprCacheItem<PersonV2Response>>(x => x.Content == factoryResponse), null, Arg.Any<Dictionary<string, string>>());
        Assert.That(result, Is.EqualTo(factoryResponse));
    }

    // Additional tests for ResetSlidingExpiration, SetAsync, and IsExpired can be added here.
}

using System.Net;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using NSubstitute.ExceptionExtensions;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class ContentServiceTests
{
    private ContentService _contentService;
    private HttpClient _httpClient;
    private IHttpContextAccessor _httpContextAccessor;
    private IConfiguration _configuration;
    private ICacheService _cacheService;
    private ILogger<ContentService> _logger;

    [SetUp]
    public void SetUp()
    {
        _httpClient = Substitute.For<HttpClient>();
        _httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        _configuration = Substitute.For<IConfiguration>();
        _cacheService = Substitute.For<ICacheService>();
        _logger = Substitute.For<ILogger<ContentService>>();

        _contentService = new ContentService(_httpClient, _httpContextAccessor, _configuration, _cacheService, _logger);
    }
    [TearDown]
    public void TearDown()
    {
        _httpClient.Dispose();
    }

    [Test]
    public async Task GetContentAsync_WithValidQuery_ReturnsContent()
    {
        // Arrange
        var query = "valid query";
        var requestUrl = "https://example.com/graphql";
        var accessToken = "access_token";
        var expectedContent = "Content";

        _configuration[ConfigDescriptors.CONTENT_GRAPHQL_ENDPOINT_URL].Returns(requestUrl);
        _configuration[SecretDescriptors.CONTENTFUL_SPACE_ID].Returns("space_id");
        _configuration[SecretDescriptors.CONTENTFUL_ACCESS_TOKEN].Returns(accessToken);

        _httpContextAccessor.HttpContext.Returns(Substitute.For<HttpContext>());
        _httpContextAccessor.HttpContext?.Request.Headers.TryGetValue("Environment", out Arg.Any<StringValues>()).Returns(x =>
        {
            x[1] = (StringValues)"environment";
            return true;
        });


        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<string?>>>())
            .Returns(expectedContent);
        // Act
        var result = await _contentService.GetContentAsync(query);

        // Assert
        await _cacheService.Received(1).GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<ICacheEntry, Task<string>>>());
        Assert.That(result, Is.EqualTo(expectedContent));
    }

    [Test]
    public void GetContentAsync_WithEmptyQuery_ThrowsArgumentNullException()
    {
        // Arrange
        string? query = null;

        // Act & Assert
        Assert.ThrowsAsync<ArgumentNullException>(async () => await _contentService.GetContentAsync(query!));
    }

    [Test] 
    public void GetContentAsync_WithInvalidResponse_ThrowsInvalidDataException()
    {
        // Arrange
        var query = "invalid query";
        var requestUrl = "https://example.com/graphql";
        var accessToken = "access_token";

        _configuration[ConfigDescriptors.CONTENT_GRAPHQL_ENDPOINT_URL].Returns(requestUrl);
        _configuration[SecretDescriptors.CONTENTFUL_SPACE_ID].Returns("space_id");
        _configuration[SecretDescriptors.CONTENTFUL_ACCESS_TOKEN].Returns(accessToken);

        _httpContextAccessor.HttpContext.Returns(Substitute.For<HttpContext>());
        _httpContextAccessor.HttpContext?.Request.Headers.TryGetValue("Environment", out Arg.Any<StringValues>()).Returns(x =>
        {
            x[1] = (StringValues)"environment";
            return true;
        });

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<string?>>>())
            .Returns(null as string);
        // Act & Assert
        Assert.ThrowsAsync<InvalidDataException>(async () => await _contentService.GetContentAsync(query));
    }

    [Test]
    public void GetContentAsync_WithHttpRequestException_ThrowsHttpRequestException()
    {
        // Arrange
        var query = "valid query";
        var requestUrl = "https://example.com/graphql";
        var accessToken = "access_token";

        _configuration[ConfigDescriptors.CONTENT_GRAPHQL_ENDPOINT_URL].Returns(requestUrl);
        _configuration[SecretDescriptors.CONTENTFUL_SPACE_ID].Returns("space_id");
        _configuration[SecretDescriptors.CONTENTFUL_ACCESS_TOKEN].Returns(accessToken);

        _httpContextAccessor.HttpContext.Returns(Substitute.For<HttpContext>());
        _httpContextAccessor.HttpContext?.Request.Headers.TryGetValue("Environment", out Arg.Any<StringValues>()).Returns(x =>
        {
            x[1] = (StringValues)"environment";
            return true;
        });
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<string?>>>())
            .Throws(new HttpRequestException());

        // Act & Assert
        Assert.ThrowsAsync<HttpRequestException>(async () => await _contentService.GetContentAsync(query));
    }

    [Test]
    public void GetContentAsync_WithUnexpectedException_ThrowsException()
    {
        // Arrange
        var query = "valid query";
        var requestUrl = "https://example.com/graphql";
        var accessToken = "access_token";

        _configuration[ConfigDescriptors.CONTENT_GRAPHQL_ENDPOINT_URL].Returns(requestUrl);
        _configuration[SecretDescriptors.CONTENTFUL_SPACE_ID].Returns("space_id");
        _configuration[SecretDescriptors.CONTENTFUL_ACCESS_TOKEN].Returns(accessToken);

        _httpContextAccessor.HttpContext.Returns(Substitute.For<HttpContext>());
        _httpContextAccessor.HttpContext?.Request.Headers.TryGetValue("Environment", out Arg.Any<StringValues>()).Returns(x =>
        {
            x[1] = (StringValues)"environment";
            return true;
        });

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<string?>>>())
            .Throws(new Exception());

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () => await _contentService.GetContentAsync(query));
    }
}
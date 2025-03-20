using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Moq;
using Shared.Constants;
using Shared.Exceptions;
using Shared.Extensions;
using System.Net;

namespace Shared.Tests.Extensions;

public class SampleResponse
{
    public string? Data { get; set; }
}

public class MockHttpMessageHandler(HttpResponseMessage response) : HttpMessageHandler
{
    private readonly HttpResponseMessage _response = response ?? new HttpResponseMessage(HttpStatusCode.OK);

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        return Task.FromResult(_response);
    }
}

public class HttpClientExtensionsTests
{
    private const string ValidSourceSystem = "TestSource";
    private const string ValidApiKey = "ValidApiKey";
    private const string ValidAuthorization = "Bearer some_token";
    private const string ValidCorrelationId = "123-abc-456-def-678-ghi";
    private const string ValidUrl = "https://example.com";
    private const string ValidEndpoint = "/api/data";

    private Mock<IHttpContextAccessor> _httpContextAccessorMock = null!;
    private Mock<IConfiguration> _configurationMock = null!;
    private Mock<ILogger> _loggerMock = null!;
    private HttpClient _httpClient = null!;

    [SetUp]
    public void SetUp()
    {
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        _configurationMock = new Mock<IConfiguration>();
        _loggerMock = new Mock<ILogger>();
        _httpClient = new HttpClient(new MockHttpMessageHandler(new()));
    }

    [TearDown]
    public void TearDown()
    {
        _httpClient.Dispose();
    }

    [Test]
    public void AddRequestHeaders_ShouldThrowArgumentNullException_WhenHttpContextIsNull()
    {
        var request = new HttpRequestMessage();
        _httpContextAccessorMock.Setup(h => h.HttpContext).Returns((HttpContext)null!);

        Assert.Throws<ArgumentNullException>(() =>
            request.AddRequestHeaders(_httpContextAccessorMock.Object, _configurationMock.Object));
    }

    [Test]
    public void AddRequestHeaders_ShouldAddRequiredHeaders_WhenValidHeadersAndConfigurationProvided()
    {
        var request = new HttpRequestMessage();
        var headers = new HeaderDictionary
        {
            { HeaderNames.Authorization, ValidAuthorization },
            { Headers.CorrelationId, ValidCorrelationId },
            { Headers.SourceSystem, ValidSourceSystem }
        };
        SetupMockHttpContext(headers);
        _configurationMock.Setup(c => c["APIM:ApiKey"]).Returns(ValidApiKey);

        request.AddRequestHeaders(_httpContextAccessorMock.Object, _configurationMock.Object);

        Assert.That(request.Headers, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(request.Headers.GetValues(Headers.SourceSystem),
                Does.Contain(ValidSourceSystem));
            Assert.That(request.Headers.GetValues(HeaderNames.Authorization),
                Does.Contain(ValidAuthorization));
            Assert.That(request.Headers.GetValues(Headers.SubscriptionKey),
                Does.Contain(ValidApiKey));
            Assert.That(request.Headers.GetValues(Headers.CorrelationId),
                Does.Contain(ValidCorrelationId));
        });
    }

    [Test]
    public void AddRequestHeaders_ShouldAddCorrelationIdHeaderWithNewGuid_WhenCorrelationIdHeaderNotInHttpContextRequestHeaders()
    {
        var request = new HttpRequestMessage();
        var headers = new HeaderDictionary {{ Headers.SourceSystem, ValidSourceSystem }};
        SetupMockHttpContext(headers);
        _configurationMock.Setup(c => c["APIM:ApiKey"]).Returns(ValidApiKey);

        request.AddRequestHeaders(_httpContextAccessorMock.Object, _configurationMock.Object);

        Assert.That(request.Headers, Is.Not.Null);
        Assert.Multiple(() =>
        {
            var correlationIdValues = request.Headers.GetValues(Headers.CorrelationId).ToList();
            Assert.That(correlationIdValues, Has.Count.EqualTo(1));
            Assert.That(correlationIdValues[0], Is.Not.EqualTo(ValidCorrelationId));
            Assert.That(Guid.TryParse(correlationIdValues[0], out _), Is.True);
        });
    }

    [Test]
    public void AddRequestHeaders_ShouldAddRequiredHeaders_WhenOneHeaderParamProvided()
    {
        var request = new HttpRequestMessage();

        request.AddRequestHeaders((Headers.SourceSystem, ValidSourceSystem));

        Assert.That(request.Headers, Is.Not.Null);
        Assert.That(request.Headers.GetValues(Headers.SourceSystem),
            Does.Contain(ValidSourceSystem));
    }

    [Test]
    public void AddRequestHeaders_ShouldAddRequiredHeaders_WhenMultipleHeaderParamProvided()
    {
        var request = new HttpRequestMessage();
        
        request.AddRequestHeaders((HeaderNames.Authorization, ValidAuthorization), (Headers.SourceSystem, ValidSourceSystem));

        Assert.That(request.Headers, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(request.Headers.GetValues(HeaderNames.Authorization),
                Does.Contain(ValidAuthorization));
            Assert.That(request.Headers.GetValues(Headers.SourceSystem),
                Does.Contain(ValidSourceSystem));
        });
    }

    [Test]
    public void AddRequestHeaders_ShouldThrowArgumentNullException_WhenSourceSystemHeaderIsMissing()
    {
        var request = new HttpRequestMessage();
        var headers = new HeaderDictionary();
        SetupMockHttpContext(headers);

        var ex = Assert.Throws<ArgumentNullException>(() =>
            request.AddRequestHeaders(_httpContextAccessorMock.Object, _configurationMock.Object));
        Assert.That(ex!.ParamName, Is.EqualTo("sourceSystem is required"));
    }

    [Test]
    public void AddRequestHeaders_ShouldThrowArgumentException_WhenApiKeyIsMissingInConfiguration()
    {
        var request = new HttpRequestMessage();
        var headers = new HeaderDictionary { { Headers.SourceSystem, ValidSourceSystem } };
        SetupMockHttpContext(headers);

        var ex = Assert.Throws<ArgumentException>(() =>
            request.AddRequestHeaders(_httpContextAccessorMock.Object, _configurationMock.Object));
        Assert.Multiple(() =>
        {
            Assert.That(ex!.ParamName, Is.EqualTo("configuration"));
            Assert.That(ex.Message, Does.Contain("ApiKey configuration is missing or empty."));
        });
    }

    [Test]
    public void TryGetHeaderValue_ShouldReturnHeaderValue_WhenHeaderExists()
    {
        var request = new HttpRequestMessage { Headers = { { Headers.SourceSystem, ValidSourceSystem } } };

        var result = request.TryGetHeaderValue(Headers.SourceSystem);

        Assert.That(result, Is.EqualTo(ValidSourceSystem));
    }

    [Test]
    public void TryGetHeaderValue_ShouldReturnEmptyString_WhenHeaderDoesNotExist()
    {
        var request = new HttpRequestMessage { Headers = { { "Source-System", ValidSourceSystem } } };

        var result = request.TryGetHeaderValue(Headers.SourceSystem);

        Assert.That(result, Is.EqualTo(string.Empty));
    }

    [Test]
    public void CreateInvokeMethodRequest_ShouldReturnCorrectRequestUri_WhenValidUrlAndEndpointProvided()
    {
        var request = HttpClientExtensions.CreateInvokeMethodRequest(HttpMethod.Get, ValidUrl, ValidEndpoint);

        Assert.That(request.Method, Is.EqualTo(HttpMethod.Get));
        Assert.That(request.RequestUri, Is.Not.Null);
        Assert.That(request.RequestUri!.ToString(), Is.EqualTo(ValidUrl + ValidEndpoint));
    }

    [Test]
    public async Task SendRequestAsync_ShouldReturnDeserializedObject_WhenValidResponseProvided()
    {
        const string validResponseJson = "{\"data\":\"test\"}";
        var request = new HttpRequestMessage(HttpMethod.Get, ValidUrl);
        var mockHandler = new MockHttpMessageHandler(new HttpResponseMessage
        {
            StatusCode = HttpStatusCode.OK,
            Content = new StringContent(validResponseJson)
        });
        _httpClient = new HttpClient(mockHandler);

        var result = await _httpClient.SendRequestAsync<SampleResponse>(request, "1", _loggerMock.Object);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Data, Is.EqualTo("test"));
    }

    [Test]
    public void SendRequestAsync_ShouldThrowNotFoundException_WhenEmptyResponseProvided()
    {
        const string id = "1";
        const string emptyResponseJson = "";
        var request = new HttpRequestMessage(HttpMethod.Get, ValidUrl);
        var mockHandler = new MockHttpMessageHandler(new HttpResponseMessage
        {
            StatusCode = HttpStatusCode.OK,
            Content = new StringContent(emptyResponseJson)
        });
        _httpClient = new HttpClient(mockHandler);

        var ex = Assert.ThrowsAsync<NotFoundException>(() =>
            _httpClient.SendRequestAsync<SampleResponse>(request, id, _loggerMock.Object));
        Assert.That(ex!.Message, Does.Contain($"Empty response for ID {id}."));
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) =>
                    v.ToString() == $"Entity with ID {id} not found."),
                It.IsAny<Exception>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
            Times.Once);
    }

    private void SetupMockHttpContext(HeaderDictionary headers)
    {
        var httpContextMock = new Mock<HttpContext>();
        var httpRequestMock = new Mock<HttpRequest>();
        httpRequestMock.SetupGet(x => x.Headers).Returns(headers);
        httpContextMock.SetupGet(x => x.Request).Returns(httpRequestMock.Object);
        _httpContextAccessorMock.Setup(h => h.HttpContext).Returns(httpContextMock.Object);
    }
}
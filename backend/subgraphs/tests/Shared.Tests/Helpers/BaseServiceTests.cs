using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using Shared.Constants;

namespace Shared.Tests.Helpers;

public abstract class BaseServiceTests<TService>
{
    protected string TestSourceSystem = "BaseTest";
    protected string TestCorrelationId = Guid.NewGuid().ToString();

    protected Mock<IConfiguration> ConfigurationMock = null!;
    protected Mock<IHttpContextAccessor> HttpContextAccessorMock = null!;
    protected Mock<ILogger<TService>> LoggerMock = null!;
    protected Mock<HttpMessageHandler> HttpMessageHandlerMock = null!;
    protected HttpClient HttpClient = null!;

    private Mock<HttpContext> _httpContext = null!;
    private Mock<HttpRequest> _httpRequest = null!;

    [SetUp]
    public virtual void SetUp()
    {
        // Reinitialize mocks and HttpClient before each test
        ConfigurationMock = new Mock<IConfiguration>();
        HttpContextAccessorMock = new Mock<IHttpContextAccessor>();
        LoggerMock = new Mock<ILogger<TService>>();
        HttpMessageHandlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);

        _httpContext = new Mock<HttpContext>();
        _httpRequest = new Mock<HttpRequest>();

        var headerDictionary = new HeaderDictionary
        {
            { Headers.SourceSystem, TestSourceSystem},
            { Headers.CorrelationId, TestCorrelationId }
        };

        _httpRequest.Setup(r => r.Headers).Returns(headerDictionary);
        _httpContext.Setup(c => c.Request).Returns(_httpRequest.Object);
        HttpContextAccessorMock.Setup(a => a.HttpContext).Returns(_httpContext.Object);

        HttpMessageHandlerMock.Protected()
            .Setup("Dispose", ItExpr.IsAny<bool>());

        HttpClient = new HttpClient(HttpMessageHandlerMock.Object)
        {
            BaseAddress = new Uri("https://api.example.com")
        };
    }

    [TearDown]
    public void TearDown()
    {
        // Dispose of HttpClient after each test
        HttpClient.Dispose();
    }

    protected void MockConfigurationValue(string key, string value)
    {
        ConfigurationMock.Setup(config => config[key]).Returns(value);
    }

    protected void MockHttpResponse(HttpResponseMessage responseMessage)
    {
        HttpMessageHandlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(responseMessage);
    }

    protected void MockHttpResponse(Queue<HttpResponseMessage> responseMessages)
    {
        HttpMessageHandlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(() =>
            {
                if (responseMessages.Count > 0)
                {
                    return responseMessages.Dequeue();
                }
                throw new InvalidOperationException("No more responses in the queue.");
            });
    }

    protected void MockHttpError(string errorMessage)
    {
        HttpMessageHandlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .Throws(() => new HttpRequestException(errorMessage));
    }
}
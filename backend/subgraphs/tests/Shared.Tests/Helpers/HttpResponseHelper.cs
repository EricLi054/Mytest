using System.Net;
using System.Text.Json;
using Moq;
using Moq.Protected;

namespace Shared.Tests.Helpers;

public static class HttpResponseHelper
{
    public static HttpResponseMessage CreateHttpResponseMessage<T>(T content, HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        return new HttpResponseMessage
        {
            StatusCode = statusCode,
            Content = new StringContent(JsonSerializer.Serialize(content))
        };
    }
    
    public static HttpResponseMessage CreateHttpResponseMessage(HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        return new HttpResponseMessage
        {
            StatusCode = statusCode
        };
    }

    public static void MockHttpException(Mock<HttpMessageHandler> httpMessageHandlerMock, Exception exception)
    {
        httpMessageHandlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ThrowsAsync(exception);
    }

    public static void MockHttpException(Mock<HttpMessageHandler> httpMessageHandlerMock, string exceptionMessage)
    {
        MockHttpException(httpMessageHandlerMock, new HttpRequestException(exceptionMessage));
    }

    public static void MockHttpException(Mock<HttpMessageHandler> httpMessageHandlerMock, string exceptionMessage, HttpStatusCode statusCode)
    {
        MockHttpException(httpMessageHandlerMock, new HttpRequestException(message: exceptionMessage, inner: null, statusCode: statusCode));
    }
}
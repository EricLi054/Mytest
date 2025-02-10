
using System.Text;
using System.Text.Json;

namespace DigitalPlatform.API.Helpers;

public static class HttpClientHelpers
{
    public static HttpRequestMessage CreateInvokeMethodRequest(HttpMethod method, string url, string endpoint)
    {
        Uri.TryCreate(new Uri(url), endpoint, out var fullUrl);
        return new HttpRequestMessage(method, fullUrl);
    }

    public static HttpRequestMessage CreateInvokeMethodRequest( HttpMethod method, string url, string endpoint, string content)
    {
        var request = CreateInvokeMethodRequest(method, url, endpoint);
        request.Content = CreateStringContent(content);
        return request;
    }

    public static HttpRequestMessage CreateInvokeMethodRequest<T>(HttpMethod method, string url, string endpoint, T content)
    {
        var request = CreateInvokeMethodRequest(method, url, endpoint);
        request.Content = CreateHttpContent(content);
        return request;
    }

    private static StringContent CreateStringContent(string content)
    {
        return new StringContent(content, Encoding.UTF8, "application/json");
    }

    private static StringContent CreateHttpContent<T>(T content)
    {
        var json = JsonSerializer.Serialize(content);
        return CreateStringContent(json);
    }
}
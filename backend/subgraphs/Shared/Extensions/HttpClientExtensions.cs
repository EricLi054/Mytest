using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Shared.Constants;
using Shared.Exceptions;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Text.Json;

namespace Shared.Extensions;

public static class HttpClientExtensions
{
    /// <summary>
    /// Add request headers to the HttpRequestMessage
    /// </summary>
    /// <param name="request"></param>
    /// <param name="httpContextAccessor"></param>
    /// <param name="configuration"></param>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="ArgumentException"></exception>
    public static void AddRequestHeaders(this HttpRequestMessage request,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration)
    {
        var httpContext = httpContextAccessor.HttpContext
                          ?? throw new ArgumentNullException($"{nameof(httpContextAccessor.HttpContext)} is required");

        var sourceSystem = httpContext.Request.Headers[Headers.SourceSystem];
        if (string.IsNullOrWhiteSpace(sourceSystem))
        {
            throw new ArgumentNullException($"{nameof(sourceSystem)} is required");
        }
        request.Headers.Add(Headers.SourceSystem, sourceSystem.ToString());

        var auth = httpContext.Request.Headers[HeaderNames.Authorization];
        if (!string.IsNullOrWhiteSpace(auth))
        {
            request.Headers.Add(HeaderNames.Authorization, auth.ToString());
        }

        request.Headers.Add(Headers.SubscriptionKey,
            configuration["APIM:ApiKey"] ??
            throw new ArgumentException("ApiKey configuration is missing or empty.", nameof(configuration)));

        request.AddCorrelationIdRequestHeader(httpContext);

        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
    }

    /// <summary>
    /// Add request headers to the HttpRequestMessage for Health Checks.
    /// </summary>
    /// <remarks>
    /// The SourceSystem header needs to be present in the HttpContext request headers,
    /// but the readiness checks are called internally so no request header will be present.
    /// </remarks>
    /// <param name="request"></param>
    /// <param name="httpContextAccessor"></param>
    /// <param name="configuration"></param>
    /// <param name="subgraphSourceSystem">SourceSystem constant for subgraph</param>
    public static void AddRequestHeadersForHealthChecks(this HttpRequestMessage request,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration,
        string subgraphSourceSystem)
    {
        if (httpContextAccessor.HttpContext != null
            && string.IsNullOrWhiteSpace(httpContextAccessor.HttpContext.TryGetRequestHeaderValue(Headers.SourceSystem)))
        {
            httpContextAccessor.HttpContext.Request.Headers[Headers.SourceSystem] = subgraphSourceSystem;
        }

        request.AddRequestHeaders(httpContextAccessor, configuration);
    }

    /// <summary>
    /// Add request headers to the HttpRequestMessage
    /// </summary>
    /// <param name="request"></param>
    /// <param name="requestHeaders"></param>
    /// <exception cref="ArgumentException"></exception>
    public static void AddRequestHeaders(this HttpRequestMessage request,
        params (string name, string value)[] requestHeaders)
    {
        foreach (var header in requestHeaders)
        {
            header.name.ThrowIfNullOrWhiteSpace(nameof(header.name));
            header.value.ThrowIfNullOrWhiteSpace(nameof(header.value));
            // TODO - Should check if header already exists? What if the value is different?
            request.Headers.Add(header.name, header.value);
        }
    }

    /// <summary>
    /// Try and get the header value from the request
    /// and return empty string if header does not
    /// exist or if the First value is empty.
    /// </summary>
    /// <param name="request">HttpRequestMessage</param>
    /// <param name="headerName">Header name</param>
    /// <returns>Header value or empty string</returns>
    public static string TryGetHeaderValue(this HttpRequestMessage request, string headerName)
    {
        var result = request.Headers.TryGetValues(headerName, out var values);
        if (!result)
        {
            return string.Empty;
        }
        return values?.FirstOrDefault(string.Empty) ?? string.Empty;
    }

    public static HttpRequestMessage CreateInvokeMethodRequest(HttpMethod method, string url, string endpoint)
    {
        Uri.TryCreate(new Uri(url), endpoint, out var fullUrl);
        return new HttpRequestMessage(method, fullUrl);
    }

    public static HttpRequestMessage CreateInvokeMethodRequest(HttpMethod method, string url, string endpoint,
        string content)
    {
        var request = CreateInvokeMethodRequest(method, url, endpoint);
        request.Content = new StringContent(content, Encoding.UTF8, MediaTypeNames.Application.Json);
        return request;
    }

    public static async Task<T?> SendRequestAsync<T>(this HttpClient httpClient, HttpRequestMessage request, string id,
        ILogger logger) where T : class
    {
        try
        {
            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrEmpty(json))
            {
                var message = $"Empty response for ID {id}.";
                logger.LogWarning("{Message}", message);
                throw new NotFoundException(message);
            }

            var result = json.Deserialize<T>();

            if (result == null)
            {
                var message = $"Entity with ID {id} not found.";
                logger.LogWarning("{Message}", message);
                throw new NotFoundException(message);
            }

            return result;
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning(ex, "Entity with ID {Id} not found.", id);
            throw;
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "HTTP request error while fetching entity with ID {Id}", id);
            throw;
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "JSON deserialization error for entity with ID {Id}", id);
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unexpected error occurred while fetching entity with ID {Id}", id);
            throw;
        }
    }

    /// <summary>
    /// If CorrelationID exists in the HttpContext request headers,
    /// add it to the HttpRequestMessage headers, else:
    /// <list type="bullet">
    ///     <item>Generate a new CorrelationID</item>
    ///     <item>Add it to the HttpRequestMessage headers</item>
    ///     <item>Add it to the HttpContext request headers so that subsequent requests made via TypeExtensions etc will have the same CorrelationID for tracing purposes</item>
    /// </list>
    /// </summary>
    private static void AddCorrelationIdRequestHeader(this HttpRequestMessage request, HttpContext httpContext)
    {
        var contextCorrelationId = httpContext.Request.Headers[Headers.CorrelationId].ToString();
        if (!string.IsNullOrWhiteSpace(contextCorrelationId))
        {
            request.Headers.Add(Headers.CorrelationId, contextCorrelationId);
        }
        else
        {
            var newCorrelationId = Guid.NewGuid().ToString();
            request.Headers.Add(Headers.CorrelationId, newCorrelationId);
            httpContext.Request.Headers[Headers.CorrelationId] = newCorrelationId;
        }
    }
}
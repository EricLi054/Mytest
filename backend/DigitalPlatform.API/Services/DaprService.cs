using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Helpers;
using DigitalPlatform.API.Interfaces;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net;

namespace DigitalPlatform.API.Services;
public class DaprService(HttpClient httpClient, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILogger<DaprService> logger) : IDaprService
{
    #region Dapr Get Methods

    public async Task<T> InvokeDaprGetMethodAsync<T>(string url, string endpoint)
    {
        return await InvokeDaprGetMethodAsync<T>(url, endpoint, []);
    }

    public async Task<T> InvokeDaprGetMethodAsync<T>(string url, string endpoint, Dictionary<string, string> customHeaders)
    {
        return await InvokeDaprGetMethodAsync<T>(url, endpoint, customHeaders, []);
    }

    public virtual async Task<T> InvokeDaprGetMethodAsync<T>(string url, string endpoint, Dictionary<string, string> customHeaders, HttpStatusCode[] allowedResponses)
    {
        var daprRequest = HttpClientHelpers.CreateInvokeMethodRequest(HttpMethod.Get, url, endpoint);
        AddRequestHeadersAsync(daprRequest, customHeaders);
        return await HandleDaprResponseAsync<T>(daprRequest, allowedResponses);
    }

    #endregion

    #region Dapr Post Methods

    public async Task<TResult> InvokeDaprPostMethodAsync<TResult, TRequest>(string url, string endpoint, TRequest payload)
    {
        return await InvokeDaprPostMethodAsync<TResult, TRequest>(url, endpoint, payload, []);
    }

    public async Task<TResult> InvokeDaprPostMethodAsync<TResult, TRequest>(string url, string endpoint, TRequest payload, Dictionary<string, string> customHeaders)
    {
        var daprRequest = HttpClientHelpers.CreateInvokeMethodRequest(HttpMethod.Post, url, endpoint, payload);
        AddRequestHeadersAsync(daprRequest, customHeaders);
        return await HandleDaprResponseAsync<TResult>(daprRequest, []);
    }

    #endregion 

    #region Dapr Put Methods

    public async Task<TResult> InvokeDaprPutMethodAsync<TResult, TRequest>(string url, string endpoint, TRequest payload)
    {
        return await InvokeDaprPutMethodAsync<TResult, TRequest>(url, endpoint, payload, []);
    }

    public async Task<TResult> InvokeDaprPutMethodAsync<TResult, TRequest>(string url, string endpoint, TRequest payload, Dictionary<string, string> customHeaders)
    {
        var daprRequest = HttpClientHelpers.CreateInvokeMethodRequest(HttpMethod.Put, url, endpoint, payload);
        AddRequestHeadersAsync(daprRequest, customHeaders);
        return await HandleDaprResponseAsync<TResult>(daprRequest, []);
    }


    #endregion

    #region Request Headers

    private void AddRequestHeadersAsync(HttpRequestMessage daprRequest, Dictionary<string, string> customHeaders)
    {
        string correlationId = Guid.NewGuid().ToString();
        daprRequest.Headers.Add(configuration[ConfigDescriptors.CORRELATION_ID_HEADER_KEY]!, correlationId);
        daprRequest.Headers.Add(configuration[ConfigDescriptors.APIM_SUBSCRIPTION_KEY_HEADER_KEY]!, configuration[SecretDescriptors.DIGITAL_CONTENT_API_SUBSCRIPTION_KEY]!);

        // checks if the app has sent a source system, otherwise uses the default
        var sourceSystemHeader = httpContextAccessor.HttpContext?.Request.Headers[configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY]!];
        daprRequest.Headers.Add(
            configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY]!,
            !string.IsNullOrEmpty(sourceSystemHeader) ? sourceSystemHeader : configuration[ConfigDescriptors.APP_SOURCE_SYSTEM]
        );

        var authHeader = httpContextAccessor.HttpContext?.Request.Headers.Authorization;
        if (!string.IsNullOrWhiteSpace(authHeader))
        {
            // authHeader is not null or empty
            daprRequest.Headers.Add("Authorization", authHeader.ToString());
        }

        if (httpContextAccessor.HttpContext?.Request.Headers.TryGetValue("NoRetry", out var noRetry) == true)
        {
            // used to cancel the retry policy
            daprRequest.Headers.Add("NoRetry", noRetry.ToString());
        }

        // Add custom headers if provided
        if (customHeaders != null && customHeaders.Any())
        {
            foreach (var header in customHeaders)
            {
                daprRequest.Headers.Add(header.Key, header.Value);
            }
        }
    }

    #endregion

    #region Processing Methods

    private async Task<T> HandleDaprResponseAsync<T>(HttpRequestMessage daprRequest, HttpStatusCode[] allowedResponses)
    {
        var stopwatch = new Stopwatch();
        stopwatch.Start();
        var response = await httpClient.SendAsync(daprRequest);
        stopwatch.Stop();
        logger.LogDebug("Elapsed time is {elapsedTime} for {requestUrl}", stopwatch.Elapsed, daprRequest.RequestUri);

        if (response.IsSuccessStatusCode || allowedResponses.Contains(response.StatusCode))
        {
            var responseString = await response.Content.ReadAsStringAsync();
            if (response.Content?.Headers?.ContentType?.MediaType == "application/json")
            {
                try
                {
                    return JsonConvert.DeserializeObject<T>(responseString)!;
                }
                catch (JsonReaderException ex)
                {
                    logger.LogError(ex, "An error occurred while parsing JSON: {ex.Message}", ex.Message);
                    logger.LogError("JSON string: {responseString}", responseString);
                    throw;
                }
            }
            else if (typeof(T) == typeof(string))
            {
                return (T)(object)responseString;
            }
            else
            {
                logger.LogError("Error occurred during deserialization of response: {responseString}", responseString);
                throw new HttpRequestException("Error occurred during json deserialization of response", null, response.StatusCode);

            }
        }
        else
        {
            logger.LogError("Error encountered when running request query: {query}", daprRequest.RequestUri);
            logger.LogError("Status: {status}, ReasonPhrase: {reason} Response body: {response}", response.StatusCode, response.ReasonPhrase, await response.Content.ReadAsStringAsync());
            throw new HttpRequestException(response.ReasonPhrase, null, response.StatusCode);
        }
    }

    #endregion
}

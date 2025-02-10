using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Extensions;
using DigitalPlatform.API.Interfaces;
using System.Net.Http.Headers;

namespace DigitalPlatform.API.Services;
public class ContentService(HttpClient httpClient, IHttpContextAccessor httpContextAccessor,
                            IConfiguration configuration, ICacheService cacheService, ILogger<ContentService> logger) : IContentService
{
    public async Task<string> GetContentAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            throw new ArgumentNullException(nameof(query));
        }
        try
        {
            var requestUrl = $"{configuration[ConfigDescriptors.CONTENT_GRAPHQL_ENDPOINT_URL]}{configuration[SecretDescriptors.CONTENTFUL_SPACE_ID]}";

            requestUrl = SetContentfulEnvironment(httpContextAccessor, requestUrl);

            // Set the necessary headers on the request
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", configuration[SecretDescriptors.CONTENTFUL_ACCESS_TOKEN]);
            var result = await cacheService.GetOrCreateAsync(query.HashData(), async entry =>
            {
                // Make the request
                var response = await httpClient.PostAsync(requestUrl, query.GetStringContent());
                // Check the response status
                response.EnsureSuccessStatusCode();
                // Read the response
                return await response.Content.ReadAsStringAsync();
            });
            return result ?? throw new InvalidDataException("Content not found");
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "An error occurred while processing the GetContent request. Query: {query}", query);
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unexpected error occurred. Query: {query}", query);
            throw;
        }
    }

    private static string SetContentfulEnvironment(IHttpContextAccessor httpContextAccessor, string requestUrl)
    {
        Microsoft.Extensions.Primitives.StringValues environment = default;
        httpContextAccessor.HttpContext?.Request.Headers.TryGetValue("Environment", out environment);
        var headerHasEnvironment = !string.IsNullOrEmpty(environment);
        if (headerHasEnvironment)
        {
            requestUrl += $"/environments/{environment}";
        }

        return requestUrl;
    }
}

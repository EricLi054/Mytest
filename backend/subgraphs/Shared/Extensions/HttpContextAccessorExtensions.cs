using Microsoft.AspNetCore.Http;

namespace Shared.Extensions;

public static class HttpContextAccessorExtensions
{
    /// <summary>
    /// Try and get the header value from the HttpContext 
    /// request and return empty string if header does 
    /// not exist or if the First value is empty.
    /// </summary>
    /// <param name="httpContext">HttpContext</param>
    /// <param name="headerName">Request header name</param>
    /// <returns>Request header value or empty string</returns>
    public static string TryGetRequestHeaderValue(this HttpContext httpContext, string headerName)
    {
        var result = httpContext.Request.Headers.TryGetValue(headerName, out var values);
        if (!result)
        {
            return string.Empty;
        }
        return values.FirstOrDefault(string.Empty) ?? string.Empty;
    }
}

using System.Text.Json;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Extensions;
using Microsoft.AspNetCore.Authentication;

namespace DigitalPlatform.API.Middleware;

public class CustomAuthMiddleware(RequestDelegate next, ILogger<CustomAuthMiddleware> logger)
{

    public async Task Invoke(HttpContext context)
    {
        var hasAuthorizationHeader = context.Request.Headers.TryGetValue("Authorization", out var authHeader);
        if (hasAuthorizationHeader)
        {
            logger.LogDebug("CustomAuthMiddleware: Authorization header exists");
            var authenticateResult = await context.AuthenticateAsync();
            logger.LogDebug("authenticateResult.Succeeded: {succeeded}", authenticateResult.Succeeded);
            if (authenticateResult.Succeeded)
            {
                // There are valid use cases such as the my details page where you can be unauthenticated, still check if guid is valid if provided
                var hasCrmId = authenticateResult.Principal.HasClaim(c => c.Type == JwtClaims.crmId);
                if (hasCrmId)
                {
                    var hasValidCrmId = authenticateResult.Principal.HasClaim(c => c.Type == JwtClaims.crmId && c.Value.IsValidGuid());
                    if (!hasValidCrmId)
                    {
                        await ReturnUnauthorizedResponse(context, 403);
                        return;
                    }
                }
            }
            else
            {
                await ReturnUnauthorizedResponse(context, 401);
                return;
            }
            // Set the User for the request
            context.User = authenticateResult.Principal;
        }
        // Continue processing
        await next(context);
    }

    private async Task ReturnUnauthorizedResponse(HttpContext context, int statusCode)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        var errorResponse = ErrorBuilder.New()
            .SetMessage("The current user is not authorized to access this resource.")
            .SetCode(GetErrorCode(statusCode))
            .Build();
        logger.LogError("CustomAuthMiddleware error: {errorResponseCode} - {errorResponseMessage}", errorResponse.Code, errorResponse.Code);
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var jsonErrorResponse = JsonSerializer.Serialize(new { errors = new[] { errorResponse } }, options);
        await context.Response.WriteAsync(jsonErrorResponse);
    }

    private static string GetErrorCode(int statusCode)
    {
        return statusCode switch
        {
            401 => ErrorCodes.Authentication.NotAuthenticated,
            403 => ErrorCodes.Authentication.NotAuthorized,
            _ => throw new ArgumentOutOfRangeException(nameof(statusCode), $"Invalid status code: {statusCode}")
        };
    }
}

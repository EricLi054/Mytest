using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Shared.Util;

public static class ClaimsHelper
{
    public static string GetCrmIdFromClaims(ClaimsPrincipal claimsPrincipal, ILogger logger)
    {
        var crmId = claimsPrincipal?.FindFirstValue("extension_crmId");
        if (string.IsNullOrEmpty(crmId))
        {
            logger.LogWarning("CRM ID not found in claims.");
            throw new UnauthorizedAccessException("No CRM ID found in claims.");
        }

        return crmId;
    }

    public static string GetLoginEmailFromClaims(ClaimsPrincipal claimsPrincipal, ILogger logger)
    {
        var email = claimsPrincipal?.FindFirstValue("name");
        if (string.IsNullOrEmpty(email))
        {
            logger.LogWarning("Login Email not found in claims.");
            throw new UnauthorizedAccessException("No Login Email found in claims.");
        }

        return email;
    }
}
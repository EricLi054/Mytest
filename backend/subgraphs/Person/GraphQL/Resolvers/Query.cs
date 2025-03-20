using System.Security.Claims;
using Person.API.ADB2C.Interfaces;
using Person.API.Person.Interfaces;
using Person.Attributes;
using Person.GraphQL.Types.ADB2CGraph;
using Shared.Util;

namespace Person.GraphQL.Resolvers;

[QueryType]
public class Query(ILogger<Query> logger)
{
    private readonly ILogger<Query> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    ///     Get Person details for a logged-in member.
    /// </summary>
    /// <param name="personService"></param>
    /// <param name="claimsPrincipal"></param>
    /// <returns><see cref="Types.Person"/> or null</returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    [AuthorizeAzureAdB2CPolicy]
    public async Task<Types.Person?> GetMe([Service] IPersonService personService, ClaimsPrincipal claimsPrincipal)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);
        _logger.LogInformation("GetMe query called with crmId: {CrmId}", crmId);

        return await personService.GetPersonAsync(crmId);
    }

    /// <summary>
    /// Get ADB2C account by email.
    /// </summary>
    /// <param name="adb2cGraphService"></param>
    /// <param name="claimsPrincipal"></param>
    /// <param name="logger"></param>
    /// <returns></returns>
    [AuthorizeAzureAdB2CPolicy]
    public async Task<ADB2CUserAccount?> GetADB2CUserAccount(
           IADB2CGraphService adb2cGraphService,
           ClaimsPrincipal claimsPrincipal,
           ILogger<Query> logger
       )
    {
        var email = ClaimsHelper.GetLoginEmailFromClaims(claimsPrincipal, logger);
        if (string.IsNullOrEmpty(email))
        {
            logger.LogWarning("Login Email not found in claims.");
            return null;
        }

        return await adb2cGraphService.GetUserByEmailAsync(email);
    }
}

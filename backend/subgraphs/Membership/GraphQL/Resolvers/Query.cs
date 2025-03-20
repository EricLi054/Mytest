using System.Security.Claims;
using HotChocolate.Authorization;
using HotChocolate.Resolvers;
using Membership.Interfaces;
using Membership.Types.ADB2CGraph;
using Membership.Types.Address;
using Membership.Types.PolicyDetails;
using Membership.Types.Products;
using Membership.Types.Status;
using Shared.Interfaces;
using Shared.Util;
using static Membership.Constants.SharedConstants;

namespace Membership.GraphQL.Resolvers;

[QueryType]
public class Query()
{
    /*
        TODO: This query will be broken down into smaller queries for each subsystem in our next Feature work
    */
    [Authorize]
    public async Task<List<PolicyDetail>> GetPolicyDetailsAsync(
        IProductService productService,
        IPolicyMappingService policyMappingService,
        ClaimsPrincipal claimsPrincipal,
        ILogger<Query> logger,
        IResolverContext context
    )
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, logger);

        var products = await productService.GetProductsAsync(crmId, "");
        foreach (var error in products.SystemErrors)
        {
            ReportProductSystemError(context, error.Message, CustomErrorCodes.PartialProductResultsError, error.SystemKey);
        }

        return policyMappingService.Map(products.AnnuityProducts);
    }

    public async Task<Dictionary<string, bool>> GetFeatureTogglesAsync([Service] IFeatureService featureService)
    {
        return await featureService.GetFeatureFlagsAsync("myRAC");
    }

    [Authorize]
    public async Task<AddressLookup?> GetAddressListAsync(
        string partialAddress,
        IAddressService addressService
    )
    {
        return await addressService.GetPafAddressListAsync(partialAddress);
    }

    [Authorize]
    public async Task<PAFVerification?> GetValidatePAFAsync(
        string moniker,
        IAddressService addressService,
        ILogger<Query> logger
    )
    {
        logger.LogInformation("Validating PAF for moniker: {Moniker}", moniker);
        return await addressService.GetPafAddressAsync(moniker);
    }

    [Authorize]
    public async Task<ADB2CAccount?> GetADB2CAccount(
        IADB2CGraphService adb2cGraphService,
        ClaimsPrincipal claimsPrincipal,
        ILogger<Query> logger
    )
    {
        // TODO: This can be moved once Identity have an approved Schema. DED-1866
        var email = ClaimsHelper.GetLoginEmailFromClaims(claimsPrincipal, logger);
        if (string.IsNullOrEmpty(email))
        {
            logger.LogWarning("Login Email not found in claims.");
            return null;
        }

        return await adb2cGraphService.GetUserByEmailAsync(email);
    }

    private void ReportProductSystemError(IResolverContext context, string message, string errorType, SystemKey systemKey)
    {
        context.ReportError(ErrorBuilder.New()
            .SetMessage(message)
            .SetExtension("type", errorType)
            .SetExtension("systemKey", systemKey.ToString())
            .Build());
    }

    public async Task<List<StatusInformation>> GetStatusInformation(
        [Service] IStatusService statusService,
        ClaimsPrincipal claimsPrincipal,
        ILogger<Query> logger)
    {
        try
        {
            var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, logger);
            var statusInformation = await statusService.GetSystemStatus(crmId);
            return statusInformation;
        }
        catch (UnauthorizedAccessException)
        {
            logger.LogError("GetStatusInformation failed with AuthorisationError");
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetStatusInformation failed");
            throw;
        }
    }
}

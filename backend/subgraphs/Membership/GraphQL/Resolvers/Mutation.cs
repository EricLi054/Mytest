using HotChocolate.Authorization;
using Membership.Interfaces;
using System.Security.Claims;
using Shared.Util;
using Membership.Types.MemberCards;
using Membership.GraphQL.Exceptions;

namespace Membership.GraphQL.Resolvers;

[MutationType]
public class Mutation(ILogger<Mutation> logger)
{
    private readonly ILogger<Mutation> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    [Authorize]
    [Error(typeof(PhysicalCardAlreadyOrdered))]
    public async Task<PhysicalCardResponse?> RequestPhysicalCardAsync(
        [Service] IMemberCardService memberCardService,
        ClaimsPrincipal claimsPrincipal)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);
        return await memberCardService.CreatePhysicalCardRequestAsync(crmId);
    }
}
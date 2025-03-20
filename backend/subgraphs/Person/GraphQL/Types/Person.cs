using System.Security.Claims;
using HotChocolate.ApolloFederation.Resolvers;
using HotChocolate.ApolloFederation.Types;
using Person.API.Person.Interfaces;
using Shared.Util;

namespace Person.GraphQL.Types;

public class Person : PersonBase
{
    [ID][Key] public required string PersonId { get; set; }
    [ID][Key] public required string RacId { get; set; }
    public required string FirstName { get; set; }
    public string Tier { get; set; } = string.Empty;
    public string? MembershipCardNumber { get; set; } = string.Empty;
    public string MembershipType { get; set; } = string.Empty;

    [ReferenceResolver]
    public static async Task<Person?> ResolveByIdAsync(
        IPersonService personService,
        ClaimsPrincipal claimsPrincipal,
        ILogger<Person> logger)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, logger);

        return await personService.GetPersonAsync(crmId);
    }
}

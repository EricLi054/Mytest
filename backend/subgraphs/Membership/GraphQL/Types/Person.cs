using HotChocolate.ApolloFederation.Resolvers;
using HotChocolate.ApolloFederation.Types;
using Membership.Interfaces;

namespace Membership.GraphQL.Types;

[ExtendServiceType]
public class Person
{
    [ID]
    [Key]
    [External]
    public required string PersonId { get; set; }
    [ID]
    [Key]
    [External]
    public required string RacId { get; set; }

    public List<PersonSystemId>? PersonSystemIds { get; set; }


    public async Task<DigitalCardDetails?> GetDigitalCardDetailsAsync(
        [Service] IMemberCardService memberCardService
    )
    {
        return await memberCardService.RetrieveDigitalCardDetailsAsync(PersonId);
    }

    [ReferenceResolver]
    public static Person ResolveReference(string personId, string racId) => new() { PersonId = personId, RacId = racId };
}

public class PersonSystemId
{
    public string System { get; set; } = string.Empty;
    public string SystemId { get; set; } = string.Empty;
    public bool IsSynchronised { get; set; }
}

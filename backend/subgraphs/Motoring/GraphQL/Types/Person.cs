using HotChocolate.ApolloFederation.Resolvers;
using HotChocolate.ApolloFederation.Types;

namespace Motoring.GraphQL.Types;

[ExtendServiceType]
public class Person
{
    [ID]
    [Key]
    public required string PersonId { get; set; }

    [ID]
    [Key]
    public required string RacId { get; set; }

    [ReferenceResolver]
    public static Person ResolveReference(string personId, string racId) => new() { PersonId = personId, RacId = racId };
}
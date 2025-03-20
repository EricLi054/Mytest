using HotChocolate.ApolloFederation.Types;

namespace Person.GraphQL.Types;

public class MatchedPerson
{
    [ID][Key] public required string PersonId { get; set; }
    [ID][Key] public required string RacId { get; set; }
    public required string FirstName { get; set; }
    public string? MobilePhone { get; set; }
    public string? MembershipType { get; set; }
}
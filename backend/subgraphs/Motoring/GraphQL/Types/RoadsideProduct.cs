using HotChocolate.ApolloFederation.Types;

namespace Motoring.GraphQL.Types;

public record RoadsideProduct
{
    [ID]
    [Key]
    public required string Id { get; set; }

    [ID]
    [Key]
    public required string CustAccount { get; set; }

    public bool IsActive { get; set; }

    public List<RoadsideProductLine>? Lines { get; set; }
}
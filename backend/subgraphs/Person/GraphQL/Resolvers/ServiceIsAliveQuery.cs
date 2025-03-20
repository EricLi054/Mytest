using Person.GraphQL.Types;

namespace Person.GraphQL.Resolvers;

/// <summary>
/// This logic should eventually be moved to a different subgraph, e.g. "Utility".
/// </summary>
[ExtendObjectType(nameof(Query))]
public class ServiceIsAliveQuery
{
    public ServiceIsAlive GetServiceIsAlive() => new();
}
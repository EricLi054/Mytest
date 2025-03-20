using HotChocolate.ApolloFederation.Resolvers;
using HotChocolate.ApolloFederation.Types;
using Motoring.API.Vehicle.Interfaces;

namespace Motoring.GraphQL.Types;

[ExtendServiceType]
public class ServiceIsAlive
{
    [Key]
    public string Id { get; set; } = nameof(ServiceIsAlive);

    public async Task<bool> GetVehicleServiceAsync(IVehicleService vehicleService)
    {
        return await vehicleService.GetHealthStatusAsync();
    }

    [ReferenceResolver]
    public static ServiceIsAlive ResolveProductReference(string id) => new() { Id = id };
}
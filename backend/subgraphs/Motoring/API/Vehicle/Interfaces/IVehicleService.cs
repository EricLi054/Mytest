using Motoring.GraphQL.Enums;
using Motoring.GraphQL.Types;

namespace Motoring.API.Vehicle.Interfaces;

public interface IVehicleService
{
    Task<VehicleDetail?> GetVehicleByRegoAsync(VehicleType vehicleType, string rego, State state);
    Task<bool> GetHealthStatusAsync(CancellationToken cancellationToken = new());
}


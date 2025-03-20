using Motoring.API.FinOps.Models;
using Motoring.GraphQL.Types;

namespace Motoring.API.FinOps.Interfaces;

public interface IFinOpsService
{
    Task<RoadsideProduct> UpdateRoadsideVehicleAsync(UpdateRoadsideVehicleRequest request);
    Task<RoadsideProduct> GetRoadsideProductAsync(string productId, string racId);
}
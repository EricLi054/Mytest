using FluentValidation;
using HotChocolate.Authorization;
using Motoring.API.Vehicle.Interfaces;
using Motoring.GraphQL.Types;

namespace Motoring.GraphQL.Resolvers;

[QueryType]
public class Query(ILogger<Query> logger)
{

    private readonly ILogger<Query> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    [Authorize]
    public async Task<VehicleDetail?> GetVehicleByRego(IVehicleService vehicleService,
        VehicleByRegoQuery query, IValidator<VehicleByRegoQuery> validator)
    {
        var validationResult = validator.Validate(query);
        if (!validationResult.IsValid)
        {
            _logger.LogError("Validation failed for rego: '{Rego}'", query.RegistrationNumber);
            throw new ValidationException(validationResult.Errors);
        }

        return await vehicleService.GetVehicleByRegoAsync(query.VehicleType, query.RegistrationNumber, query.State);
    }
}
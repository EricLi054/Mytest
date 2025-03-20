using System.Security.Claims;
using HotChocolate.Authorization;
using Shared.Util;
using Motoring.API.FinOps.Interfaces;
using Motoring.API.FinOps.Models;
using Motoring.Interfaces;
using Motoring.GraphQL.Types;
using FluentValidation;

namespace Motoring.GraphQL.Resolvers;

[MutationType]
public class Mutation(ILogger<Mutation> logger)
{
    private readonly ILogger<Mutation> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    [Authorize]
    public async Task<RoadsideProduct> UpdateRoadsideVehicleAsync(IPersonService personService,
        IFinOpsService finOpsService, ClaimsPrincipal claimsPrincipal, string productId, string lineId,
        Types.VehicleDetail newVehicleDetail, IValidator<Types.VehicleDetail> validator)
    {
        var crmId = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _logger);
        var email = ClaimsHelper.GetLoginEmailFromClaims(claimsPrincipal, _logger);

        var validationResult = validator.Validate(newVehicleDetail);
        if (!validationResult.IsValid)
        {
            _logger.LogError("Validation failed for rego: '{Rego}'", newVehicleDetail.RegistrationNumber);
            throw new ValidationException(validationResult.Errors);
        }

        var racId = await personService.GetRacIdAsync(crmId);

        var request = new UpdateRoadsideVehicleRequest
        {
            RacId = racId,
            Email = email,
            ProductId = productId,
            LineId = lineId,
            NewVehicleDetail = newVehicleDetail
        };

        return await finOpsService.UpdateRoadsideVehicleAsync(request);
    }
}
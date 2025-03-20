using Motoring.API.FinOps.Interfaces;
using Motoring.GraphQL.Types;

namespace Motoring.GraphQL.TypeExtensions;

[ExtendObjectType(typeof(Person))]
public sealed class PersonExtensions
{
    public async Task<RoadsideProduct?> GetRoadsideProduct([Parent] Person person, [Service] IFinOpsService finOpsService, ILogger<PersonExtensions> logger, string id)
    {
        if (string.IsNullOrWhiteSpace(person.RacId)) return null;
        logger.LogInformation("GetRoadsideProduct query called for product ID [{Id}], PersonID [{PersonId}], RacId [{RacId}].", id, person.PersonId, person.RacId);
        return await finOpsService.GetRoadsideProductAsync(id, person.RacId);
    }
}
using HotChocolate.ApolloFederation.Types;
using Person.API.MFA.Interfaces;
using Person.API.Person.Interfaces;

namespace Person.GraphQL.Types;

public class ServiceIsAlive
{
    [Key]
    public string Id { get; set; } = nameof(ServiceIsAlive);

    public async Task<bool> GetPersonServiceAsync(IPersonService personService)
    {
        return await personService.GetHealthStatusAsync();
    }

    public async Task<bool> GetMfaServiceAsync(IMfaService mfaService)
    {
        return await mfaService.GetHealthStatusAsync();
    }
}

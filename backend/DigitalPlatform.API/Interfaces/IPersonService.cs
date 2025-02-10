using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;
using HotChocolate.Resolvers;
using System.Security.Claims;

namespace DigitalPlatform.API.Interfaces
{
    public interface IPersonService
    {
        Task<Person> GetPerson(string crmId, string sessionKey);
        Task<Person> UpdatePerson(PersonUpdateMutation person, string sessionKey, ClaimsPrincipal claimsPrincipal, IResolverContext context);
        Task<PersonProducts> GetProducts(string crmId);
    }
}

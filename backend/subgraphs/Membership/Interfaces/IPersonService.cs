using Membership.GraphQL.Types;
using Membership.Types.Person;

namespace Membership.Interfaces;

public interface IPersonService
{
    Task<Person> GetPersonAsync(string crmId);
    Task<List<PersonProductHolding>?> GetPersonProductsAsync(string crmId);
}

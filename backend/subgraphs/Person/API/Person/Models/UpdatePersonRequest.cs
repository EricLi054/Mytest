using Person.GraphQL.Types;

namespace Person.API.Person.Models;

public class UpdatePersonRequest : PersonBase
{
    public string? FirstName { get; set; }
}
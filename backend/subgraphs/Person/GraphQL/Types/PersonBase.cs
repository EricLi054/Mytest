using Shared.Extensions;

namespace Person.GraphQL.Types;

public class PersonBase
{
    public string? Title { get; set; }
    public string? MiddleName { get; set; }
    public string? Surname { get; set; }
    public string? MobilePhone { get; set; }
    public string? HomePhone { get; set; }
    public string? WorkPhone { get; set; }
    public string? PersonalEmailAddress { get; set; }
    public Address? PostalAddress { get; set; }

    public void SanitiseInput()
    {
        MobilePhone = MobilePhone?.RemoveWhitespace();
        HomePhone = HomePhone?.RemoveWhitespace();
        WorkPhone = WorkPhone?.RemoveWhitespace();
    }
}

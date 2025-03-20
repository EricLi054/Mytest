using Motoring.GraphQL.Types;

namespace Motoring.Tests.GraphQL.Types;

public class PersonTests
{
    [Test]
    public void ResolveReference_ShouldReturnCorrectPerson()
    {
        const string personId = "123";
        const string racId = "RAC456";

        var result = Person.ResolveReference(personId, racId);

        Assert.That(result, Is.Not.Null);
        Assert.That(result.PersonId, Is.EqualTo(personId));
        Assert.That(result.RacId, Is.EqualTo(racId));
    }
}
using Person.GraphQL.Types;

namespace Person.Tests.TestCases;
public class PersonBaseSanitiseInputTest
{
    [TestCase(null!, null!)]
    [TestCase("", "")]
    [TestCase("0423456789", "0423456789")]
    [TestCase("042 345 6789", "0423456789")]
    [TestCase("  042   345   6789  ", "0423456789")]
    public void Should_Sanitise_PersonBase(string number, string expectedNumber)
    {
        var person = new PersonBase { MobilePhone = number, HomePhone = number, WorkPhone = number };

        person.SanitiseInput();

        Assert.Multiple(() =>
        {
            Assert.That(person.MobilePhone,Is.EqualTo(expectedNumber));
            Assert.That(person.HomePhone, Is.EqualTo(expectedNumber));
            Assert.That(person.WorkPhone, Is.EqualTo(expectedNumber));
        });
    }
}

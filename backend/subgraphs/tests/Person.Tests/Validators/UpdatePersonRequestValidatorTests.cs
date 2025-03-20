using FluentValidation.TestHelper;
using Person.API.Person.Models;
using Person.GraphQL.Validators;

namespace Person.Tests.Validators;

public class UpdatePersonRequestValidatorTests
{
    private UpdatePersonRequestValidator _validator;

    [SetUp]
    public void Setup()
    {
        // Initialize the validator before each test.
        _validator = new();
    }

    [TestCase("")]
    [TestCase(null!)]
    [TestCase("John")]
    [TestCase("A long first name")]
    public void Should_Validate_Valid_FirsName(string firstName)
    {
        var person = new UpdatePersonRequest { FirstName = firstName };

        var result = _validator.TestValidate(person);

        result.ShouldNotHaveValidationErrorFor(x => x.MiddleName);
    }

    [TestCase("A very very very very very long first name that exceeds fifty characters")]
    [TestCase("John@Doe")]
    [TestCase("1234")]
    public void Should_Not_Validate_Invalid_FirstName(string firstName)
    {
        var person = new UpdatePersonRequest { FirstName = firstName };

        var result = _validator.TestValidate(person);

        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }
}
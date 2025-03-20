using FluentValidation.TestHelper;
using Person.GraphQL.Types;
using Person.GraphQL.Validators;

namespace Person.Tests.Validators;

public class PersonBaseValidatorTests
{
    private PersonBaseValidator _validator;

    [SetUp]
    public void Setup()
    {
        // Initialize the validator before each test.
        _validator = new PersonBaseValidator();
    }

    #region MiddleName Tests

    [TestCase("")]
    [TestCase("John")]
    [TestCase("A long middle name")]
    public void Should_Validate_Valid_MiddleName(string middleName)
    {
        var person = new PersonBase { MiddleName = middleName };

        var result = _validator.TestValidate(person);

        result.ShouldNotHaveValidationErrorFor(x => x.MiddleName);
    }

    [TestCase("A very very very very very long middle name that exceeds fifty characters")]
    [TestCase("John@Doe")]
    public void Should_Not_Validate_Invalid_MiddleName(string middleName)
    {
        var person = new PersonBase { MiddleName = middleName };

        var result = _validator.TestValidate(person);

        result.ShouldHaveValidationErrorFor(x => x.MiddleName);
    }

    #endregion

    #region Surname Tests

    [TestCase("Smith")]
    [TestCase("O'Neil")]
    [TestCase("McDonald")]
    [TestCase("John-Smith")]
    public void Should_Validate_Valid_Surname(string surname)
    {
        var person = new PersonBase { Surname = surname };

        var result = _validator.TestValidate(person);

        result.ShouldNotHaveValidationErrorFor(x => x.Surname);
    }

    [TestCase("A very very very very very long surname that exceeds fifty-five characters")]
    [TestCase("Smith#")]
    public void Should_Not_Validate_Invalid_Surname(string surname)
    {
        var person = new PersonBase { Surname = surname };

        var result = _validator.TestValidate(person);

        result.ShouldHaveValidationErrorFor(x => x.Surname);
    }

    #endregion

    #region Phone Number Tests

    #region MobilePhone

    [TestCase(null!)]
    [TestCase("0423456789")]
    [TestCase("0234567890")]
    [TestCase("0745678901")]
    public void Should_Validate_Valid_MobilePhone(string mobilePhone)
    {
        var person = new PersonBase { MobilePhone = mobilePhone };

        var result = _validator.TestValidate(person);

        result.ShouldNotHaveValidationErrorFor(x => x.MobilePhone);
    }

    [TestCase("1234")]
    [TestCase("01234abcde")]
    [TestCase("01345678901234")]
    public void Should_Not_Validate_Invalid_MobilePhone(string mobilePhone)
    {
        var person = new PersonBase { MobilePhone = mobilePhone };

        var result = _validator.TestValidate(person);

        result.ShouldHaveValidationErrorFor(x => x.MobilePhone);
    }

    #endregion

    #region HomePhone

    [TestCase(null!)]
    [TestCase("")]
    [TestCase("0234567890")]
    [TestCase("0745678901")]
    public void Should_Validate_Valid_HomePhone(string homePhone)
    {
        var person = new PersonBase { HomePhone = homePhone };

        var result = _validator.TestValidate(person);

        result.ShouldNotHaveValidationErrorFor(x => x.HomePhone);
    }

    [TestCase("0123456789")]
    [TestCase("01234abcde")]
    [TestCase("01345678901234")]
    public void Should_Not_Validate_Invalid_HomePhone(string homePhone)
    {
        var person = new PersonBase { HomePhone = homePhone };

        var result = _validator.TestValidate(person);

        result.ShouldHaveValidationErrorFor(x => x.HomePhone);
    }

    #endregion

    #region WorkPhone

    [TestCase(null!)]
    [TestCase("")]
    [TestCase("0234567890")]
    [TestCase("0745678901")]
    public void Should_Validate_Valid_WorkPhone(string workPhone)
    {
        var person = new PersonBase { WorkPhone = workPhone };

        var result = _validator.TestValidate(person);

        result.ShouldNotHaveValidationErrorFor(x => x.WorkPhone);
    }

    [TestCase("1234")]
    [TestCase("0123456789")]
    [TestCase("01234abcde")]
    [TestCase("01345678901234")]
    public void Should_Not_Validate_Invalid_WorkPhone(string workPhone)
    {
        var person = new PersonBase { WorkPhone = workPhone };

        var result = _validator.TestValidate(person);

        result.ShouldHaveValidationErrorFor(x => x.WorkPhone);
    }

    #endregion

    #endregion

    #region PersonalEmailAddress Tests

    [TestCase(null!)]
    [TestCase("")]
    [TestCase("test@example.com")]
    [TestCase("valid_123@domain.co.uk")]
    [TestCase("email+test@sub.domain.com")]
    public void Should_Validate_Valid_PersonalEmailAddress(string email)
    {
        var person = new PersonBase { PersonalEmailAddress = email };

        var result = _validator.TestValidate(person);

        result.ShouldNotHaveValidationErrorFor(x => x.PersonalEmailAddress);
    }

    [TestCase("invalid-email")]
    [TestCase("another@invalid")]
    [TestCase("user@domain,com")]
    public void Should_Not_Validate_Invalid_PersonalEmailAddress(string email)
    {
        var person = new PersonBase { PersonalEmailAddress = email };

        var result = _validator.TestValidate(person);

        result.ShouldHaveValidationErrorFor(x => x.PersonalEmailAddress);
    }

    #endregion
}
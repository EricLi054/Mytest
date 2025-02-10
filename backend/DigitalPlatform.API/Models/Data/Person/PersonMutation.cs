using DigitalPlatform.API.Extensions;
using DigitalPlatform.API.Validators;

namespace DigitalPlatform.API.Models.Data.Person;

public class PersonUpdateMutation
{
    public string? Title { get; set; }

    [FirstNameValidation(AllowNull = true, AllowEmpty = true)]
    public string? FirstName { get; set; }

    [MiddleNameValidation(AllowNull = true, AllowEmpty = true)]
    public string? MiddleName { get; set; }

    [LastNameValidation(AllowNull = true, AllowEmpty = true)]
    public string? Surname { get; set; }

    [PhoneNumberValidation(AllowNull = true, AllowEmpty = true)]
    public string? MobilePhone { get; set; }

    [PhoneNumberValidation(AllowNull = true, AllowEmpty = true)]
    public string? HomePhone { get; set; }

    [PhoneNumberValidation(AllowNull = true, AllowEmpty = true)]
    public string? WorkPhone { get; set; }

    [EmailValidation(AllowNull = true, AllowEmpty = true)]
    public string? PersonalEmailAddress { get; set; }
    public AddressUpdateMutation? PostalAddress { get; set; }

    public void SanitiseInput()
    {
        MobilePhone = MobilePhone?.RemoveWhitespace();
        HomePhone = HomePhone?.RemoveWhitespace();
        WorkPhone = WorkPhone?.RemoveWhitespace();
    }
}

public class AddressUpdateMutation
{
    // TODO: Remove
    public string? Value { get; set; }
    // TODO: Remove
    public string? Label { get; set; }
    public string? BuildingName { get; set; }
    public string? SubBuildingNumber { get; set; }
    public string? UnitNumber { get; set; }
    public string? LotNumber { get; set; }
    public string? HouseNumber { get; set; }
    public string? StreetName { get; set; }
    public string? POBox { get; set; }
    public string? Suburb { get; set; }
    public string? State { get; set; }
    public string? Postcode { get; set; }
    public string? Country { get; set; }
    public string? Dpid { get; set; }
}

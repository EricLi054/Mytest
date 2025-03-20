using FluentValidation;
using Person.GraphQL.Types;

namespace Person.GraphQL.Validators;

public class PersonBaseValidator : AbstractValidator<PersonBase>
{
    public PersonBaseValidator()
    {
        RuleFor(x => x.MiddleName)
            .Matches(GetNameRegex(50)) // 50 characters for Middle Name
            .When(x => !string.IsNullOrEmpty(x.MiddleName))
            .WithMessage("Invalid middle name");

        RuleFor(x => x.Surname)
            .Matches(GetNameRegex(55)) // 55 characters for Surname
            .When(x => !string.IsNullOrEmpty(x.Surname))
            .WithMessage("Invalid surname");

        RuleFor(x => x.MobilePhone)
            .Matches(GetPhoneNumberRegex())
            .When(x => !string.IsNullOrEmpty(x.MobilePhone))
            .WithMessage("Invalid mobile phone number");

        RuleFor(x => x.HomePhone)
            .Matches(GetPhoneNumberRegex())
            .When(x => !string.IsNullOrEmpty(x.HomePhone))
            .WithMessage("Invalid home phone number");

        RuleFor(x => x.WorkPhone)
            .Matches(GetPhoneNumberRegex())
            .When(x => !string.IsNullOrEmpty(x.WorkPhone))
            .WithMessage("Invalid work phone number");

        RuleFor(x => x.PersonalEmailAddress)
            .Matches(@"^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$")
            .When(x => !string.IsNullOrEmpty(x.PersonalEmailAddress))
            .WithMessage("Invalid personal email");
    }

    internal static string GetNameRegex(int maxLength)
    {
        return $@"^[a-zA-Z\-'() ]{{1,{maxLength}}}$";
    }

    private static string GetPhoneNumberRegex()
    {
        return @"^(((0)(2|4|3|7|8)){0,1})[0-9]{2}[0-9]{2}[0-9]{4}$";
    }
}
using FluentValidation;
using Person.API.Person.Models;

namespace Person.GraphQL.Validators;

public class UpdatePersonRequestValidator : AbstractValidator<UpdatePersonRequest>
{
    public UpdatePersonRequestValidator()
    {
        // Inherit validation from PersonBase
        Include(new PersonBaseValidator());

        RuleFor(x => x.FirstName)
            .Matches(PersonBaseValidator.GetNameRegex(50)) // 50 characters for First Name
            .When(x => !string.IsNullOrEmpty(x.FirstName))
            .WithMessage("Invalid first name");
    }
}
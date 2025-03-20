using FluentValidation;

public class VehicleByRegoQueryValidator : AbstractValidator<VehicleByRegoQuery>
{
    public VehicleByRegoQueryValidator()
    {
        RuleFor(query => query.RegistrationNumber)
            .Matches(@"^[A-Za-z0-9]{1,9}$")
            .WithMessage("Registration number is invalid.");
    }
}
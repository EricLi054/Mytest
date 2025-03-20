using FluentValidation;
using Motoring.GraphQL.Types;

namespace Motoring.GraphQL.Validators;

public class VehicleDetailValidator : AbstractValidator<VehicleDetail>
{
    public VehicleDetailValidator()
    {
        RuleFor(query => query.RegistrationNumber)
            .Matches(@"^[A-Za-z0-9]{1,9}$")
            .WithMessage("Registration number is invalid.");
    }
}
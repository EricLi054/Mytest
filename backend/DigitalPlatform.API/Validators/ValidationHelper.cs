using System.ComponentModel.DataAnnotations;
using DigitalPlatform.API.GraphQL.Exceptions;

namespace DigitalPlatform.API.Validators;

public static class ValidationHelper
{
    public static List<ValidationError> GetValidationErrors(object thing)
    {
        ArgumentNullException.ThrowIfNull(thing);

        List<ValidationResult> validationResults = [];
        _ = Validator.TryValidateObject(thing, new ValidationContext(thing), validationResults, true);

        return validationResults
                .Select(v => new ValidationError(v.ErrorMessage ?? "", v.MemberNames))
                .ToList();
    }
}

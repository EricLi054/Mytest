using System.ComponentModel.DataAnnotations;

namespace DigitalPlatform.API.Validators;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
sealed public class FirstNameValidationAttribute : ValidationAttribute
{
    public bool AllowNull { get; set; }
    public bool AllowEmpty { get; set; }

    public FirstNameValidationAttribute()
    {
        AllowNull = false;
        AllowEmpty = false;
    }

    public override bool IsValid(object? value)
    {

        if (AllowNull && value == null)
        {
            return true;
        }

        if (value is string firstName)
        {
            if (AllowEmpty && firstName == string.Empty)
            {
                return true;
            }

            return DDAValidations.ValidateFirstName(firstName);
        }
        return false;
    }
}

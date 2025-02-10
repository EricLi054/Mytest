using System.ComponentModel.DataAnnotations;

namespace DigitalPlatform.API.Validators;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
sealed public class MiddleNameValidationAttribute : ValidationAttribute
{
    public bool AllowNull { get; set; }
    public bool AllowEmpty { get; set; }

    public MiddleNameValidationAttribute()
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

        if (value is string middleName)
        {
            if (AllowEmpty && middleName == string.Empty)
            {
                return true;
            }

            return DDAValidations.ValidateMiddleName(middleName);
        }
        return false;
    }
}

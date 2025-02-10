using System.ComponentModel.DataAnnotations;

namespace DigitalPlatform.API.Validators;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
sealed public class LastNameValidationAttribute : ValidationAttribute
{
    public bool AllowNull { get; set; }
    public bool AllowEmpty { get; set; }

    public LastNameValidationAttribute()
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

        if (value is string lastName)
        {
            if (AllowEmpty && lastName == string.Empty)
            {
                return true;
            }

            return DDAValidations.ValidateLastName(lastName);
        }
        return false;
    }
}

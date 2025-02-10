using System.ComponentModel.DataAnnotations;

namespace DigitalPlatform.API.Validators;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
sealed public class EmailValidationAttribute : ValidationAttribute
{
    public bool AllowNull { get; set; }
    public bool AllowEmpty { get; set; }

    public EmailValidationAttribute()
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

        if (value is string email)
        {
            if (AllowEmpty && email == string.Empty)
            {
                return true;
            }

            return DDAValidations.ValidateEmail(email);
        }
        return false;
    }
}

using System.ComponentModel.DataAnnotations;

namespace DigitalPlatform.API.Validators;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
sealed public class PhoneNumberValidationAttribute : ValidationAttribute
{
    public bool AllowNull { get; set; }
    public bool AllowEmpty { get; set; }

    public PhoneNumberValidationAttribute()
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

        if (value is string phoneNumber)
        {
            if (AllowEmpty && phoneNumber == string.Empty)
            {
                return true;
            }

            return DDAValidations.ValidatePhoneNumber(phoneNumber);
        }
        return false;
    }
}

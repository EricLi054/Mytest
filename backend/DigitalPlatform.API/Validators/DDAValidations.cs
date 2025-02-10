using System.Text.RegularExpressions;

namespace DigitalPlatform.API.Validators
{
    public static class DDAValidations
    {
        public static bool ValidateField(string fieldValue, string regexPattern)
        {
            Regex regex = new(regexPattern);
            return regex.IsMatch(fieldValue);
        }

        public static bool ValidateFirstName(string firstName)
        {
            // Regular expression for validating first name
            string firstNameRegex = @"^[a-zA-Z\-'() ]{1,50}$";
            return ValidateField(firstName, firstNameRegex);
        }

        public static bool ValidateMiddleName(string middleName)
        {
            // Regular expression for validating last name
            string middleNameRegex = @"^[a-zA-Z\-'() ]{0,50}$";
            return ValidateField(middleName, middleNameRegex);
        }

        public static bool ValidateLastName(string lastName)
        {
            // Regular expression for validating last name
            string lastNameRegex = @"^[a-zA-Z\-'() ]{1,55}$";
            return ValidateField(lastName, lastNameRegex);
        }

        public static bool ValidatePhoneNumber(string phoneNumber)
        {
            // Regular expression for validating phone number
            string phoneRegex = @"^(((0)(2|4|3|7|8)){0,1})[0-9]{2}[0-9]{2}[0-9]{4}$";
            return ValidateField(phoneNumber, phoneRegex);
        }

        public static bool ValidateEmail(string email)
        {
            // Regular expression for validating email
            string emailRegex = @"^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$";
            return ValidateField(email, emailRegex);
        }
    }
}

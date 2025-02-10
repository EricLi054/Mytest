using System.Text;
using System.Text.Json;

namespace DigitalPlatform.API.Extensions;
public static class StringExtensions
{
    /// <summary>
    /// validate that a string is a valid Guid
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
    public static bool IsValidGuid(this string str)
    {
        return Guid.TryParse(str, out _);
    }

    /// <summary>
    /// Remove whitespace from a string
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
    public static string RemoveWhitespace(this string str)
    {
        if (string.IsNullOrEmpty(str)) return str;
        return new string(str.Where(c => !char.IsWhiteSpace(c)).ToArray());
    }

    /// <summary>
    /// Gets the string content for the query, for use in a POST request
    /// </summary>
    /// <param name="query"></param>
    /// <returns></returns>
    public static StringContent GetStringContent(this string query)
    {
        var content = new
        {
            query
        };

        var jsonContent = JsonSerializer.Serialize(content);
        return new StringContent(jsonContent, Encoding.UTF8, "application/json");
    }

    /// <summary>
    /// Mask the a portion of a string, with numToMask being the number of characters from the start of the string that are masked.
    /// </summary>
    /// <param name="toMask"></param>
    /// <param name="numToMask"></param>
    /// <returns></returns>
    public static string MaskString(this string toMask, int numToMask)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(numToMask);

        if (string.IsNullOrEmpty(toMask))
            return toMask;

        if (toMask.Length <= numToMask)
            return new string('*', toMask.Length);

        return string.Concat(new string('*', numToMask), toMask.AsSpan(numToMask));
    }

    public static string GetTimeOfDay(this int currentHour)
    {
        // If the current hour between 12am and 12pm, it's morning
        // If the current hour is after 12pm but before 6pm, it's afternoon
        // Otherwise, it's evening
        return currentHour switch
        {
            >= 0 and < 12 => "morning",
            >= 12 and < 18 => "afternoon",
            _ => "evening"
        };
    }

    public static string HashData(this string input)
    {
        // Convert the input string to a byte array and compute the hash
        var inputBytes = Encoding.UTF8.GetBytes(input);
        var hashBytes = System.Security.Cryptography.SHA512.HashData(inputBytes);

        // Convert the byte array to a hex string
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
    }
    public static string MaskEmail(this string email)
    {
        //masks email before logging
        var emailParts = email.Split('@');
        if (emailParts.Length != 2)
        {
            //not email, return input
            return email;
        }
        var mask = new string('*', 3);
        var maskedLocalPart = emailParts[0].Length switch
        {
            <= 2 => mask,
            _ => $"{emailParts[0][0]}{mask}{emailParts[0][^1]}"
        };
        return $"{maskedLocalPart}@{emailParts[1]}";
    }

    public static string PadMobileNumber(this string mobileNumber)
    {
        if (string.IsNullOrEmpty(mobileNumber))
        {
            return string.Empty;
        }
        // MyRAC only supports 10 digit mobile numbers
        if (mobileNumber.Length == 10)
        {
            return $"{mobileNumber[..4]} {mobileNumber[4..7]} {mobileNumber[7..mobileNumber.Length]}";
        }

        return mobileNumber;
    }

    public static string PadLandlineNumber(this string landlineNumber)
    {
        if (string.IsNullOrEmpty(landlineNumber))
        {
            return string.Empty;
        }

        // Landline number without an area code - **** *123
        if (landlineNumber.Length == 8)
        {
            return $"{landlineNumber[..4]} {landlineNumber[4..landlineNumber.Length]}";
        }

        // Landline number with an area code - 08 **** *123
        if (landlineNumber.Length == 10)
        {
            return $"{landlineNumber[..2]} {landlineNumber[2..6]} {landlineNumber[6..landlineNumber.Length]}";
        }

        return landlineNumber;
    }


}

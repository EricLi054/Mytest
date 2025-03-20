using Shared.Constants;

namespace Shared.Extensions;

public static class MaskingExtensions
{
    public static string MaskString(this string toMask, int numToMask)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(numToMask);

        if (string.IsNullOrEmpty(toMask))
        {
            return toMask;
        }

        if (toMask.Length <= numToMask)
        {
            return new string('*', toMask.Length);
        }

        return string.Concat(new string('*', numToMask), toMask.AsSpan(numToMask));
    }

    public static string MaskEmail(this string email)
    {
        var emailParts = email.Split('@');
        if (emailParts.Length != 2)
        {
            return email;
        }
        var mask = new string('*', 3);
        var maskedLocal = "";

        if (emailParts[0].Length <= 2)
        {
            maskedLocal = mask;
        }
        else
        {
            maskedLocal = $"{emailParts[0][0]}{mask}{emailParts[0][^1]}";
        }

        return $"{maskedLocal}@{emailParts[1]}";
    }

    public static string PadMobileNumber(this string mobileNumber)
    {
        if (string.IsNullOrEmpty(mobileNumber))
        {
            return string.Empty;
        }

        if (mobileNumber.Length == PhoneNumberLengths.Mobile)
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

        if (landlineNumber.Length == PhoneNumberLengths.LandlineWithoutAreaCode)
        {
            return $"{landlineNumber[..4]} {landlineNumber[4..landlineNumber.Length]}";
        }

        if (landlineNumber.Length == PhoneNumberLengths.LandlineWithAreaCode)
        {
            return $"{landlineNumber[..2]} {landlineNumber[2..6]} {landlineNumber[6..landlineNumber.Length]}";
        }

        return landlineNumber;
    }
}

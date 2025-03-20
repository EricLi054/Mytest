namespace Person.API.MFA.Models;

public class OtpVerificationDetailsResponse
{
    /// <summary>
    /// Is the member authenticated for the unique session key.
    /// </summary>
    /// <remarks>
    /// Member will be authenticated to make changes to their account using 
    /// the session key for the session time to live period that is
    /// defined by the RACI MFA OTP Service (currently 10 minutes).
    /// </remarks>
    public required bool IsAuthenticated { get; set; }

    /// <summary>
    /// Is phone number for OTP a mobile number.
    /// </summary>
    /// <remarks>
    /// Will default to false if IsAuthenticated is true.
    /// </remarks>
    public bool? IsMobile { get; set; }

    /// <summary>
    /// Suffix of the phone number the OTP code will be sent to.
    /// </summary>
    /// <remarks>
    /// Will return null if IsAuthenticated is true.
    /// </remarks>
    public string? PhoneNumberSuffix { get; set; }
}

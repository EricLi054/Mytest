namespace Person.API.MFA.Models;

public class VerifyOtpResponse
{
    /// <summary>
    /// Was the OTP code the member provided verified.
    /// </summary>
    /// <remarks>
    /// Once the OTP code is verified, the member is authenticated for the
    /// unique session key provided in the <see cref="VerifyOtpRequest"/>.
    /// Member will be authenticated to make changes to their account using 
    /// the session key for the session time to live period that is
    /// defined by the RACI MFA OTP Service (currently 10 minutes).
    /// </remarks>
    public required bool IsVerified { get; set; }
}

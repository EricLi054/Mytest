namespace Person.API.MFA.Models;

public class CheckOtpResponse
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
}

namespace Person.API.MFA.Models;

public class SendOtpResponse
{
    /// <summary>
    /// Does the member have remaining OTP send attempts
    /// for the unique MFA journey session key.
    /// </summary>
    /// <remarks>
    /// Default value defined in the RACI MFA OTP Service is currently 5.
    /// </remarks>
    public required bool HasSendAttemptsRemaining { get; set; }
}

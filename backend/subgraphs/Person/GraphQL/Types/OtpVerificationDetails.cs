namespace Person.GraphQL.Types;

/// <summary>
/// Type for result of get OTP Verification Details mutations.
/// </summary>
public class OtpVerificationDetails
{
    /// <summary>
    /// MFA Journey Session Key (eg Registration, ManageContact).
    /// A person (identified by CRM ID) can have multiple MFA journeys.
    /// Key must be unique to ensure member data is secure across devices.
    /// </summary>
    /// <remarks>
    /// TODO - Is this required if it is just the input parameter? Should SessionKey/IsAuthenticated result be validated together by consumer to ensure member is authenticated for correct journey?
    /// </remarks>
    public required string SessionKey { get; set; }

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
    public required bool? IsMobile { get; set; }

    /// <summary>
    /// Suffix of the phone number the OTP code will be sent to.
    /// </summary>
    /// <remarks>
    /// Will return null if IsAuthenticated is true.
    /// </remarks>
    public required string? PhoneNumberSuffix { get; set; }
}

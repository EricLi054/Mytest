namespace Person.API.MFA.Models;

public class OtpVerificationDetailsRequest
{
    /// <summary>
    /// MFA Journey Session Key (eg Registration, ManageContact).
    /// A person (identified by CRM ID) can have multiple MFA journeys.
    /// Key must be unique to ensure member data is secure across devices.
    /// </summary>
    /// <remarks>
    /// The next-rac-com-au implementation uses constant
    /// values to indicate specific MFA journeys
    /// (MFAJourneyKeys such as 'my-rac-manage-contact-details').
    /// The Spark apps use the unique Spark session key that is
    /// generated for the members session on that specific Spark app.
    /// The session key in the digital platform could be used across
    /// journeys (eg manage contact details vs manage bank accounts),
    /// so the member should re-authenticate for security reasons.
    /// Ideally the new digital platform JourneySessionKey will be
    /// prefixed with the MFAJourneyKey and session key as the suffix.
    /// </remarks>
    public required string Key { get; set; }
}

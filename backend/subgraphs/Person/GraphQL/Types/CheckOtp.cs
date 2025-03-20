namespace Person.GraphQL.Types;

/// <summary>
/// Type for result of return for Check OTP mutations.
/// </summary>
/// <remarks>
/// This type is for logged-in members authenticated using Azure ADB2C.
/// </remarks>
public class CheckOtp
{
    /// <summary>
    /// Person Identifier (RACWA-CRM-ID).
    /// </summary>
    [GraphQLIgnore]
    public required string CrmId { get; set; }

    /// <summary>
    /// MFA Journey Session Key (eg Registration, ManageContact).
    /// A person (identified by CRM ID) can have multiple MFA journeys.
    /// Key must be unique to ensure member data is secure across devices.
    /// </summary>
    [GraphQLIgnore]
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
}

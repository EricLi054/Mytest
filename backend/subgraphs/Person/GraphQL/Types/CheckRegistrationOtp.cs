namespace Person.GraphQL.Types;

/// <summary>
/// Type for result of Check Registration OTP mutations.
/// </summary>
/// <remarks>
/// This type is for the registration flow where anonymous users are
/// trying to register for myRAC that are authenticated using Azure AD.
/// </remarks>
public class CheckRegistrationOtp : CheckOtp
{
}

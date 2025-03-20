using HotChocolate.Authorization;

namespace Person.Attributes;

/// <summary>
///     Attribute to authorize a logged-in user
///     (eg a member that is logged into myRAC)
///     using Azure ADB2C (Active Directory for B2C).
/// </summary>
public class AuthorizeAzureAdB2CPolicyAttribute : AuthorizeAttribute
{
    public AuthorizeAzureAdB2CPolicyAttribute()
    {
        Policy = Constants.Authorization.AzureAdB2C.Policy;
    }
}
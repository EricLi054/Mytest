using HotChocolate.Authorization;

namespace Person.Attributes;

/// <summary>
///     Attribute to authorize an anonymous user
///     (eg a member that is trying to register for myRAC)
///     using Azure AD (Active Directory).
/// </summary>
public class AuthorizeAzureAdPolicyAttribute : AuthorizeAttribute
{
    public AuthorizeAzureAdPolicyAttribute()
    {
        Policy = Constants.Authorization.AzureAd.Policy;
    }
}
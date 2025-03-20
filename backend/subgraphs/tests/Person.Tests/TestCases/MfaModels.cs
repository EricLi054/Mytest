using Person.API.MFA.Models;
using System.Collections;

namespace Person.Tests.TestCases;

public static class MfaModels
{
    public static IEnumerable OtpVerificationDetailsResponse
    {
        get
        {
            yield return new TestCaseData(new OtpVerificationDetailsResponse
            {
                IsAuthenticated = false,
                IsMobile = true,
                PhoneNumberSuffix = "123"
            }).SetDescription("NotAuthenticated");
            yield return new TestCaseData(new OtpVerificationDetailsResponse
            {
                IsAuthenticated = true,
                IsMobile = false,
                PhoneNumberSuffix = null
            }).SetDescription("IsAuthenticated");
        }
    }
}

namespace Person;

public static class Constants
{
    public const string DefaultSourceSystem = "DigitalPlatform/PersonSubgraph";

    public static class Authorization
    {
        public static class AzureAd
        {
            public const string Policy = $"{Microsoft.Identity.Web.Constants.AzureAd}Policy";
            public const string Scheme = $"{Microsoft.Identity.Web.Constants.AzureAd}Scheme";
        }

        public static class AzureAdB2C
        {
            public const string Policy = $"{Microsoft.Identity.Web.Constants.AzureAdB2C}Policy";
            public const string Scheme = $"{Microsoft.Identity.Web.Constants.AzureAdB2C}Scheme";
        }
    }

    public static class ConfigurationKeys
    {
        public static class Apim
        {
            public const string BaseUrl = "APIM:BaseUrl";
            public const string PersonApiEndpoint = "APIM:PersonApiEndpoint";
            public const string MfaApiEndpoint = "APIM:MfaApiEndpoint";
        }
    }
}

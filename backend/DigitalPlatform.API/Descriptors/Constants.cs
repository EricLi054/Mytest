namespace DigitalPlatform.API.Descriptors;

public static class FeatureFlags
{
    public static readonly string UHYP = "myRAC_Feature_UHYP";
    public static readonly string UHYP_Pet = "myRAC_Feature_UHYP_Pet";
    public static readonly string UHYP_Boat = "myRAC_Feature_UHYP_Boat";
    public static readonly string UHYP_Mobility = "myRAC_Feature_UHYP_Mobility";
    public static readonly string OTP_Bypass = "myRAC_Feature_BypassOtp";
}

public static class Prefixes
{
    public static readonly string AzureAD = "AzureAdB2C";
}

public static class DaprComponents
{
    public static readonly string APIM_Endpoint = "apimendpoint";
    public static readonly string AppConfig = "appconfig";
    public static readonly string KeyVault = "keyvault";
    public static readonly string StateStore = "statestore";
}

public static class JwtClaims
{
    public static readonly string name = "name";
    public static readonly string crmId = "extension_crmId";
}

public static class FinOpsProductDetailsUrls
{
    public static readonly string FordRoadside = "/myrac/product-details/ford";
    public static readonly string Free2GoRoadside = "/myrac/product-details/free2go";
    public static readonly string MitsubishiRoadside = "/myrac/product-details/mitsubishi";
    public static readonly string SubaruRoadside = "/myrac/product-details/subaru";
    public static readonly string Wheels2Go = "/car-motoring/roadside-assistance/wheels2go";
    public static readonly string Rewards = "/membership-benefits/become-a-member/rewards-membership";
}

// Ordering should be Rewards (which in ideal world should not be seen with other products), Insurance, Roadside, Finance, Finance Quote, and Finance Application
public enum BusinessType
{
    Rewards = 0,
    Insurance = 1,
    RSA = 2,
    Finance = 3,
    FinanceQuote = 4,
    FinanceApplication = 5,
    // If None of the above, put at the bottom (unlikely to ever occur)
    Default = 99
}

public static class CacheDefaultConfigs
{
    public static readonly long Size = 1;
    public static readonly long SizeLimit = 1024;
    public static readonly int SlidingExpirationSeconds = 30;
    public static readonly int AbsoluteExpirationSeconds = 300;
}
public static class CryptographyDefaults
{
    public static readonly int DefaultSaltLength = 128 / 8;
    public static readonly int DefaultIterations = 10000;
}

public static class OtpConfigs
{
    public static readonly string bypassOtpHeaderKey = "Feature_BypassOtp";
    public static readonly string overrideNumberOtpHeaderKey = "Feature_OverrideToNumber";
    public static readonly HashSet<Uri> allowedUrls = new HashSet<Uri>
    {
        new Uri("https://az-api-sit.ractest.com.au"),
        new Uri("https://az-api-uat.ractest.com.au"),
    };

}

namespace DigitalPlatform.API.Descriptors
{
    public static class SecretDescriptors
    {
        #region Subscription Keys
        public static readonly string DIGITAL_CONTENT_API_SUBSCRIPTION_KEY = "digital-content-api-subscription-key";

        #endregion

        #region Finance Security
        public static readonly string FINANCE_SERVICE_ID = "finance-service-id";
        public static readonly string FINANCE_USER_NAME = "finance-user-name";
        public static readonly string FINANCE_ORGANISATION = "finance-organisation";
        #endregion

        #region External Services
        public static readonly string CONTENTFUL_SPACE_ID = "contentful-space-id";
        public static readonly string CONTENTFUL_ACCESS_TOKEN = "contentful-access-token";
        #endregion

        public static readonly string AES_KEY = "aes-key";
    }
}

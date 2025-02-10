namespace DigitalPlatform.API.Descriptors
{
    public static class ConfigDescriptors
    {
        #region API Headers Keys
        public static readonly string APIM_SUBSCRIPTION_KEY_HEADER_KEY = "apim-subscription-key-header";
        public static readonly string CORRELATION_ID_HEADER_KEY = "correlation-id-header";
        public static readonly string SOURCE_SYSTEM_HEADER_KEY = "source-system-header";
        #endregion

        #region Cache Configs
        public static readonly string CACHE_SLIDING_EXPIRATION_SECONDS = "cache-sliding-expiration-seconds";
        public static readonly string CACHE_ABSOLUTE_EXPIRATION_SECONDS = "cache-absolute-expiration-seconds";
        public static readonly string CACHE_SIZE_LIMIT = "cache-size-limit";
        public static readonly string CACHE_SIZE = "cache-size";
        #endregion

        #region App Specific
        public static readonly string APP_SOURCE_SYSTEM = "app-source-system";
        public static readonly string API_BASE_URL = "api-base-url";
        public static readonly string ALLOW_AUTHORIZED_BY_ACL = "AzureAdB2C:AllowWebApiToBeAuthorizedByACL";
        public static readonly string CLIENT_ID = "AzureAdB2C:ClientId";
        public static readonly string DOMAIN = "AzureAdB2C:Domain";
        public static readonly string INSTANCE = "AzureAdB2C:Instance";
        public static readonly string SIGN_UP_SIGN_IN_POLICY_ID = "AzureAdB2C:SignUpSignInPolicyId";
        public static readonly string FEATURE_TOGGLES = "feature-toggles";
        #endregion

        #region Person
        public static readonly string PERSON_API_GET_PERSON_URL = "person-api-getperson-url";
        public static readonly string PERSON_API_GET_PRODUCTS_URL = "person-api-getproducts-url";
        public static readonly string PERSON_API_GET_FINANCE_QUOTES = "person-api-finance-quotes";
        #endregion

        #region Insurance
        public static readonly string INSURANCE_API_GET_CONTACTS_URL = "insurance-api-getcontacts-url";
        public static readonly string INSURANCE_API_GET_PORTFOLIO_SUMMARY_URL = "insurance-api-getportfoliosummary-url";
        public static readonly string INSURANCE_API_GET_POLICY_URL = "insurance-api-getpolicy-url";
        public static readonly string INSURANCE_API_ENVIRONMENT_HEADER_KEY = "insurance-api-environment-header";
        public static readonly string INSURANCE_API_ENVIRONMENT = "insurance-api-environment";
        public static readonly string INSURANCE_B2C_URL = "insurance-b2c-url";
        public static readonly string INSURANCE_UHYP_URL = "insurance-uhyp-url";
        #endregion

        #region Finance
        public static readonly string FINANCE_API_GET_PRODUCT_LIST_URL = "finance-api-getproductlist-url";
        #endregion

        #region FinOps
        public static readonly string FINOPS_API_GET_PRODUCT_LIST_URL = "finops-api-getproductlist-url";
        public static readonly string FINOPS_API_GET_PRODUCT_DETAIL_URL = "finops-api-getproductdetail-url";
        public static readonly string FINOPS_API_GET_PRODUCT_HOLDING_LIST_URL = "finops-api-getproductholdinglist-url";
        public static readonly string FINOPS_API_GET_PRODUCT_HOLDING_URL = "finops-api-getproductholding-url";
        public static readonly string FINOPS_API_COMPANY_ID = "finops-api-company-id";
        public static readonly string FINOPS_PRODUCTS = "finops-products";
        #endregion

        #region Content
        public static readonly string CONTENT_GRAPHQL_ENDPOINT_URL = "contentful-graphql-endpoint-url";
        public static readonly string CONTENTFUL_ENVIRONMENT = "contentful-environment";
        #endregion

        #region ADB2C Graph
        public static readonly string ADB2C_GRAPH_GET_BY_EMAIL_URL = "adb2c-graph-get-by-email-url";
        #endregion

        #region Address Management
        public static readonly string ADDRESS_MANAGEMENT_API_SEARCH_GNAF_URL = "address-management-api-search-gnaf-url";
        public static readonly string ADDRESS_MANAGEMENT_API_SEARCH_PAF_URL = "address-management-api-search-paf-url";
        public static readonly string ADDRESS_MANAGEMENT_API_GET_PAF_URL = "address-management-api-get-paf-url";
        public static readonly string ADDRESS_MANAGEMENT_API_VERIFY_PAF_URL = "address-management-api-verify-paf-url";
        #endregion

        #region Otp
        public static readonly string OTP_API_SEND_OTP_URL = "otp-api-send-otp-url";
        public static readonly string OTP_API_VERIFY_OTP_URL = "otp-api-verify-otp-url";
        public static readonly string OTP_API_CHECK_OTP_URL = "otp-api-check-otp-url";
        public static readonly string OTP_API_OVERRIDE_NUMBER = "otp-api-override-number";
        #endregion

        #region MemberCards
        public static readonly string MEMBER_CARDS_CREATE_PHYSICAL_CARD_REQUEST_URL = "member-cards-create-physical-card-request-url";
        public static readonly string MEMBER_CARDS_RETRIEVE_DIGITAL_CARD_DETAILS_URL = "member-cards-retrieve-digital-card-details-url";
        #endregion

        #region General
        public static readonly string RAC_INSURANCE_WEBSITE_BASE_URL = "rac-insurance-website-base-url";
        #endregion
    }
}

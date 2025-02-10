using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class StartupServiceTests
{
    [TestFixture]
    public class SecretDescriptorsTests
    {
        [Test]
        public void SecretDescriptors_ContainsSubscriptionKeys()
        {
            Assert.That(SecretDescriptors.DIGITAL_CONTENT_API_SUBSCRIPTION_KEY, Is.EqualTo("digital-content-api-subscription-key"));
        }

        [Test]
        public void SecretDescriptors_ContainsFinanceSecurity()
        {
            Assert.That(SecretDescriptors.FINANCE_SERVICE_ID, Is.EqualTo("finance-service-id"));
            Assert.That(SecretDescriptors.FINANCE_USER_NAME, Is.EqualTo("finance-user-name"));
            Assert.That(SecretDescriptors.FINANCE_ORGANISATION, Is.EqualTo("finance-organisation"));
        }

        [Test]
        public void SecretDescriptors_ContainsExternalServices()
        {
            Assert.That(SecretDescriptors.CONTENTFUL_SPACE_ID, Is.EqualTo("contentful-space-id"));
            Assert.That(SecretDescriptors.CONTENTFUL_ACCESS_TOKEN, Is.EqualTo("contentful-access-token"));
        }

        [Test]
        public void ConfigDescriptors_ContainAllKeys()
        {
            Assert.That(ConfigDescriptors.CORRELATION_ID_HEADER_KEY, Is.EqualTo("correlation-id-header"));
            Assert.That(ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY, Is.EqualTo("source-system-header"));
            Assert.That(ConfigDescriptors.APP_SOURCE_SYSTEM, Is.EqualTo("app-source-system"));
            Assert.That(ConfigDescriptors.API_BASE_URL, Is.EqualTo("api-base-url"));
            Assert.That(ConfigDescriptors.PERSON_API_GET_PERSON_URL, Is.EqualTo("person-api-getperson-url"));
            Assert.That(ConfigDescriptors.PERSON_API_GET_PRODUCTS_URL, Is.EqualTo("person-api-getproducts-url"));
            Assert.That(ConfigDescriptors.INSURANCE_API_GET_CONTACTS_URL, Is.EqualTo("insurance-api-getcontacts-url"));
            Assert.That(ConfigDescriptors.INSURANCE_API_GET_PORTFOLIO_SUMMARY_URL, Is.EqualTo("insurance-api-getportfoliosummary-url"));
            Assert.That(ConfigDescriptors.INSURANCE_API_GET_POLICY_URL, Is.EqualTo("insurance-api-getpolicy-url"));
            Assert.That(ConfigDescriptors.INSURANCE_API_ENVIRONMENT_HEADER_KEY, Is.EqualTo("insurance-api-environment-header"));
            Assert.That(ConfigDescriptors.INSURANCE_API_ENVIRONMENT, Is.EqualTo("insurance-api-environment"));
            Assert.That(ConfigDescriptors.INSURANCE_B2C_URL, Is.EqualTo("insurance-b2c-url"));
            Assert.That(ConfigDescriptors.FINANCE_API_GET_PRODUCT_LIST_URL, Is.EqualTo("finance-api-getproductlist-url"));
            Assert.That(ConfigDescriptors.FINOPS_API_GET_PRODUCT_LIST_URL, Is.EqualTo("finops-api-getproductlist-url"));
            Assert.That(ConfigDescriptors.FINOPS_API_GET_PRODUCT_DETAIL_URL, Is.EqualTo("finops-api-getproductdetail-url"));
            Assert.That(ConfigDescriptors.FINOPS_API_GET_PRODUCT_HOLDING_LIST_URL, Is.EqualTo("finops-api-getproductholdinglist-url"));
            Assert.That(ConfigDescriptors.FINOPS_API_GET_PRODUCT_HOLDING_URL, Is.EqualTo("finops-api-getproductholding-url"));
            Assert.That(ConfigDescriptors.CONTENT_GRAPHQL_ENDPOINT_URL, Is.EqualTo("contentful-graphql-endpoint-url"));
            Assert.That(ConfigDescriptors.CONTENTFUL_ENVIRONMENT, Is.EqualTo("contentful-environment"));
            Assert.That(ConfigDescriptors.ADDRESS_MANAGEMENT_API_SEARCH_GNAF_URL, Is.EqualTo("address-management-api-search-gnaf-url"));
            Assert.That(ConfigDescriptors.ADDRESS_MANAGEMENT_API_SEARCH_PAF_URL, Is.EqualTo("address-management-api-search-paf-url"));
            Assert.That(ConfigDescriptors.ADDRESS_MANAGEMENT_API_GET_PAF_URL, Is.EqualTo("address-management-api-get-paf-url"));
            Assert.That(ConfigDescriptors.ADDRESS_MANAGEMENT_API_VERIFY_PAF_URL, Is.EqualTo("address-management-api-verify-paf-url"));
        }

        [Test]
        public void AddServices_ContainsServices()
        {
            Environment.SetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING", "some_random_string");

            var builder = WebApplication.CreateBuilder();

            StartupService.AddServices(builder);

            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IPersonService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IInsuranceService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IFinanceService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IFinOpsService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IHandlebarContextService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IProductService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IAddressService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IDateTimeProvider)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IMemoryCacheExtensionsWrapper)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(ICacheService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(ICryptographyService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IContentService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IDaprService)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(IAuthenticationHandlerProvider)));
            Assert.That(builder.Services, Has.One.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(OpenTelemetry.Trace.TracerProvider)));
        }

        [Test]
        public void AddServices_DoesntContainAppInsights()
        {
            var builder = WebApplication.CreateBuilder();
            Environment.SetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING", "");

            StartupService.AddServices(builder);

            Assert.That(builder.Services, Has.None.Matches<ServiceDescriptor>(x => x.ServiceType == typeof(OpenTelemetry.Trace.TracerProvider)));
        }
    }
}

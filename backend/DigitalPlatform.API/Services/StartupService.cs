using System.Text.Json;
using Dapr.Extensions.Configuration;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.GraphQL.DataLoaders;
using DigitalPlatform.API.GraphQL.Mutations;
using DigitalPlatform.API.GraphQL.Queries;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Extensions;
using Polly;
using Polly.Extensions.Http;
using DigitalPlatform.API.Helpers;
using System.Reflection;
using Microsoft.Identity.Web;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using Dapr.Client;
using DigitalPlatform.API.Helpers.ProductMapping;

namespace DigitalPlatform.API.Services
{
    public static class StartupService
    {
        public static List<DaprSecretDescriptor> GetSecretDescriptors()
        {
            var secretDescriptors = new List<DaprSecretDescriptor>();

            Type secretsClass = typeof(SecretDescriptors);
            FieldInfo[] secretDescriptorFields = secretsClass.GetFields();

            foreach (FieldInfo field in secretDescriptorFields)
            {
                if (field.FieldType == typeof(string))
                {
                    string fieldValue = field.GetValue(null) as string ?? "";
                    secretDescriptors.Add(new DaprSecretDescriptor(fieldValue));
                }
            }

            return secretDescriptors;
        }

        public static List<string> GetConfigDescriptors()
        {
            var appConfigDescriptors = new List<string>();

            Type configClass = typeof(ConfigDescriptors);
            FieldInfo[] configDescriptorFields = configClass.GetFields();

            foreach (FieldInfo field in configDescriptorFields)
            {
                if (field.FieldType == typeof(string))
                {
                    string fieldValue = field.GetValue(null) as string ?? "";
                    appConfigDescriptors.Add(fieldValue);
                }
            }

            return appConfigDescriptors;
        }

        public static void AddServices(WebApplicationBuilder builder)
        {
            var services = builder.Services;
            services.AddDaprClient();
            services.AddMicrosoftIdentityWebApiAuthentication(builder.Configuration, Prefixes.AzureAD);
            services.AddContainerHealthChecks(builder.Configuration);
            // Controllers
            services.AddControllers()
                    .AddJsonOptions(options =>
                    {
                        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    });

            // Configure Custom HttpClient, Singleton and Transient services
            Console.WriteLine("Attempting to load in all the Http Client Services");
            services.AddHttpClient<IContentService, ContentService>();

            static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
            {
                return HttpPolicyExtensions
                    .HandleTransientHttpError()
                    .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.NotFound)
                    .WaitAndRetryAsync(
                        3,
                        retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                        onRetry: (outcome, timespan, retryAttempt, context) =>
                        {
                            if (outcome.Result.RequestMessage?.Headers.TryGetValues("NoRetry", out _) == true)
                            {
                                throw new HttpRequestException(outcome.Result.ReasonPhrase, null, outcome.Result.StatusCode);
                            }
                        }
                    );
            }
            services.AddHttpClient<IDaprService, DaprService>()
            .SetHandlerLifetime(TimeSpan.FromMinutes(5))  //Set lifetime to five minutes
            .AddPolicyHandler(GetRetryPolicy());

            Console.WriteLine("Http Client Services loaded");

            services.AddHttpContextAccessor();

            Console.WriteLine("Attempting to load in all the Services");
            services.AddScoped<IPersonService, PersonService>();
            services.AddScoped<IInsuranceService, InsuranceService>();
            services.AddScoped<IFinanceService, FinanceService>();
            services.AddScoped<IFinOpsService, FinOpsService>();
            services.AddScoped<IHandlebarContextService, HandlebarContextService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IAddressService, AddressService>();
            services.AddScoped<IDateTimeProvider, DateTimeProvider>();
            services.AddScoped<IOtpService, OtpService>();
            services.AddScoped<IFeatureService, FeatureService>();
            services.AddScoped<IStatusService, StatusService>();
            services.AddScoped<IADB2CGraphService, ADB2CGraphService>();
            //this wrapper simply forwards calls to the static extension methods and maintains no state
            services.AddSingleton<IMemoryCacheExtensionsWrapper, MemoryCacheExtensionsWrapper>();
            //any cached object(s) would not exist beyond the scope of the request
            services.AddSingleton<ICacheService, CacheService>();
            services.AddSingleton<IDaprCacheService, DaprCacheService>();
            services.AddSingleton<ICryptographyService, CryptographyService>();
            services.AddSingleton<IMemberCardsService, MemberCardsService>();

            // Product mappers
            services.AddTransient<IProductMapper, RSAMapper>();
            services.AddTransient<IProductMapper, FinanceMapper>();
            services.AddTransient<IProductMapper, InsuranceMapper>();
            services.AddSingleton<IProductMapperRepository, ProductMapperRepository>();
            services.AddSingleton<IPolicyDetailsMapper, MemberProductsMapper>();

            Console.WriteLine("Services loaded");

            // GraphQL
            Console.WriteLine("Attempting to load the GraphQL server");
            services.AddGraphQLServer()
            .AddQueryType<BaseQuery>()
            .AddDataLoader<ContentDataLoader>()
            .AddMutationType<BaseMutation>()
            .AddMutationConventions()
            .InitializeOnStartup()
            .ModifyRequestOptions(x => x.ExecutionTimeout = TimeSpan.FromMinutes(2));
            Console.WriteLine("GraphQL server loaded");


            var sizeLimit = int.Parse(builder.Configuration[ConfigDescriptors.CACHE_SIZE_LIMIT] ?? CacheDefaultConfigs.SizeLimit.ToString());
            services.AddMemoryCache(options => options.SizeLimit = sizeLimit);

            // Application Insights
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING")))
            {
                Console.WriteLine("Attempting to init App Insights");
                services.AddOpenTelemetry().UseAzureMonitor();
                Console.WriteLine("App Insights initialised");
            }
        }

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public static class Dapr
        {
            public static async Task LoadDaprStores(WebApplicationBuilder builder, DaprClient daprClient)
            {
                Console.WriteLine("Waiting for Dapr Sidecar");
                await daprClient.WaitForSidecarAsync();
                Console.WriteLine("Dapr Sidecar loaded successfully");

                var SECRET_STORE_NAME = Environment.GetEnvironmentVariable("SECRET_STORE") ?? DaprComponents.KeyVault;
                var secretDescriptors = GetSecretDescriptors();
                Console.WriteLine("Attempting to load in the Secret store: {0}", SECRET_STORE_NAME);
                builder.Configuration.AddDaprSecretStore(SECRET_STORE_NAME, secretDescriptors, daprClient, TimeSpan.FromSeconds(10));
                Console.WriteLine("Secret Store loaded successfully");

                var CONFIG_STORE_NAME = Environment.GetEnvironmentVariable("CONFIG_STORE") ?? DaprComponents.AppConfig;
                Dictionary<string, string> metadata = new() { { "sentinelKey", "AppConfigVersion" } };

                Console.WriteLine("Attempting to load in the App Config store: {0}", CONFIG_STORE_NAME);
                builder.Configuration.AddDaprConfigurationStore(CONFIG_STORE_NAME, [], daprClient, TimeSpan.FromSeconds(10), metadata);
                builder.Configuration.AddStreamingDaprConfigurationStore(CONFIG_STORE_NAME, [], daprClient, TimeSpan.FromSeconds(10), metadata);

                var appConfigDescriptors = GetConfigDescriptors();
                var missingConfigValues = appConfigDescriptors.Where(descriptor => string.IsNullOrEmpty(builder.Configuration[descriptor])).ToList();

                if (missingConfigValues.Count == appConfigDescriptors.Count)
                {
                    throw new Exception("App config is not accessible.");
                }

                missingConfigValues.ForEach(descriptor => Console.WriteLine($"{descriptor} is missing from App Configuration"));
                Console.WriteLine("Config Store loaded successfully");
            }
        }
    }
}

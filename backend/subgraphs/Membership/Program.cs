using Azure.Identity;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using HotChocolate.AspNetCore;
using Membership.Interfaces;
using Membership.PolicyMappers;
using Membership.Services;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Membership.GraphQL.Types;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Shared.Services;
using Shared.Interfaces;
using Microsoft.FeatureManagement;
using Shared.Extensions;
using Microsoft.IdentityModel.Tokens;

var app = Membership.Program.CreateApp(args);
app.Run();

namespace Membership
{
    public static class Program
    {
        public static WebApplication CreateApp(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var environment = builder.Environment.EnvironmentName;
            builder.Configuration
                .AddJsonFile("appsettings.json", false, true)
                .AddJsonFile($"appsettings.{environment}.json", false, true)
                .AddEnvironmentVariables();

            if (builder.Environment.IsLocal() && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("CI"))
               )
            {
                var keyVaultUri = new Uri(builder.Configuration.GetConnectionString("KeyVault")!);
                builder.Configuration.AddAzureKeyVault(
                    keyVaultUri,
                    new DefaultAzureCredential(
                        new DefaultAzureCredentialOptions { TenantId = builder.Configuration["AppConfig:TenantId"]! }
                    )
                );
            }

            builder.Services.AddAzureAppConfiguration();
            builder.Services.AddFeatureManagement();
            builder.Services.AddTransient<IFeatureService, FeatureService>();

            SetupAppConfig(builder);
            SetupAuthentication(builder);

            AddHttpClients(builder.Services);
            AddScopedServices(builder.Services);
            AddTransientServices(builder.Services);

            builder
                .Services.AddGraphQLServer()
                // TODO: Update PayloadTypeNamePattern to match standard conventions for mutations
                .AddMutationConventions()
                .DisableIntrospection(!builder.Environment.IsLocal())
                .AddApolloFederation()
                .AddAuthorization()
                .AddType<Person>()
                .AddMembershipTypes()
                .AddInstrumentation();

            builder
                .Services.AddHealthChecks()
                .AddCheck<ReadinessHealthCheck>(nameof(ReadinessHealthCheck), tags: ["ready"]);

            builder
                .Services.AddOpenTelemetry()
                .UseAzureMonitor()
                .WithTracing(b =>
                {
                    b.AddHttpClientInstrumentation();
                    b.AddAspNetCoreInstrumentation();
                    b.AddHotChocolateInstrumentation();
                    b.AddSource("SubGraph");
                    b.SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(serviceName: "Membership"));
                });

            builder.Services.AddHttpContextAccessor();

            var app = builder.Build();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseAzureAppConfiguration();

            app.MapGraphQL()
                .WithOptions(
                    new GraphQLServerOptions
                    {
                        Tool =
                        {
                            //use embedded banana cake pop instead of from external cdn
                            ServeMode = GraphQLToolServeMode.Embedded,
                            //disable gui in non dev environments
                            Enable = app.Environment.IsLocal()
                        },
                    }
                );

            app.UseHealthChecks("/health/readiness",
                new HealthCheckOptions
                {
                    Predicate = app.Environment.IsDev()
                        ? _ => false
                        : healthCheck => healthCheck.Tags.Contains("ready")
                });
            app.UseHealthChecks("/health/liveness", new HealthCheckOptions { Predicate = _ => false });


            return app;
        }

        private static void SetupAuthentication(WebApplicationBuilder builder)
        {
            builder.Services
                .AddAuthentication()
                .AddJwtBearer(options =>
                {
                    builder.Configuration.Bind(Microsoft.Identity.Web.Constants.AzureAdB2C, options);
                    options.Authority =
                        $"{builder.Configuration["AzureAdB2C:Instance"]}{builder.Configuration["AzureAdB2C:Domain"]}/{builder.Configuration["AzureAdB2C:SignUpSignInPolicyId"]}";
                    options.TokenValidationParameters.ValidIssuer =
                        $"{builder.Configuration["AzureAdB2C:Instance"]}{builder.Configuration["AzureAdB2C:Domain"]}/v2.0/";
                    options.TokenValidationParameters.ValidAudiences = builder.Configuration
                        .GetSection("AzureAdB2C:ClientId").GetChildren().AsEnumerable().Select(kv => kv.Value);
                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            var loggerFactory =
                                context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>();
                            var logger = loggerFactory.CreateLogger("JwtValidation");
                            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                            {
                                logger.LogError("The token is expired.");
                            }
                            else if (context.Exception.GetType() == typeof(SecurityTokenInvalidAudienceException))
                            {
                                logger.LogError("Invalid audience.");
                            }
                            else
                            {
                                logger.LogError("There was an error validating the token: {ErrorType}",
                                    context.Exception.GetType());
                            }

                            return Task.CompletedTask;
                        }
                    };
                });
        }

        private static void SetupAppConfig(WebApplicationBuilder builder)
        {
            builder.Configuration.AddAzureAppConfiguration(options =>
            {
                options
                    .Connect(new Uri(builder.Configuration["AppConfig:Endpoint"]!),
                        new DefaultAzureCredential(new DefaultAzureCredentialOptions
                        {
                            ManagedIdentityClientId = builder.Configuration["AppConfig:ClientId"]!,
                            TenantId = builder.Configuration["AppConfig:TenantId"]!
                        }))
                    .TrimKeyPrefix("AzureAdB2C:")
                    .ConfigureRefresh(refreshOptions =>
                    {
                        refreshOptions
                            .Register(builder.Configuration["AppConfig:SentinelKey"], refreshAll: true)
                            .SetRefreshInterval(TimeSpan.FromSeconds(
                                double.Parse(builder.Configuration["AppConfig:ConfigRefreshInterval"]!)));
                    })
                    .UseFeatureFlags(featureFlagOptions =>
                    {
                        featureFlagOptions
                            .SetRefreshInterval(TimeSpan.FromSeconds(
                                double.Parse(builder.Configuration["AppConfig:FeatureFlagsRefreshInterval"]!)));
                    });
            });
        }

        private static void AddHttpClients(IServiceCollection services)
        {
            services
                .AddHttpClient<IPersonService, PersonService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));
            services
                .AddHttpClient<IFinOpsService, FinOpsService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));
            services
                .AddHttpClient<IFinanceService, FinanceService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));
            services.AddHttpClient<IInsuranceService, InsuranceService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));
            services.AddHttpClient<IMemberCardService, MemberCardService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));
            services.AddHttpClient<IADB2CGraphService, ADB2CGraphService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));
        }

        private static void AddScopedServices(IServiceCollection services)
        {
            services.AddScoped<IPersonService, PersonService>();
            services.AddScoped<IFinOpsService, FinOpsService>();
            services.AddScoped<IFinanceService, FinanceService>();
            services.AddScoped<IInsuranceService, InsuranceService>();
            services.AddScoped<IMemberCardService, MemberCardService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IAddressService, AddressService>();
            services.AddScoped<IADB2CGraphService, ADB2CGraphService>();
            services.AddScoped<IStatusService, StatusService>();
        }

        private static void AddTransientServices(IServiceCollection services)
        {
            services.AddTransient<IPolicyMappingService, PolicyMappingService>();
            services.AddTransient<IPolicyMapper, FinOpsMapper>();
            services.AddTransient<IPolicyMapper, FinanceMapper>();
            services.AddTransient<IPolicyMapper, InsuranceMapper>();
        }
    }
}
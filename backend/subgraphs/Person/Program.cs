using Azure.Identity;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using FluentValidation;
using HotChocolate.AspNetCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.FeatureManagement;
using Microsoft.Net.Http.Headers;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Person.API.ADB2C.Interfaces;
using Person.API.ADB2C.Services;
using Person.API.MFA.Interfaces;
using Person.API.MFA.Services;
using Person.API.Person.Interfaces;
using Person.API.Person.Services;
using Person.GraphQL.Validators;
using Person.Services;
using Shared.Extensions;
using Shared.Interfaces;
using Shared.Services;
using System.IdentityModel.Tokens.Jwt;
using static Person.Constants;

var app = Person.Program.CreateApp(args);
app.Run();

namespace Person
{
    public static class Program
    {
        private const string OptionsDefaultScheme = "SchemeSelection";

        public static WebApplication CreateApp(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            string tenantId = builder.Configuration["AppConfig:TenantId"]!;
            IEnumerable<string> azureAdb2CClientIds = builder.Configuration.GetSection("AzureAdB2C:ClientId")
                .GetChildren()
                .AsEnumerable()
                .Select(kv => kv.Value)!;

            var environment = builder.Environment.EnvironmentName;

            builder.Configuration
                .AddJsonFile("appsettings.json", false, true)
                .AddJsonFile($"appsettings.{environment}.json", false, true)
                .AddEnvironmentVariables();

            if (builder.Environment.IsLocal() && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("CI")))
            {
                var keyVaultUri = new Uri(builder.Configuration.GetConnectionString("KeyVault")!);
                builder.Configuration
                    .AddAzureKeyVault(keyVaultUri,
                        new DefaultAzureCredential(new DefaultAzureCredentialOptions { TenantId = tenantId }));
            }

            SetupAuthentication(builder, tenantId, azureAdb2CClientIds);

            builder.Services.AddHttpContextAccessor();

            builder.Services.AddValidatorsFromAssemblyContaining<UpdatePersonRequestValidator>();

            RegisterServices(builder);

            builder.Services
                .AddGraphQLServer()
                .AddMutationConventions(
                    //TODO: Discuss mutation convention standards for DEP and document and standardize our approach: https://rac-wa.atlassian.net/browse/DED-1915
                    new MutationConventionOptions
                    {
                        PayloadTypeNamePattern = "{MutationName}Response",
                        ApplyToAllMutations = false
                    })
                .DisableIntrospection(!builder.Environment.IsLocal())
                .AddApolloFederation()
                .ModifyOptions(o =>
                {
                    o.DefaultQueryDependencyInjectionScope = DependencyInjectionScope.Resolver;
                    o.DefaultMutationDependencyInjectionScope = DependencyInjectionScope.Request;
                })
                .AddAuthorization(options =>
                {
                    options.AddPolicy(Authorization.AzureAd.Policy, policy =>
                    {
                        policy.AuthenticationSchemes.Add(Authorization.AzureAd.Scheme);
                        policy.RequireAuthenticatedUser();
                        // TODO - RAC Dev user AD token is issued by https://sts.windows.net/ whereas managed identity might be https://login.microsoftonline.com/
                        policy.RequireClaim("iss",
                            $"https://sts.windows.net/{builder.Configuration["AzureAd:TenantId"]}/");
                        policy.RequireClaim("aud", builder.Configuration["AzureAd:Audience"]!);
                    });
                    options.AddPolicy(Authorization.AzureAdB2C.Policy, policy =>
                    {
                        policy.AuthenticationSchemes.Add(Authorization.AzureAdB2C.Scheme);
                        policy.RequireAuthenticatedUser();
                        policy.RequireClaim("iss",
                            $"{builder.Configuration["AzureAdB2C:Instance"]}{builder.Configuration["AzureAdB2C:Domain"]}/v2.0/");
                        policy.RequireClaim("aud", azureAdb2CClientIds);
                    });
                })
                .AddPersonTypes()
                .AddInstrumentation();

            builder.Services
                .AddHealthChecks()
                .AddCheck<ReadinessHealthCheck>(nameof(ReadinessHealthCheck), tags: ["ready"]);

            builder.Services
                .AddOpenTelemetry()
                .UseAzureMonitor()
                .WithTracing(
                    b =>
                    {
                        b.AddHttpClientInstrumentation();
                        b.AddAspNetCoreInstrumentation();
                        b.AddHotChocolateInstrumentation();
                        b.AddSource("SubGraph");
                        b.SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(serviceName: "Person"));
                    });

            builder.Services.AddAzureAppConfiguration();
            builder.Services.AddFeatureManagement();
            builder.Services.AddTransient<IFeatureService, FeatureService>();
            SetupAppConfig(builder);

            var app = builder.Build();

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
                        }
                    });

            SetupHealthChecks(app);

            return app;
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
                            .SetRefreshInterval(
                                TimeSpan.FromSeconds(
                                    double.Parse(builder.Configuration["AppConfig:ConfigRefreshInterval"]!)));
                    })
                    .UseFeatureFlags(featureFlagOptions =>
                    {
                        featureFlagOptions
                            .SetRefreshInterval(
                                TimeSpan.FromSeconds(
                                    double.Parse(builder.Configuration["AppConfig:FeatureFlagsRefreshInterval"]!)));
                    });
            });
        }

        private static void SetupHealthChecks(WebApplication app)
        {
            app.UseHealthChecks("/health/readiness",
                new HealthCheckOptions
                {
                    Predicate = app.Environment.IsDev()
                        ? _ => false
                        : healthCheck => healthCheck.Tags.Contains("ready")
                });
            app.UseHealthChecks("/health/liveness", new HealthCheckOptions { Predicate = _ => false });
        }

        private static void SetupAuthentication(WebApplicationBuilder builder, string tenantId, IEnumerable<string> azureAdb2CClientIds)
        {
            builder.Services
                .AddAuthentication(
                    options =>
                    {
                        options.DefaultScheme = OptionsDefaultScheme;
                    })
                .AddPolicyScheme(OptionsDefaultScheme, OptionsDefaultScheme,
                    options =>
                    {
                        options.ForwardDefaultSelector = context =>
                        {
                            string? authorization = context?.Request?.Headers?[HeaderNames.Authorization];
                            var token = authorization?.StartsWith("Bearer ") == true
                                ? authorization["Bearer ".Length..].Trim()
                                : null;
                            var jwtHandler = new JwtSecurityTokenHandler();
                            if (token == null || !jwtHandler.CanReadToken(token))
                            {
                                return Authorization.AzureAdB2C.Scheme;
                            }

                            var issuer = jwtHandler.ReadJwtToken(token).Issuer;
                            if (issuer.Contains(tenantId))
                            {
                                return Authorization.AzureAd.Scheme;
                            }

                            return Authorization.AzureAdB2C.Scheme;
                        };
                    })
                .AddJwtBearer(Authorization.AzureAd.Scheme, options =>
                {
                    builder.Configuration.Bind(Microsoft.Identity.Web.Constants.AzureAd, options);
                    options.Authority =
                        $"{builder.Configuration["AzureAd:Instance"]}{builder.Configuration["AzureAd:TenantId"]}";
                    options.TokenValidationParameters.ValidAudience = builder.Configuration["AzureAd:Audience"];
                })
                .AddJwtBearer(Authorization.AzureAdB2C.Scheme, options =>
                {
                    builder.Configuration.Bind(Microsoft.Identity.Web.Constants.AzureAdB2C, options);
                    options.Authority =
                        $"{builder.Configuration["AzureAdB2C:Instance"]}{builder.Configuration["AzureAdB2C:Domain"]}/{builder.Configuration["AzureAdB2C:SignUpSignInPolicyId"]}";
                    options.TokenValidationParameters.ValidIssuer =
                        $"{builder.Configuration["AzureAdB2C:Instance"]}{builder.Configuration["AzureAdB2C:Domain"]}/v2.0/";
                    options.TokenValidationParameters.ValidAudiences = azureAdb2CClientIds;
                });
        }

        private static void RegisterServices(WebApplicationBuilder builder)
        {
            builder.Services.AddHttpClient<IPersonService, PersonService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));
            builder.Services.AddHttpClient<IADB2CGraphService, ADB2CGraphService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));
            builder.Services.AddHttpClient<IMfaService, MfaService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));

            builder.Services.AddScoped<IPersonService, PersonService>();
            builder.Services.AddScoped<IADB2CGraphService, ADB2CGraphService>();
            builder.Services.AddScoped<IMfaService, MfaService>();
        }
    }
}
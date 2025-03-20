using Azure.Monitor.OpenTelemetry.AspNetCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Identity.Web;
using Motoring.Services;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using HotChocolate.AspNetCore;
using Azure.Identity;
using Motoring.API.FinOps.Interfaces;
using Motoring.API.FinOps.Services;
using Motoring.API.Vehicle.Interfaces;
using Motoring.API.Vehicle.Services;
using Motoring.Interfaces;
using Motoring.GraphQL.Types;
using Shared.Interfaces;
using Shared.Services;
using Microsoft.FeatureManagement;
using Shared.Extensions;
using FluentValidation;
using System.Reflection;

var app = Motoring.Program.CreateApp(args);
app.Run();

namespace Motoring
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

            if (builder.Environment.IsLocal() && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("CI")))
            {
                var keyVaultUri = new Uri(builder.Configuration.GetConnectionString("KeyVault")!);
                builder.Configuration.AddAzureKeyVault(keyVaultUri,
                    new DefaultAzureCredential(
                        new DefaultAzureCredentialOptions { TenantId = builder.Configuration["AppConfig:TenantId"]! }));
            }

            builder.Services.AddMicrosoftIdentityWebApiAuthentication(builder.Configuration, "AzureAdB2C");

            builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());



            AddHttpClients(builder.Services);
            AddScopedServices(builder.Services);

            builder.Services
                .AddGraphQLServer()
                .DisableIntrospection(!builder.Environment.IsLocal())
                .AddApolloFederation()
                .AddAuthorization()
                .AddType<Person>()
                .AddType<ServiceIsAlive>()
                .AddMotoringTypes()
                .AddInstrumentation();

            builder.Services
                .AddHealthChecks()
                .AddCheck<ReadinessHealthCheck>(nameof(ReadinessHealthCheck), tags: ["ready"]);

            builder.Services
                .AddOpenTelemetry()
                .UseAzureMonitor()
                .WithTracing(b =>
                {
                    b.AddHttpClientInstrumentation();
                    b.AddAspNetCoreInstrumentation();
                    b.AddHotChocolateInstrumentation();
                    b.AddSource("SubGraph");
                    b.SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(serviceName: "Motoring"));
                });

            builder.Services.AddHttpContextAccessor();

            builder.Services.AddAzureAppConfiguration();
            builder.Services.AddFeatureManagement();
            builder.Services.AddTransient<IFeatureService, FeatureService>();
            SetupAzureAppConfig(builder);

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
                        }
                    });

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

        private static void SetupAzureAppConfig(WebApplicationBuilder builder)
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
            services.AddHttpClient<IFinOpsService, FinOpsService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));

            services.AddHttpClient<IVehicleService, VehicleService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));

            services.AddHttpClient<IPersonService, PersonService>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5));
        }

        private static void AddScopedServices(IServiceCollection services)
        {
            services.AddScoped<IFinOpsService, FinOpsService>();
            services.AddScoped<IVehicleService, VehicleService>();
            services.AddScoped<IPersonService, PersonService>();
        }
    }
}
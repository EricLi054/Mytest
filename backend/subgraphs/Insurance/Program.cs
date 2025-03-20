using Azure.Monitor.OpenTelemetry.AspNetCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Identity.Web;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using HotChocolate.AspNetCore;
using Azure.Identity;
using Insurance.Services;
using Shared.Interfaces;
using Shared.Services;
using Microsoft.FeatureManagement;
using Shared.Extensions;

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

builder.Services
    .AddGraphQLServer()
    .DisableIntrospection(!builder.Environment.IsLocal())
    .AddApolloFederation()
    .AddAuthorization()
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
        b.SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(serviceName: "Insurance"));
    });

builder.Services.AddHttpContextAccessor();

builder.Services.AddAzureAppConfiguration();
builder.Services.AddFeatureManagement();
builder.Services.AddTransient<IFeatureService, FeatureService>();
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options
        .Connect(new Uri(builder.Configuration["AppConfig:Endpoint"]!), new DefaultAzureCredential(new DefaultAzureCredentialOptions
        {
            ManagedIdentityClientId = builder.Configuration["AppConfig:ClientId"]!,
            TenantId = builder.Configuration["AppConfig:TenantId"]!
        }))
        .TrimKeyPrefix("AzureAdB2C:")
        .ConfigureRefresh(refreshOptions =>
        {
            refreshOptions
                .Register(builder.Configuration["AppConfig:SentinelKey"], refreshAll: true)
                .SetRefreshInterval(TimeSpan.FromSeconds(double.Parse(builder.Configuration["AppConfig:ConfigRefreshInterval"]!)));
        })
        .UseFeatureFlags(featureFlagOptions =>
        {
            featureFlagOptions
                .SetRefreshInterval(TimeSpan.FromSeconds(double.Parse(builder.Configuration["AppConfig:FeatureFlagsRefreshInterval"]!)));
        });
});

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

app.Run();
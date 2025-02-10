using Dapr.Client;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Middleware;
using DigitalPlatform.API.Services;
using HotChocolate.AspNetCore;
using Microsoft.IdentityModel.Logging;
using DigitalPlatform.API.Extensions;
using Dapr;

var builder = WebApplication.CreateBuilder();

#region Services

// Dapr
using var daprClient = new DaprClientBuilder().Build();

// Define the Dapr stores
var SECRET_STORE_NAME = Environment.GetEnvironmentVariable("SECRET_STORE") ?? DaprComponents.KeyVault;
var CONFIG_STORE_NAME = Environment.GetEnvironmentVariable("CONFIG_STORE") ?? DaprComponents.AppConfig;

// Set up the secret and config descriptors
var secretDescriptors = StartupService.GetSecretDescriptors();
var appConfigDescriptors = StartupService.GetConfigDescriptors();

try
{
    await StartupService.Dapr.LoadDaprStores(builder, daprClient);
}
catch (DaprException daprEx)
{
    // Should the secret or config store fail for whatever reason, log the exception to the LogStream and continue running the application
    Console.WriteLine(daprEx.Message);
    Console.WriteLine(daprEx.InnerException);
}
catch (Exception ex)
{
    // Should the above DaprException fail for whatever reason, log the exception to the LogStream and exit the application
    Console.WriteLine(ex.Message);
    Console.WriteLine("Exiting application...");
    return;
}

StartupService.AddServices(builder);

#endregion

var app = builder.Build();

// for local dev purposes only
IdentityModelEventSource.ShowPII = app.Environment.IsDevelopment();
IdentityModelEventSource.LogCompleteSecurityArtifact = app.Environment.IsDevelopment();

// GraphQL batching, required for data loaders
app.MapGraphQL().WithOptions(new GraphQLServerOptions
{
    EnableBatching = true
});

app.UseMiddleware<CustomAuthMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseContainerHealthChecks();

app.Run();

[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
public partial class Program { }
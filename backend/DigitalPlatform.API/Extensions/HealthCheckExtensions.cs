using DigitalPlatform.API.Descriptors;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace DigitalPlatform.API.Extensions;
public static class HealthCheckExtensions
{
    public static IServiceCollection AddContainerHealthChecks(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHealthChecks()
            .AddCheck("Liveness", () => HealthCheckResult.Healthy("The app is alive"), tags: ["liveness"])
            .AddCheck("Readiness", () => ReadinessCheck(configuration), tags: ["readiness"])
            .AddCheck("Startup", () => HealthCheckResult.Healthy("The app has started"), tags: ["startup"]);

        static HealthCheckResult ReadinessCheck(IConfiguration configuration)
        {
            //TODO:complete readiness check
            var isContentfulConfigured = configuration[SecretDescriptors.CONTENTFUL_SPACE_ID] != null
                                            && configuration[SecretDescriptors.CONTENTFUL_ACCESS_TOKEN] != null;

            if(!isContentfulConfigured)
            {
                return HealthCheckResult.Unhealthy("Contentful configuration is missing");
            }
            return HealthCheckResult.Healthy("Ready to serve requests");
        }

        return services;
    }

    public static IEndpointRouteBuilder UseContainerHealthChecks(this IEndpointRouteBuilder app)
    {
        var liveOptions = new HealthCheckOptions { Predicate = check => check.Tags.Contains("liveness") };
        var readyOptions = new HealthCheckOptions { Predicate = check => check.Tags.Contains("readiness") };
        var startupOptions = new HealthCheckOptions { Predicate = check => check.Tags.Contains("startup") };

        app.MapHealthChecks("/healthz/liveness", liveOptions);
        app.MapHealthChecks("/healthz/readiness", readyOptions);
        app.MapHealthChecks("/healthz/startup", startupOptions);

        return app;
    }
}
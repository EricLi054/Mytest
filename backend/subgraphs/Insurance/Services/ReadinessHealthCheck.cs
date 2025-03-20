using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Insurance.Services;

public class ReadinessHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
    {
        // TODO: Check if all relevant services are up and running (e.g. Shield health check)
        return Task.FromResult(HealthCheckResult.Healthy("Up and running"));
    }
}
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Membership.Services;

public class ReadinessHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
    {
        // TODO: Complete any relevant health checks on start up
        return Task.FromResult(HealthCheckResult.Healthy("Up and running"));
    }
}
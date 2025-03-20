using Microsoft.Extensions.Diagnostics.HealthChecks;
using Motoring.API.Vehicle.Interfaces;

namespace Motoring.Services;

public class ReadinessHealthCheck(ILogger<ReadinessHealthCheck> logger, IVehicleService vehicleService) : IHealthCheck
{
    private readonly ILogger<ReadinessHealthCheck> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    private readonly IVehicleService _vehicleService = vehicleService ?? throw new ArgumentNullException(nameof(vehicleService));

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new())
    {
        var isVehicleServiceHealthy = await _vehicleService.GetHealthStatusAsync(cancellationToken);

        if (isVehicleServiceHealthy)
        {
            const string healthyMessage = "All required services are available.";
            _logger.LogInformation("Health check result: {Message}", healthyMessage);
            return HealthCheckResult.Healthy(healthyMessage);
        }

        const string unHealthyMessage = "Required services are not available.";
        _logger.LogWarning("Health check result: {Message}", unHealthyMessage);
        return HealthCheckResult.Unhealthy(unHealthyMessage);
    }
}
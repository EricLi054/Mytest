using Microsoft.Extensions.Diagnostics.HealthChecks;
using Person.API.MFA.Interfaces;
using Person.API.Person.Interfaces;

namespace Person.Services;

public class ReadinessHealthCheck(ILogger<ReadinessHealthCheck> logger, IPersonService personService, IMfaService mfaService) : IHealthCheck
{
    private readonly ILogger<ReadinessHealthCheck> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    private readonly IPersonService _personService = personService ?? throw new ArgumentNullException(nameof(personService));
    private readonly IMfaService _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new())
    {
        var isPersonServiceHealthy = await _personService.GetHealthStatusAsync(cancellationToken);
        var personHealthStatus = GetHealthStatus("Person", isPersonServiceHealthy);

        var isMfaServiceHealthy = await _mfaService.GetHealthStatusAsync(cancellationToken);
        var mfaHealthStatus = GetHealthStatus("MFA", isMfaServiceHealthy);

        var healthStatuses = string.Join(" ", personHealthStatus, mfaHealthStatus);

        if (isPersonServiceHealthy && isMfaServiceHealthy)
        {
            var healthyMessage = $"All required services are available: {healthStatuses}";
            _logger.LogInformation("{Message}", healthyMessage);
            return HealthCheckResult.Healthy(healthyMessage);
        }

        var unhealthyMessage = $"Required services are not available: {healthStatuses}";
        _logger.LogInformation("{Message}", unhealthyMessage);
        return HealthCheckResult.Unhealthy(unhealthyMessage);

        string GetHealthStatus(string name, bool isAlive) => $"[{name}: {(isAlive ? "Healthy" : "Unhealthy")}]";
    }
}
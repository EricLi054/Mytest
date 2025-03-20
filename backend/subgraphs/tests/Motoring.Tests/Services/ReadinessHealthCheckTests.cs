using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using Moq;
using Motoring.API.Vehicle.Interfaces;
using Motoring.Services;
using Shared.Tests.Helpers;

namespace Motoring.Tests.Services;

[TestFixture]
public class ReadinessHealthCheckTests
{
    private Mock<ILogger<ReadinessHealthCheck>> _loggerMock;
    private Mock<IVehicleService> _vehicleServiceMock;
    private ReadinessHealthCheck _readinessHealthCheck;

    [SetUp]
    public void SetUp()
    {
        _loggerMock = new Mock<ILogger<ReadinessHealthCheck>>();
        _vehicleServiceMock = new Mock<IVehicleService>();
        _readinessHealthCheck = new ReadinessHealthCheck(_loggerMock.Object, _vehicleServiceMock.Object);
    }

    [Test]
    public async Task CheckHealthAsync_WithHealthyService_ShouldReturnHealthy()
    {
        // Arrange
        _vehicleServiceMock.Setup(service => service.GetHealthStatusAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _readinessHealthCheck.CheckHealthAsync(new HealthCheckContext());

        // Assert
        Assert.That(result.Status, Is.EqualTo(HealthStatus.Healthy));
        Assert.That(result.Description, Is.EqualTo("All required services are available."));
        _loggerMock.VerifyLog(LogLevel.Information, "Health check result: All required services are available.", Times.Once);
    }

    [Test]
    public async Task CheckHealthAsync_WithUnhealthyService_ShouldReturnUnhealthy()
    {
        // Arrange
        _vehicleServiceMock.Setup(service => service.GetHealthStatusAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _readinessHealthCheck.CheckHealthAsync(new HealthCheckContext());

        // Assert
        Assert.That(result.Status, Is.EqualTo(HealthStatus.Unhealthy));
        Assert.That(result.Description, Is.EqualTo("Required services are not available."));
        _loggerMock.VerifyLog(LogLevel.Warning, "Health check result: Required services are not available.", Times.Once);
    }
}
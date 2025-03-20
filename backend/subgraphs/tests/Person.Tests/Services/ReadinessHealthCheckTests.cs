using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using Moq;
using Person.API.MFA.Interfaces;
using Person.API.Person.Interfaces;
using Person.Services;

namespace Person.Tests.Services;

public class ReadinessHealthCheckTests
{
    private Mock<ILogger<ReadinessHealthCheck>> _loggerMock = null!;
    private Mock<IPersonService> _personServiceMock = null!;
    private Mock<IMfaService> _mfaServiceMock = null!;
    private ReadinessHealthCheck _serviceUnderTest = null!;

    [SetUp]
    public void SetUp()
    {
        _personServiceMock = new Mock<IPersonService>();
        _mfaServiceMock = new Mock<IMfaService>();
        _loggerMock = new Mock<ILogger<ReadinessHealthCheck>>();

        _serviceUnderTest = new ReadinessHealthCheck(_loggerMock.Object, _personServiceMock.Object, _mfaServiceMock.Object);
    }

    [Test]
    public async Task CheckHealthAsync_WithHealthyServices_ShouldReturnHealthy()
    {
        const bool expectedPersonResponse = true;
        const bool expectedMfaResponse = true;
        _personServiceMock.Setup(m => m.GetHealthStatusAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedPersonResponse);
        _mfaServiceMock.Setup(m => m.GetHealthStatusAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedMfaResponse);
        var result = await _serviceUnderTest.CheckHealthAsync(new HealthCheckContext());

        Assert.Multiple(() =>
        {
            Assert.That(result.Status, 
                Is.EqualTo(Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Healthy));
            Assert.That(result.Description, 
                Is.EqualTo("All required services are available: [Person: Healthy] [MFA: Healthy]"));
        });
    }

    [Test]
    public async Task CheckHealthAsync_WithUnhealthyPersonService_ShouldReturnUnhealthy()
    {
        const bool expectedPersonResponse = false;
        const bool expectedMfaResponse = true;
        _personServiceMock.Setup(m => m.GetHealthStatusAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedPersonResponse);
        _mfaServiceMock.Setup(m => m.GetHealthStatusAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedMfaResponse);
        var result = await _serviceUnderTest.CheckHealthAsync(new HealthCheckContext());

        Assert.Multiple(() =>
        {
            Assert.That(result.Status,
                Is.EqualTo(Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Unhealthy));
            Assert.That(result.Description,
                Is.EqualTo("Required services are not available: [Person: Unhealthy] [MFA: Healthy]"));
        });
    }

    [Test]
    public async Task CheckHealthAsync_WithUnhealthyMfaService_ShouldReturnUnhealthy()
    {
        const bool expectedPersonResponse = true;
        const bool expectedMfaResponse = false;
        _personServiceMock.Setup(m => m.GetHealthStatusAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedPersonResponse);
        _mfaServiceMock.Setup(m => m.GetHealthStatusAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedMfaResponse);
        var result = await _serviceUnderTest.CheckHealthAsync(new HealthCheckContext());

        Assert.Multiple(() =>
        {
            Assert.That(result.Status, 
                Is.EqualTo(Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Unhealthy));
            Assert.That(result.Description, 
                Is.EqualTo("Required services are not available: [Person: Healthy] [MFA: Unhealthy]"));
        });
    }
}
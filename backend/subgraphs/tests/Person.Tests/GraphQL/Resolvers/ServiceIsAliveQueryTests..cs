using Moq;
using Person.API.MFA.Interfaces;
using Person.API.Person.Interfaces;
using Person.GraphQL.Resolvers;
using Person.GraphQL.Types;

namespace Person.Tests.GraphQL.Resolvers;

[TestFixture]
public class ServiceIsAliveQueryTests
{
    private Mock<IPersonService> _personServiceMock = null!;
    private Mock<IMfaService> _mfaServiceMock = null!;
    private ServiceIsAliveQuery _serviceIsAliveQuery = null!;

    [SetUp]
    public void SetUp()
    {
        _personServiceMock = new Mock<IPersonService>();
        _mfaServiceMock = new Mock<IMfaService>();
        _serviceIsAliveQuery = new ServiceIsAliveQuery();
    }

    [Test]
    public void GetServiceIsAlive_ShouldReturnServiceIsAlive()
    {
        // Act
        var result = _serviceIsAliveQuery.GetServiceIsAlive();

        // Assert
        Assert.That(result, Is.Not.Null);
    }

    [Test]
    public async Task GetPersonServiceAsync_ShouldReturnTrue_WhenPersonServiceIsHealthy()
    {
        // Arrange
        _personServiceMock.Setup(ps => ps.GetHealthStatusAsync(It.IsAny<CancellationToken>())).ReturnsAsync(true);
        var serviceIsAlive = new ServiceIsAlive();

        // Act
        var result = await serviceIsAlive.GetPersonServiceAsync(_personServiceMock.Object);

        // Assert
        Assert.That(result, Is.True);
    }

    [Test]
    public async Task GetPersonServiceAsync_ShouldReturnFalse_WhenPersonServiceIsUnhealthy()
    {
        // Arrange
        _personServiceMock.Setup(ps => ps.GetHealthStatusAsync(It.IsAny<CancellationToken>())).ReturnsAsync(false);
        var serviceIsAlive = new ServiceIsAlive();

        // Act
        var result = await serviceIsAlive.GetPersonServiceAsync(_personServiceMock.Object);

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public async Task GetMfaServiceAsync_ShouldReturnTrue_WhenMfaServiceIsHealthy()
    {
        // Arrange
        _mfaServiceMock.Setup(ms => ms.GetHealthStatusAsync(It.IsAny<CancellationToken>())).ReturnsAsync(true);
        var serviceIsAlive = new ServiceIsAlive();

        // Act
        var result = await serviceIsAlive.GetMfaServiceAsync(_mfaServiceMock.Object);

        // Assert
        Assert.That(result, Is.True);
    }

    [Test]
    public async Task GetMfaServiceAsync_ShouldReturnFalse_WhenMfaServiceIsUnhealthy()
    {
        // Arrange
        _mfaServiceMock.Setup(ms => ms.GetHealthStatusAsync(It.IsAny<CancellationToken>())).ReturnsAsync(false);
        var serviceIsAlive = new ServiceIsAlive();

        // Act
        var result = await serviceIsAlive.GetMfaServiceAsync(_mfaServiceMock.Object);

        // Assert
        Assert.That(result, Is.False);
    }
}
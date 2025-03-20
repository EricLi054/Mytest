using Microsoft.Extensions.Logging;
using Moq;
using Shared.Util;
using System.Security.Claims;

namespace Shared.Tests.Util;

public class ClaimsHelperTests
{
    private Mock<ILogger> _mockLogger = null!;

    [SetUp]
    public void SetUp()
    {
        _mockLogger = new Mock<ILogger>();
    }

    [Test]
    public void GetCrmIdFromClaims_ShouldReturnCrmId_WhenPresentInClaims()
    {
        var claims = new[] { new Claim("extension_crmId", "CRM12345") };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));

        var result = ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _mockLogger.Object);

        Assert.That(result, Is.EqualTo("CRM12345"));
    }

    [Test]
    public void GetCrmIdFromClaims_ShouldLogWarningAndThrow_WhenCrmIdIsMissing()
    {
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

        var ex = Assert.Throws<UnauthorizedAccessException>(() =>
            ClaimsHelper.GetCrmIdFromClaims(claimsPrincipal, _mockLogger.Object));

        Assert.That(ex!.Message, Is.EqualTo("No CRM ID found in claims."));

        _mockLogger.Verify(
            logger => logger.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true),
                null, // Exception
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Test]
    public void GetLoginEmailFromClaims_ShouldReturnLoginEmail_WhenPresentInClaims()
    {
        var claims = new[] { new Claim("name", "user@test.com") };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));

        var result = ClaimsHelper.GetLoginEmailFromClaims(claimsPrincipal, _mockLogger.Object);

        Assert.That(result, Is.EqualTo("user@test.com"));
    }

    [Test]
    public void GetLoginEmailFromClaims_ShouldLogWarningAndThrow_WhenLoginEmailIsMissing()
    {
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

        var ex = Assert.Throws<UnauthorizedAccessException>(() =>
            ClaimsHelper.GetLoginEmailFromClaims(claimsPrincipal, _mockLogger.Object));

        Assert.That(ex!.Message, Is.EqualTo("No Login Email found in claims."));

        _mockLogger.Verify(
            logger => logger.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true),
                null, // Exception
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
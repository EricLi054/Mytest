using Microsoft.Extensions.Logging;
using Moq;
using Person.API.ADB2C.Interfaces;
using Person.API.Person.Interfaces;
using Person.GraphQL.Resolvers;
using Person.GraphQL.Types.ADB2CGraph;
using System.Security.Claims;

namespace Person.Tests.GraphQL.Resolvers;

[TestFixture]
public class QueryTests
{
    private Mock<IPersonService> _personServiceMock = null!;
    private Mock<IADB2CGraphService> _adb2cGraphServiceMock = null!;
    private Mock<ILogger<Query>> _loggerMock = null!;
    private Mock<ClaimsPrincipal> _claimsPrincipalMock;
    private Query _query = null!;

    [SetUp]
    public void SetUp()
    {
        _personServiceMock = new Mock<IPersonService>();
        _adb2cGraphServiceMock = new Mock<IADB2CGraphService>();
        _claimsPrincipalMock = new Mock<ClaimsPrincipal>();
        _loggerMock = new Mock<ILogger<Query>>();
        _query = new Query(_loggerMock.Object);
    }

    [Test]
    public async Task GetMe_ShouldReturnPerson_WhenSuccessful()
    {
        // Arrange
        const string crmId = "crm123";

        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(
        [
        new Claim("extension_crmId", crmId)
        ]));

        var expectedPerson = new Person.GraphQL.Types.Person
        {
            PersonId = "person123",
            RacId = "rac123",
            FirstName = "John"
        };

        _personServiceMock.Setup(ps => ps.GetPersonAsync(crmId)).ReturnsAsync(expectedPerson);

        // Act
        var result = await _query.GetMe(_personServiceMock.Object, claimsPrincipal);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.PersonId, Is.EqualTo(expectedPerson.PersonId));
            Assert.That(result.RacId, Is.EqualTo(expectedPerson.RacId));
            Assert.That(result.FirstName, Is.EqualTo(expectedPerson.FirstName));
        });
    }

    [Test]
    public void GetMe_ShouldThrowUnauthorizedAccessException_WhenClaimsPrincipalDoesNotContainCrmId()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
            await _query.GetMe(_personServiceMock.Object, claimsPrincipal));
    }

    [Test]
    public async Task GetADB2CUserAccount_ShouldReturnUserAccount_WhenEmailIsFound()
    {
        // Arrange
        var email = "test@example.com";
        var userAccount = new ADB2CUserAccount();
        _adb2cGraphServiceMock.Setup(gs => gs.GetUserByEmailAsync(email)).ReturnsAsync(userAccount);
        _claimsPrincipalMock.Setup(cp => cp.FindFirst("name")).Returns(new Claim("name", email));
        // Act
        var result = await _query.GetADB2CUserAccount(_adb2cGraphServiceMock.Object, _claimsPrincipalMock.Object, _loggerMock.Object);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(userAccount));
    }

    /// <summary>
    /// Tests that the GetADB2CUserAccount method returns null when the email is not found in the claims principal.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation.</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown when the email claim is not found.</exception>
    [Test]
    public async Task GetADB2CUserAccount_ShouldThrowUnauthorizedAccessException_WhenEmailIsNotFound()
    {
        // Arrange
        _claimsPrincipalMock.Setup(cp => cp.FindFirst("email")).Returns((Claim?)null);

        // Act & Assert
        await Task.Run(() =>
            Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
                await _query.GetADB2CUserAccount(_adb2cGraphServiceMock.Object, _claimsPrincipalMock.Object, _loggerMock.Object)));
    }
}
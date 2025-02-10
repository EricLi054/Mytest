using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.ADB2CGraph;
using DigitalPlatform.API.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute.ExceptionExtensions;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class ADB2CGraphServiceTests
{
    private readonly IDaprService _daprService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ADB2CGraphService> _logger;
    private readonly ADB2CGraphService _adb2cGraphService;

    public ADB2CGraphServiceTests()
    {
        _daprService = Substitute.For<IDaprService>();
        _configuration = Substitute.For<IConfiguration>();
        _logger = Substitute.For<ILogger<ADB2CGraphService>>();
        _adb2cGraphService = new ADB2CGraphService(_daprService, _configuration, _logger);
    }

    [Test]
    public async Task GetUserByEmail_ValidLinkedUser_ReturnsADB2CAccount()
    {
        // Arrange
        _configuration[ConfigDescriptors.ADB2C_GRAPH_GET_BY_EMAIL_URL].Returns("api/getByEmail");
        _configuration[ConfigDescriptors.API_BASE_URL].Returns("https://example.com");

        var account = new ADB2CAccount
        {
            Id = new Guid(),
            AccountEnabled = true,
            DisplayName = "valid-email",
            CrmId = new Guid()
        };

        _daprService.InvokeDaprPostMethodAsync<ADB2CAccount[], ADB2CRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<ADB2CRequest>())
            .Returns(Task.FromResult<ADB2CAccount[]>([account]));

        // Act
        var result = await _adb2cGraphService.GetUserByEmail("valid-email");

        // Assert
        Assert.That(result, Is.EqualTo(account));
    }

    [Test]
    public async Task GetUserByEmail_ValidUnlinkedUser_ReturnsADB2CAccount()
    {
        // Arrange
        _configuration[ConfigDescriptors.ADB2C_GRAPH_GET_BY_EMAIL_URL].Returns("api/getByEmail");
        _configuration[ConfigDescriptors.API_BASE_URL].Returns("https://example.com");

        var account = new ADB2CAccount
        {
            Id = new Guid(),
            AccountEnabled = true,
            DisplayName = "valid-email",
            CrmId = null
        };

        _daprService.InvokeDaprPostMethodAsync<ADB2CAccount[], ADB2CRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<ADB2CRequest>())
            .Returns(Task.FromResult<ADB2CAccount[]>([account]));

        // Act
        var result = await _adb2cGraphService.GetUserByEmail("valid-email");

        // Assert
        Assert.That(result, Is.EqualTo(account));
    }

    [Test]
    public void GetUserByEmail_ValidUser_ThrowsException()
    {
        // Arrange
        HttpRequestException httpRequestException = new("Simulated HTTP error");

        _daprService.InvokeDaprPostMethodAsync<ADB2CAccount[], ADB2CRequest>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<ADB2CRequest>())
            .Throws(httpRequestException);

        // Act
        Assert.ThrowsAsync<HttpRequestException>(async () => await _adb2cGraphService.GetUserByEmail("valid-email"));

        // Assert
        _logger.Received().LogError(httpRequestException, httpRequestException.Message);
    }
}
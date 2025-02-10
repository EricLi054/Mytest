using System.Text.Json;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class FeatureServiceTests {
    private readonly IConfiguration _configuration;
    private readonly ILogger<FeatureService> _logger;

    public FeatureServiceTests()
    {
        _configuration = Substitute.For<IConfiguration>();
        _logger = Substitute.For<ILogger<FeatureService>>();
    }

    [Test]
    public void GetFeatures_ValidConfiguration_ReturnsFeatureList()
    {
        // Arrange
        _configuration[ConfigDescriptors.FEATURE_TOGGLES].Returns(JsonSerializer.Serialize(new List<FeatureToggle> {
            new() { Key = "TestFlag", Description="TestFlag", Enabled = true }
        }));
        
        var featureService = new FeatureService(_configuration, _logger);

        var expected = new Dictionary<string, bool> {
            { "TestFlag", true },
        };

        // Act
        var result = featureService.GetFeatures();

        // Assert
        Assert.That(result, Is.EqualTo(expected));
    }

    [Test]
    public void GetFeatures_InvalidConfiguration_ReturnsEmptyFeatureList()
    {
        // Arrange
        _configuration[ConfigDescriptors.FEATURE_TOGGLES].Returns(JsonSerializer.Serialize(new List<string> {
            "TestFlag"
        }));
        
        var featureService = new FeatureService(_configuration, _logger);

        var expected = new Dictionary<string, bool>();

        // Act
        var result = featureService.GetFeatures();

        // Assert
        Assert.That(result, Is.EqualTo(expected));
    }

    [Test]
    public void IsFeatureValid_ValidConfigurationExists_ReturnsIfFeatureIsEnabled()
    {
        // Arrange
        _configuration[ConfigDescriptors.FEATURE_TOGGLES].Returns(JsonSerializer.Serialize(new List<FeatureToggle> {
            new() { Key = "TestFlag", Enabled = true }
        }));
        
        var featureService = new FeatureService(_configuration, _logger);

        // Act
        var result = featureService.IsFeatureEnabled("TestFlag");

        // Assert
        Assert.That(result, Is.EqualTo(true));
    }
        
    [Test]
    public void IsFeatureValid_ValidConfigurationDoesntExist_ReturnsDefaultFalse()
    {
        // Arrange
        _configuration[ConfigDescriptors.FEATURE_TOGGLES].Returns(JsonSerializer.Serialize(new List<FeatureToggle> {
            new() { Key = "TestFlag", Enabled = true }
        }));
        
        var featureService = new FeatureService(_configuration, _logger);

        // Act
        var result = featureService.IsFeatureEnabled("FlagNotInConfig");

        // Assert
        Assert.That(result, Is.EqualTo(false));
    }
}
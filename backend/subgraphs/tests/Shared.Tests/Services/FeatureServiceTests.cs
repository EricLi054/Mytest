using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.FeatureManagement;
using Moq;
using Shared.Services;
using Shouldly;

namespace Shared.Tests.Services;

[TestFixture]
public class FeatureServiceTests
{
    private Mock<IFeatureManagerSnapshot> _mockFeatureManagerSnapshot;
    private Mock<IConfigurationRefresher> _mockConfigurationRefresher;
    private FeatureService _sut;
    private readonly string FeatureName = "MyFeature";
    private readonly string ApplicationName = "MyApplication";

    [SetUp]
    public void SetUp()
    {
        _mockFeatureManagerSnapshot = new Mock<IFeatureManagerSnapshot>();
        _mockConfigurationRefresher  = new Mock<IConfigurationRefresher>();
        var _mockRefresherProvider = new Mock<IConfigurationRefresherProvider>();

        _mockRefresherProvider
                    .Setup(m => m.Refreshers)
                    .Returns(new List<IConfigurationRefresher> { _mockConfigurationRefresher.Object });

        _sut = new FeatureService(_mockFeatureManagerSnapshot.Object, _mockRefresherProvider.Object);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task IsFeatureEnabledAsync_WhenFeatureProvidedAndFeatureFlagExists_ShouldReturnEnabledState(bool isEnabled)
    {
        _mockFeatureManagerSnapshot
            .Setup(s => s.IsEnabledAsync(FeatureName))
            .ReturnsAsync(isEnabled);

        var result = await _sut.IsFeatureEnabledAsync(FeatureName);

        result.ShouldBe(isEnabled);
    }

    [Test]
    public async Task IsFeatureEnabledAsync_WhenFeatureProvidedAndFeatureFlagDoesNotExist_ShouldReturnFalse()
    {
        var result = await _sut.IsFeatureEnabledAsync(FeatureName);

        result.ShouldBeFalse();
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task IsFeatureEnabledAsync_WhenFeatureAndApplicationNameProvidedAndFeatureFlagExists_ShouldReturnEnabledState(bool isEnabled)
    {
        _mockFeatureManagerSnapshot
            .Setup(s => s.IsEnabledAsync($"{ApplicationName}_{FeatureName}"))
            .ReturnsAsync(isEnabled);

        var result = await _sut.IsFeatureEnabledAsync(FeatureName, ApplicationName);

        result.ShouldBe(isEnabled);
    }

    [Test]
    public async Task IsFeatureEnabledAsync_WhenFeatureAndApplicationNameProvidedAndFeatureFlagDoesNotExist_ShouldReturnFalse()
    {
        var result = await _sut.IsFeatureEnabledAsync(FeatureName, ApplicationName);

        result.ShouldBeFalse();
    }

    [Test]
    public async Task GetFeatureFlagsAsync_WhenApplicationNameProvidedAndFeatureFlagsExist_ShouldReturnFeatureFlags()
    {
        var expectedFeatures = new Dictionary<string, bool>()
        {
            { "MyFeature", false },
            { $"{ApplicationName}MyFeature_1", true },
            { "MyFeature_1", false },
            { $"{ApplicationName}_{FeatureName}", true },
            { $"_{ApplicationName}_MyFeature_2", false },
            { $"{ApplicationName}_{FeatureName}_2", false },
        };

        _mockFeatureManagerSnapshot
            .Setup(s => s.GetFeatureNamesAsync())
            .Returns(expectedFeatures.Keys.ToAsyncEnumerable());

        foreach (var expectedFeature in expectedFeatures)
        {
            _mockFeatureManagerSnapshot
                .Setup(s => s.IsEnabledAsync(expectedFeature.Key))
                .ReturnsAsync(expectedFeature.Value);
        }

        var result = await _sut.GetFeatureFlagsAsync(ApplicationName);

        result.Count.ShouldBe(2);
        result.Where(x => x.Key == FeatureName).First().Value.ShouldBeTrue();
        result.Where(x => x.Key == $"{FeatureName}_2").First().Value.ShouldBeFalse();
    }

    [Test]
    public async Task GetFeatureFlagsAsync_WhenApplicationNameProvidedAndFeatureFlagsDoNotExist_ShouldReturnFalseFlags()
    {
        var expectedFeatures = new Dictionary<string, bool>()
        {
            { "MyFeature", false },
            { $"{ApplicationName}MyFeature_1", true },
            { "MyFeature_1", false },
            { $"{ApplicationName}_{FeatureName}", true },
            { $"_{ApplicationName}_MyFeature_2", false },
            { $"{ApplicationName}_{FeatureName}_2", false },
        };

        _mockFeatureManagerSnapshot
            .Setup(s => s.GetFeatureNamesAsync())
            .Returns(expectedFeatures.Keys.ToAsyncEnumerable());

        var result = await _sut.GetFeatureFlagsAsync(ApplicationName);

        result.Count.ShouldBe(2);
        result.Where(x => x.Key == FeatureName).First().Value.ShouldBeFalse();
        result.Where(x => x.Key == $"{FeatureName}_2").First().Value.ShouldBeFalse();
    }

    [Test]
    public async Task GetFeatureFlagsAsync_WhenNoApplicationNameProvidedAndFeatureFlagsExist_ShouldReturnFeatureFlags()
    {
        var expectedFeatures = new Dictionary<string, bool>()
        {
            { "MyFeature", false },
            { $"{ApplicationName}MyFeature_1", true },
            { "MyFeature_1", false },
            { $"{ApplicationName}_{FeatureName}", true },
            { $"_{ApplicationName}_MyFeature_2", false },
            { $"{ApplicationName}_{FeatureName}_2", false },
        };

        _mockFeatureManagerSnapshot
            .Setup(s => s.GetFeatureNamesAsync())
            .Returns(expectedFeatures.Keys.ToAsyncEnumerable());

        foreach (var expectedFeature in expectedFeatures)
        {
            _mockFeatureManagerSnapshot
                .Setup(s => s.IsEnabledAsync(expectedFeature.Key))
                .ReturnsAsync(expectedFeature.Value);
        }

        var result = await _sut.GetFeatureFlagsAsync();

        result.Count.ShouldBe(6);
        result.Where(x => x.Key == "MyFeature").First().Value.ShouldBeFalse();
        result.Where(x => x.Key == $"{ApplicationName}MyFeature_1").First().Value.ShouldBeTrue();
        result.Where(x => x.Key == "MyFeature_1").First().Value.ShouldBeFalse();
        result.Where(x => x.Key == $"{ApplicationName}_{FeatureName}").First().Value.ShouldBeTrue();
        result.Where(x => x.Key == $"_{ApplicationName}_MyFeature_2").First().Value.ShouldBeFalse();
        result.Where(x => x.Key == $"{ApplicationName}_{FeatureName}_2").First().Value.ShouldBeFalse();
    }

    [Test]
    public async Task GetFeatureFlagsAsync_WhenNoApplicationNameProvidedAndFeatureFlagsDoNotExist_ShouldReturnEmptyDictionary()
    {
        var result = await _sut.GetFeatureFlagsAsync();
        result.Count.ShouldBe(0);
    }
}

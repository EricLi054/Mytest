using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.FeatureManagement;
using Shared.Interfaces;

namespace Shared.Services;
public class FeatureService : IFeatureService
{
    private readonly IFeatureManagerSnapshot _featureManager;
    private readonly IConfigurationRefresher _configurationRefresher;

    public FeatureService(IFeatureManagerSnapshot featureManager, IConfigurationRefresherProvider refresherProvider)
    {
        _featureManager = featureManager ?? throw new ArgumentNullException(nameof(featureManager));
        _configurationRefresher = refresherProvider.Refreshers.First();
    }

    public async Task<bool> IsFeatureEnabledAsync(string feature, string? applicationName = null)
    {
        await _configurationRefresher.TryRefreshAsync();

        return string.IsNullOrEmpty(applicationName)
            ? (await GetFeatureEnabledAsync(feature)).Value
            : (await GetFeatureEnabledAsync($"{applicationName}_{feature}")).Value;
    }

    public async Task<Dictionary<string, bool>> GetFeatureFlagsAsync(string? applicationName = null)
    {
        await _configurationRefresher.TryRefreshAsync();

        var featureFlags = await GetFeatureFlagsNamesForApplicationAsync(applicationName);
        
        if (featureFlags.Count == 0)
        {
            return new Dictionary<string, bool>();
        }

        var getFeatureFlagTasks = featureFlags.Select(GetFeatureEnabledAsync).ToList();

        await Task.WhenAll(getFeatureFlagTasks);

        var features = getFeatureFlagTasks
            .Select(s => s.GetAwaiter().GetResult())
            .ToDictionary(x => string.IsNullOrEmpty(applicationName) ? x.Key : x.Key.Replace($"{applicationName}_", ""), x => x.Value);

        return features;
    }

    private async Task<List<string>> GetFeatureFlagsNamesForApplicationAsync(string? applicationName)
    {
        var featureNames = _featureManager.GetFeatureNamesAsync();
        var appFeatureNames = new List<string>();

        if (featureNames == null)
        {
            return appFeatureNames;
        }

        if (string.IsNullOrEmpty(applicationName))
        {
            await foreach (var featureName in featureNames)
            {
                appFeatureNames.Add(featureName);
            }
        } 
        else
        {
            await foreach (var featureName in featureNames)
            {
                if (featureName.StartsWith($"{applicationName}_", StringComparison.InvariantCultureIgnoreCase))
                {
                    appFeatureNames.Add(featureName);
                }
            }
        }

        return appFeatureNames;
    }

    private async Task<KeyValuePair<string, bool>> GetFeatureEnabledAsync(string feature)
    {
        var isEnabled = await _featureManager.IsEnabledAsync(feature);
        return new KeyValuePair<string, bool>(feature, isEnabled);
    }
}

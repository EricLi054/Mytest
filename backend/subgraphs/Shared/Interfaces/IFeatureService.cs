namespace Shared.Interfaces;

public interface IFeatureService
{
    /// <summary>
    /// Determine whether the named feature is enabled
    /// </summary>
    /// <remarks>
    /// If an application name is provided, it will search for a feature flag in the form "{applicationName}_{feature}"
    /// </remarks>
    Task<bool> IsFeatureEnabledAsync(string feature, string? applicationName = null);

    /// <summary>
    /// Retrieves all feature flags for a given application.
    /// </summary>
    /// <remarks>
    /// If an application name is provided, the expected feature flags will be in the form "{applicationName}_MyFeatureName".
    /// The returned dictionary will have the "applicationName" trimmed from the beginning of the key (e.g., "{applicationName}_MyFeature" becomes "MyFeatureName").
    ///
    /// If no application name is provided, then all feature flags will be returned.
    /// The returned dictionary will have feature flags for multiple applications (e.g., "Subgraph-Motoring_FeatureName", "Subgraph-Person_FeatureName").
    /// </remarks>
    /// <param name="applicationName">The application name (e.g., Subgraph-Motoring).</param>
    /// <returns>Dictionary of feature flags and their state for the provided application.</returns>
    Task<Dictionary<string, bool>> GetFeatureFlagsAsync(string? applicationName = null);
}

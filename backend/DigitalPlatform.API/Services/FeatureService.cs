using System.Text.Json;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;

namespace DigitalPlatform.API.Services;

public class FeatureToggle 
{
    public string Key { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Enabled { get; set; }
}

public class FeatureService : IFeatureService
{
    private readonly Dictionary<string, bool> _features = [];
    
    public FeatureService(
        IConfiguration configuration,
        ILogger<FeatureService> logger) 
    {            
        try 
        {
            var deserialisedFeatures = JsonSerializer.Deserialize<List<FeatureToggle>>(configuration[ConfigDescriptors.FEATURE_TOGGLES]!);
            
            if(deserialisedFeatures != null) 
            {
                _features = deserialisedFeatures.ToDictionary(x => x.Key, x => x.Enabled);
            }
        } 
        catch(Exception) 
        {
            logger.LogError("Unable to fetch feature toggles.");
        }
    }
    
    public bool IsFeatureEnabled(string feature)
    {
        if(_features.TryGetValue(feature, out bool enabled))
        {
            return enabled;
        }

        return false;
    }

    public Dictionary<string, bool> GetFeatures()
    {
        return _features;
    }
}
namespace DigitalPlatform.API.Interfaces;

public interface IFeatureService
{
    bool IsFeatureEnabled(string feature);
    Dictionary<string, bool> GetFeatures();
}

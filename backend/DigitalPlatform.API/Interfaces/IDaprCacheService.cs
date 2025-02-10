namespace DigitalPlatform.API.Interfaces;

public interface IDaprCacheService
{
    Task<T?> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, int? slidingExpiration = null, int? absoluteExpiration = null) where T : class, new();

    Task SetAsync<T>(string key, T value, int? slidingExpiration = null, int? absoluteExpiration = null) where T : class, new();
}
using Dapr;
using Dapr.Client;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Helpers;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Services;

namespace DigitalPlatform.API.Services;
//distributed caching using dapr
public partial class DaprCacheService(DaprClient daprClient, IConfiguration config, ILogger<DaprCacheService> logger) : IDaprCacheService
{
    private readonly string StateStoreName = DaprComponents.StateStore;
    private readonly int defaultSlidingExpiration = CacheEntryHelper.GetSlidingExpiration(config);
    private readonly int defaultAbsoluteExpiration = CacheEntryHelper.GetAbsoluteExpirationSeconds(config);

    public async Task<T?> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, int? slidingExpiration = null, int? absoluteExpiration = null) where T : class, new()
    {
        T value;
        try
        {
            logger.LogDebug("Attempting to fetch key: {key} from state store...", key);
            var cacheItem = await daprClient.GetStateEntryAsync<DaprCacheItem<T>>(StateStoreName, key);
            //sliding expiration check
            if (cacheItem?.Value != null && !IsExpired(cacheItem.Value, slidingExpiration))
            {
                await ResetSlidingExpiration(key, cacheItem);
                return cacheItem?.Value.Content;
            }
            if (cacheItem?.Value != null && IsExpired(cacheItem.Value, slidingExpiration))
            {
                logger.LogDebug("Cache item sliding expiration for key: {key}, refetching...", key);
            }
            //cache item not found, fetch data to store in cache
            logger.LogDebug("No cache item found, fetching data for {key}...", key);
            value = await factory();
            await SetAsync(key, value, slidingExpiration, absoluteExpiration);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during GetOrCreateAsync: {message}", ex.Message);
            throw;
        }
        return value;
    }

    private async Task ResetSlidingExpiration<T>(string key, StateEntry<DaprCacheItem<T>>? cacheItem) where T : class, new()
    {
        if(cacheItem == null)
        {
            throw new ArgumentNullException(nameof(cacheItem), "Cache item cannot be null.");
        }
        cacheItem.Value.LastAccessed = DateTime.UtcNow;
        logger.LogDebug("reset timestamp for data to: {timestamp}", cacheItem.Value.LastAccessed.ToString("o"));
        await daprClient.SaveStateAsync(StateStoreName, key, cacheItem.Value);
    }

    public async Task SetAsync<T>(string key, T value, int? slidingExpiration = null, int? absoluteExpiration = null) where T : class, new()
    {
        
        logger.LogDebug("Persisting item for key: {key}", key);
        if (string.IsNullOrEmpty(key))
        {
            throw new ArgumentException("Key cannot be null or empty.", nameof(key));
        }

        if (value == null)
        {
            throw new ArgumentNullException(nameof(value), "Value cannot be null.");
        }

        var cacheItem = new DaprCacheItem<T>
        {
            Content = value,
            LastAccessed = DateTime.UtcNow,
            SlidingExpirationInSeconds = slidingExpiration ?? defaultSlidingExpiration
        };

        var metadata = new Dictionary<string, string>
        {
            { "contentType", "application/json" },
            { "ttlInSeconds", (absoluteExpiration ?? defaultAbsoluteExpiration).ToString() }
        };

        try
        {
            await daprClient.SaveStateAsync(StateStoreName, key, cacheItem, null, metadata);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while saving the dapr cache object: {message}", ex.Message);
            throw;
        }
    }

    private bool IsExpired<T>(DaprCacheItem<T> cacheItem, int? slidingExpiration)
    {
        var expirationInSeconds = slidingExpiration ?? defaultSlidingExpiration;
        var isExpired = (DateTime.UtcNow - cacheItem.LastAccessed).TotalSeconds > expirationInSeconds;
        logger.LogDebug("CacheItem isExpired: {isExpired}, expirationInSeconds: {expiration}", isExpired, expirationInSeconds);
        return isExpired;
    }
}

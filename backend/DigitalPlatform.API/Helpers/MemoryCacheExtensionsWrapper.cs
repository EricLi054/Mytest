using DigitalPlatform.API.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace DigitalPlatform.API.Helpers;
/// <summary>
/// This class serves as a wrapper for the GetOrCreateAsync method of the IMemoryCache interface,
/// providing an abstraction for unit testing purposes.
/// </summary>
public class MemoryCacheExtensionsWrapper(IConfiguration config) : IMemoryCacheExtensionsWrapper
{
    public async Task<TItem?> GetOrCreateAsync<TItem>(IMemoryCache cache, object key, Func<ICacheEntry, Task<TItem>> factory)
    {
        return await cache.GetOrCreateAsync(key, async entry =>
        {
            entry.SetOptions(CacheEntryHelper.CacheEntryOptions(config, entry));
            return await factory(entry);
        });
    }

    public TItem Set<TItem>(IMemoryCache cache, object key, TItem value)
    {
        return cache.Set(key, value, CacheEntryHelper.CacheEntryOptions(config, null));
    }
}

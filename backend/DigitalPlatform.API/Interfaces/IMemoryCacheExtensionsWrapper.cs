using Microsoft.Extensions.Caching.Memory;

namespace DigitalPlatform.API.Interfaces;
public interface IMemoryCacheExtensionsWrapper
{
    Task<TItem?> GetOrCreateAsync<TItem>(IMemoryCache cache, object key, Func<ICacheEntry, Task<TItem>> factory);
    TItem Set<TItem>(IMemoryCache cache, object key, TItem value);
}
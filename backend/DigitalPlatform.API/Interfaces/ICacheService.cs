using Microsoft.Extensions.Caching.Memory;

namespace DigitalPlatform.API.Interfaces;
public interface ICacheService
{
    Task<T?> GetOrCreateAsync<T>(object key, Func<ICacheEntry, Task<T>> createItem);
    T Set<T>(object key, T value);
}

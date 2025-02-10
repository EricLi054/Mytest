using Microsoft.Extensions.Caching.Memory;
using DigitalPlatform.API.Interfaces;

namespace DigitalPlatform.API.Services;
public sealed class CacheService(IMemoryCache cache, IMemoryCacheExtensionsWrapper cacheExtensionsWrapper) : ICacheService, IDisposable
{
    private bool _disposed;

    public async Task<T?> GetOrCreateAsync<T>(object key, Func<ICacheEntry, Task<T>> createItem)
    {
        ObjectDisposedException.ThrowIf(_disposed, nameof(CacheService));
        var result = await cacheExtensionsWrapper.GetOrCreateAsync(cache, key, createItem);
        return result;
    }
    public T Set<T>(object key, T value)
    {
        ObjectDisposedException.ThrowIf(_disposed, nameof(CacheService));
        return cacheExtensionsWrapper.Set(cache, key, value);
    }
    public bool TryGetValue(object key, out object? value)
    {
        ObjectDisposedException.ThrowIf(_disposed, nameof(CacheService));
        return cache.TryGetValue(key, out value);
    }
    public void Dispose()
    {
        if (!_disposed)
        {
            cache.Dispose();
            _disposed = true;
        }
    }
}
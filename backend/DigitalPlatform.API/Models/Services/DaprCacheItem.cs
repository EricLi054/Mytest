namespace DigitalPlatform.API.Models.Services;
public class DaprCacheItem<T>
{
    public T? Content { get; set; }
    public DateTime LastAccessed { get; set; }
    public int? SlidingExpirationInSeconds { get; set; }
}
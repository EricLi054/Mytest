
using DigitalPlatform.API.Descriptors;
using Microsoft.Extensions.Caching.Memory;

namespace DigitalPlatform.API.Helpers
{
    public static class CacheEntryHelper
    {
        /// <summary>
        /// set default cache configurations if not already set at the entry level
        /// </summary>
        /// <returns></returns>
        public static MemoryCacheEntryOptions CacheEntryOptions(IConfiguration config, ICacheEntry? entry = null)
        {
            int slidingExpirationSeconds = GetSlidingExpiration(config, entry);
            var absoluteExpirationSeconds = GetAbsoluteExpirationSeconds(config, entry);
            var size = GetCacheSize(config, entry);
            return new MemoryCacheEntryOptions()
                            .SetSlidingExpiration(TimeSpan.FromSeconds(slidingExpirationSeconds))
                            .SetAbsoluteExpiration(TimeSpan.FromSeconds(absoluteExpirationSeconds))
                            .SetSize(size);
        }

        public static int GetSlidingExpiration(IConfiguration config)
        {
            return GetSlidingExpiration(config, null);
        }
        private static int GetSlidingExpiration(IConfiguration config, ICacheEntry? entry)
        {
            if (entry?.SlidingExpiration != null)
            {
                return (int)entry.SlidingExpiration.Value.TotalSeconds;
            }
            _ = int.TryParse(config[ConfigDescriptors.CACHE_SLIDING_EXPIRATION_SECONDS], out var result);
            return result != 0 ? result : CacheDefaultConfigs.SlidingExpirationSeconds;
        }
        public static int GetAbsoluteExpirationSeconds(IConfiguration config)
        {
            return GetAbsoluteExpirationSeconds(config, null);
        }
        private static int GetAbsoluteExpirationSeconds(IConfiguration config, ICacheEntry? entry)
        {
            if (entry?.AbsoluteExpirationRelativeToNow != null)
            {
                return (int)entry.AbsoluteExpirationRelativeToNow.Value.TotalSeconds;
            }
            _ = int.TryParse(config[ConfigDescriptors.CACHE_ABSOLUTE_EXPIRATION_SECONDS], out var result);
            return result != 0 ? result : CacheDefaultConfigs.AbsoluteExpirationSeconds;
        }

        private static long GetCacheSize(IConfiguration config, ICacheEntry? entry)
        {
            if (entry?.Size != null)
            {
                return entry.Size.Value;
            }
            _ = long.TryParse(config[ConfigDescriptors.CACHE_SIZE], out var result);
            return result != 0 ? result : CacheDefaultConfigs.Size;
        }
    }
}

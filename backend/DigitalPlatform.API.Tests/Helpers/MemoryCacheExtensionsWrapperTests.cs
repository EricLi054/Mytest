using DigitalPlatform.API.Helpers;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace DigitalPlatform.API.Tests.Helpers;
[TestFixture]
public class MemoryCacheExtensionsWrapperTests
{
    [Test]
    public async Task GetOrCreateAsync_CacheEntryDoesNotExist_CallsFactoryAndReturnsValue()
    {
        // Arrange
        var cache = new MemoryCache(new MemoryCacheOptions());
        var key = "testKey";
        var expectedValue = "testValue";
        var config = Substitute.For<IConfiguration>();
        var wrapper = new MemoryCacheExtensionsWrapper(config);

        // Act
        var result = await wrapper.GetOrCreateAsync(cache, key, async entry =>
        {
            return await Task.FromResult(expectedValue);
        });

        // Assert
        Assert.That(result, Is.EqualTo(expectedValue));
    }

    [Test]
    public async Task GetOrCreateAsync_CacheEntryExists_ReturnsCachedValue()
    {
        // Arrange
        var cache = new MemoryCache(new MemoryCacheOptions());
        var key = "testKey";
        var expectedValue = "testValue";
        var config = Substitute.For<IConfiguration>();
        var wrapper = new MemoryCacheExtensionsWrapper(config);

        // Add the value to the cache
        cache.Set(key, expectedValue);

        // Act
        var result = await wrapper.GetOrCreateAsync<string>(cache, key, entry =>
        {
            throw new Exception("Factory should not be called");
        });

        // Assert
        Assert.That(result, Is.EqualTo(expectedValue));
    }
    [Test]
    public async Task GetOrCreateAsync_CacheEntryDoesNotExists_RespectsCacheSettings()
    {
        // Arrange
        var cache = new MemoryCache(new MemoryCacheOptions());
        var key = "testKey";
        var expectedValue = "testValue";
        var config = Substitute.For<IConfiguration>();
        var wrapper = new MemoryCacheExtensionsWrapper(config);

        // Act
        var result = await wrapper.GetOrCreateAsync(cache, key, async entry =>
        {
            entry.SlidingExpiration = TimeSpan.FromSeconds(69);
            return await Task.FromResult(expectedValue);
        });

        // Assert
        Assert.That(result, Is.EqualTo(expectedValue));
        Assert.That(cache.Get(key), Is.EqualTo(expectedValue));
    }
[Test]
        public void Set_ShouldSetItemInCache()
        {
            // Arrange
            var cache = new MemoryCache(new MemoryCacheOptions());
            var config = Substitute.For<IConfiguration>();
            var wrapper = new MemoryCacheExtensionsWrapper(config);

            var key = "testKey";
            var value = "testValue";

            // Act
            var result = wrapper.Set(cache, key, value);

            // Assert
            Assert.That(cache.Get<string>(key), Is.EqualTo(value));
            Assert.That(result, Is.EqualTo(value));
        }
}

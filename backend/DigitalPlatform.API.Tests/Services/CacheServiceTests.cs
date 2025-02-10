using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Services;
using Microsoft.Extensions.Caching.Memory;

namespace DigitalPlatform.API.Tests.Services;
[TestFixture]
public class CacheServiceTests
{
    private IMemoryCache _cache;
    private IMemoryCacheExtensionsWrapper _cacheExtensionsWrapper;
    private CacheService _cacheService;
    [SetUp]
    public void Setup()
    {
        _cache = Substitute.For<IMemoryCache>();
        _cacheExtensionsWrapper = Substitute.For<IMemoryCacheExtensionsWrapper>();
        _cacheService = new CacheService(_cache, _cacheExtensionsWrapper);
    }

    [TearDown]
    public void TearDown()
    {
        _cacheService.Dispose();
        _cache.Dispose();
    }
    [Test]
    public async Task GetOrCreateAsync_KeyExists_ReturnsCachedValue()
    {
        // Arrange
        object key = "testKey";
        string cachedValue = "cachedValue";
        Func<ICacheEntry, Task<string>> createItem = _ => Task.FromResult(cachedValue);
        _cacheExtensionsWrapper.GetOrCreateAsync(_cache, key, createItem).Returns(cachedValue);

        // Act
        var result = await _cacheService.GetOrCreateAsync(key, createItem);

        // Assert
        Assert.That(result, Is.EqualTo(cachedValue));
    }

    [Test]
    public async Task GetOrCreateAsync_KeyDoesNotExist_CallsCreateItemAndReturnsNewValue()
    {
        // Arrange
        object key = "testKey";
        string createdValue = "createdValue";
        Func<ICacheEntry, Task<string>> createItem = _ => Task.FromResult(createdValue);
        _cacheExtensionsWrapper.GetOrCreateAsync(_cache, key, createItem).Returns(createdValue);

        // Act
        var result = await _cacheService.GetOrCreateAsync(key, createItem);

        // Assert
        Assert.That(result, Is.EqualTo(createdValue));
    }
    [Test]
    public async Task GetOrCreateAsync_KeyDoesNotExist_CallsCreatePersonAndReturnsNewValue()
    {
        // Arrange
        object crmId = "testCrmId";
        Person personData = new() { RacId = "testRacId", FirstName = "testName" };
        _cacheExtensionsWrapper.GetOrCreateAsync(_cache, crmId, Arg.Any<Func<ICacheEntry, Task<Person>>>()).Returns(personData);

        // Act
        var result = await _cacheService.GetOrCreateAsync(crmId, async entry =>
        {
            entry.SetAbsoluteExpiration(TimeSpan.FromMinutes(3));
            return await Task.FromResult(personData);
        });

        // Assert
        Assert.That(result, Is.EqualTo(personData));
    }

    [Test]
    public void TryGetValue_KeyExists_ReturnsTrueAndSetsValue()
    {
        // Arrange
        object key = "key";
        object value = "value";
        _cacheExtensionsWrapper.Set(_cache, key, value).Returns(value);
        _cache.TryGetValue(key, out Arg.Any<string?>())
                .Returns(x =>
                {
                    x[1] = value;
                    return true;
                });
        // Act
        bool result = _cacheService.TryGetValue(key, out object? retrievedValue);

        // Assert
        Assert.That(result, Is.True);
        Assert.That(retrievedValue, Is.EqualTo(value));
    }

    [Test]
    public void TryGetValue_KeyDoesNotExist_ReturnsFalseAndSetsNullValue()
    {
        // Arrange
        object key = "key";

        // Act
        bool result = _cacheService.TryGetValue(key, out object? retrievedValue);

        // Assert
        Assert.That(result, Is.False);
        Assert.That(retrievedValue, Is.Null);
    }
    [Test]
    public void Set_SetsValueInCache()
    {
        // Arrange
        object crmId = "testCrmId";
        Person personData = new() { RacId = "testRacId", FirstName = "testName" };
        _cacheExtensionsWrapper.Set(_cache, crmId, Arg.Any<Person>()).Returns(personData);
        _cache.TryGetValue(crmId, out Arg.Any<Person?>())
            .Returns(x =>
            {
                x[1] = personData;
                return true;
            });
        // Act
        _cacheService.Set(crmId, personData);

        // Assert
        Assert.That(_cacheService.TryGetValue(crmId, out var tryGetPerson), Is.EqualTo(true));
    }

    [Test]
    public void Dispose_CallsCacheDispose()
    {
        // Act
        _cacheService.Dispose();

        // Assert
        _cache.Received(1).Dispose();
        Assert.That(_cacheService, Is.Not.Null);
    }
}

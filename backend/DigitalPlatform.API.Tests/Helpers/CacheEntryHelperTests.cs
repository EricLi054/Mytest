using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Helpers;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using NUnit.Framework.Internal;

namespace DigitalPlatform.API.Tests.Helpers;
[TestFixture]
public class CacheEntryHelperTests
{
        private readonly IConfiguration _config;

        public CacheEntryHelperTests()
        {
            _config = Substitute.For<IConfiguration>();
        }
        [Test]
        public void CacheEntryOptions_WithSlidingExpiration_ReturnsCorrectOptions()
        {
            // Arrange
            var entry = Substitute.For<ICacheEntry>();
            entry.SlidingExpiration.Returns(TimeSpan.FromMinutes(10));

            // Act
            var options = CacheEntryHelper.CacheEntryOptions(_config, entry);

            // Assert
            Assert.That(options.SlidingExpiration, Is.EqualTo(TimeSpan.FromMinutes(10)));
            Assert.That(options.AbsoluteExpiration, Is.Null);
            Assert.That(options.Size, Is.EqualTo(CacheDefaultConfigs.Size));
        }

        [Test]
        public void CacheEntryOptions_WithAbsoluteExpiration_ReturnsCorrectOptions()
        {
            // Arrange
            var entry = Substitute.For<ICacheEntry>();
            entry.AbsoluteExpirationRelativeToNow.Returns(TimeSpan.FromHours(1));

            // Act
            var options = CacheEntryHelper.CacheEntryOptions(_config, entry);

            // Assert
            Assert.That(options.SlidingExpiration, Is.EqualTo(TimeSpan.FromSeconds(CacheDefaultConfigs.SlidingExpirationSeconds)));
            Assert.That(options.AbsoluteExpirationRelativeToNow, Is.EqualTo(TimeSpan.FromHours(1)));
            Assert.That(options.Size, Is.EqualTo(CacheDefaultConfigs.Size));
        }

        [Test]
        public void CacheEntryOptions_WithCustomSize_ReturnsCorrectOptions()
        {
            // Arrange
            var entry = Substitute.For<ICacheEntry>();
            entry.Size.Returns(100);

            // Act
            var options = CacheEntryHelper.CacheEntryOptions(_config, entry);

            // Assert
            Assert.That(options.SlidingExpiration, Is.EqualTo(TimeSpan.FromSeconds(CacheDefaultConfigs.SlidingExpirationSeconds)));
            Assert.That(options.AbsoluteExpirationRelativeToNow, Is.EqualTo(TimeSpan.FromSeconds(CacheDefaultConfigs.AbsoluteExpirationSeconds)));
            Assert.That(options.Size, Is.EqualTo(100));
        }

        [Test]
        public void CacheEntryOptions_WithDefaultConfigurations_ReturnsCorrectOptions()
        {
            // Arrange
            var entry = Substitute.For<ICacheEntry>();

            // Act
            var options = CacheEntryHelper.CacheEntryOptions(_config, entry);

            // Assert
            Assert.That(options.SlidingExpiration, Is.EqualTo(TimeSpan.FromSeconds(CacheDefaultConfigs.SlidingExpirationSeconds)));
            Assert.That(options.AbsoluteExpirationRelativeToNow, Is.EqualTo(TimeSpan.FromSeconds(CacheDefaultConfigs.AbsoluteExpirationSeconds)));
            Assert.That(options.Size, Is.EqualTo(CacheDefaultConfigs.Size));
        }    
}
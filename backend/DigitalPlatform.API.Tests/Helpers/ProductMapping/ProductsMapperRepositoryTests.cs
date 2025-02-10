using DigitalPlatform.API.Helpers.ProductMapping;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.Tests.Helpers.ProductMapping
{
    [TestFixture]
    public class ProductMapperRepositoryTests
    {
        private IProductMapper _mockMapper1;
        private IProductMapper _mockMapper2;
        private ILogger<ProductMapperRepository> _mockLogger;
        private IProductMapperRepository _productMapperRepository;

        [SetUp]
        public void SetUp()
        {
            // Arrange mock mappers using NSubstitute
            _mockMapper1 = Substitute.For<IProductMapper>();
            _mockMapper1.Type.Returns("Type1");

            _mockMapper2 = Substitute.For<IProductMapper>();
            _mockMapper2.Type.Returns("Type2");

            _mockLogger = Substitute.For<ILogger<ProductMapperRepository>>();

            var mappers = new List<IProductMapper> { _mockMapper1, _mockMapper2 };
            _productMapperRepository = new ProductMapperRepository(mappers, _mockLogger);
        }

        [Test]
        public void GetMapper_ShouldReturnCorrectMapper_WhenTypeMatches()
        {
            // Act
            var result = _productMapperRepository.Get("Type1");

            // Assert
            Assert.That(result, Is.EqualTo(_mockMapper1));
        }

        [Test]
        public void GetMapper_ShouldReturnCorrectMapper_IgnoringCase()
        {
            // Act
            var result = _productMapperRepository.Get("type2");

            // Assert
            Assert.That(result, Is.EqualTo(_mockMapper2));
        }

        [Test]
        public void GetMapper_ShouldThrowArgumentException_WhenTypeIsEmpty()
        {
            // Act & Assert
            Assert.That(() => _productMapperRepository.Get(string.Empty),
                Throws.ArgumentException.With.Message.Contains("Type cannot be null or empty."));
        }

        [Test]
        public void GetMapper_ShouldLogError_WhenNoMatchingMapperFound()
        {
            // Act
            var result = _productMapperRepository.Get("UnknownType");

            // Assert
            Assert.That(result, Is.Null); // Ensure null is returned
            _mockLogger.Received(1).LogError("No mapper found for type 'UnknownType'");
        }
    }
}

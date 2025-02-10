using DigitalPlatform.API.Models.Data.Products.PolicyDetails;

namespace DigitalPlatform.API.Tests.Models
{
    [TestFixture]
    public class BundledProductTests
    {
        [Test]
        public void BundledProduct_ShouldInitializeWithRequiredProperties()
        {
            // Arrange & Act
            var bundledProduct = new BundledProduct
            {
                ProductName = "Product A",
                Asset = "Asset A"
            };

            // Assert
            Assert.That(bundledProduct.ProductName, Is.EqualTo("Product A"));
            Assert.That(bundledProduct.Asset, Is.EqualTo("Asset A"));
        }
    }
}

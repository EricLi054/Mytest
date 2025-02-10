using DigitalPlatform.API.Models.Data.Products.PolicyDetails;

namespace DigitalPlatform.API.Tests.Models
{
    [TestFixture]
    public class BundledAmountTests
    {
        [Test]
        public void BundledAmount_ShouldInitializeWithRequiredProperties()
        {
            // Arrange & Act
            var bundledAmount = new BundledAmount
            {
                Label = "Label A",
                Title = "Title A",
                Message = "Message A",
                BundledProducts = new List<BundledProduct>
                {
                    new BundledProduct { ProductName = "Product A", Asset = "Asset A" }
                }
            };

            // Assert
            Assert.That(bundledAmount.Label, Is.EqualTo("Label A"));
            Assert.That(bundledAmount.Title, Is.EqualTo("Title A"));
            Assert.That(bundledAmount.Message, Is.EqualTo("Message A"));
            Assert.That(bundledAmount.BundledProducts, Has.Count.EqualTo(1));
            Assert.That(bundledAmount.BundledProducts[0].ProductName, Is.EqualTo("Product A"));
            Assert.That(bundledAmount.BundledProducts[0].Asset, Is.EqualTo("Asset A"));
        }

        [Test]
        public void BundledAmount_ShouldInitializeEmptyBundledProductsList()
        {
            // Arrange & Act
            var bundledAmount = new BundledAmount
            {
                Label = "Label A",
                Title = "Title A",
                Message = "Message A",
            };

            // Assert
            Assert.That(bundledAmount.BundledProducts, Has.Count.EqualTo(0));
        }

        [Test]
        public void BundledAmount_ShouldAllowEmptyProductList()
        {
            // Arrange & Act
            var bundledAmount = new BundledAmount
            {
                Label = "Label A",
                Title = "Title A",
                Message = "Message A",
                BundledProducts = new List<BundledProduct>()
            };

            // Assert
            Assert.That(bundledAmount.BundledProducts, Has.Count.EqualTo(0));
        }
    }
}

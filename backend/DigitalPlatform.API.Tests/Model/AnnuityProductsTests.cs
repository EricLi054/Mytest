using DigitalPlatform.API.Models.Products.AnnuityProducts;

namespace DigitalPlatform.API.Tests.Model
{
    [TestFixture]
    public class AnnuityProductsTest
    {
        [Test]
        public void AnnuityProduct_Properties_DefaultValueIsEmpty()
        {
            // Arrange
            var annuityProduct = new AnnuityProduct();

            // Act
            var id = annuityProduct.Id;
            var businessType = annuityProduct.BusinessType;
            var type = annuityProduct.Type;
            var title = annuityProduct.Title;
            var subtitle = annuityProduct.Subtitle;

            Assert.Multiple(() =>
            {
                // Assert
                Assert.That(id, Is.EqualTo(string.Empty));
                Assert.That(businessType, Is.EqualTo(string.Empty));
                Assert.That(type, Is.EqualTo(string.Empty));
                Assert.That(title, Is.EqualTo(string.Empty));
                Assert.That(subtitle, Is.EqualTo(string.Empty));
            });
        }
        [Test]
        public void AnnuityProduct_Properties_AssignedValueNotChanged()
        {
            // Arrange
            var annuityProduct = new AnnuityProduct { Id = "1", BusinessType = "2", Type = "3", Title = "4", Subtitle = "5" };

            // Act
            var id = annuityProduct.Id;
            var businessType = annuityProduct.BusinessType;
            var type = annuityProduct.Type;
            var title = annuityProduct.Title;
            var subtitle = annuityProduct.Subtitle;

            Assert.Multiple(() =>
            {
                // Assert
                Assert.That(id, Is.EqualTo("1"));
                Assert.That(businessType, Is.EqualTo("2"));
                Assert.That(type, Is.EqualTo("3"));
                Assert.That(title, Is.EqualTo("4"));
                Assert.That(subtitle, Is.EqualTo("5"));
            });
        }        
    }
}
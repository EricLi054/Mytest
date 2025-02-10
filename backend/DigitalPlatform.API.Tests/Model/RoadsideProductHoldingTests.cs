using DigitalPlatform.API.Models.Products.AnnuityProducts;
using DigitalPlatform.API.Tests.Data;

namespace DigitalPlatform.API.Tests.Models.Products.AnnuityProducts
{
    [TestFixture]
    public class RoadsideProductHoldingTests
    {
        [Test]
        public void BankDetails_WhenProductIsDDBA_ReturnsMaskedBankAccountDetails()
        {
            // Arrange
            var productHeader = FinOpsTestData.ValidProductHoldingWithNextActionInFuture[0];
            var flags = new FinOpsProductFlags {
                IsNotBundledOrFirstInBundle = true
            };
            var roadsideProductHolding = new RoadsideProductHolding(productHeader, productHeader.ProductHoldingLines.First(), flags);

            // Assert
            Assert.That(roadsideProductHolding.BSB, Is.EqualTo("***456"));
            Assert.That(roadsideProductHolding.AccountNumber, Is.EqualTo("****56789"));
        }

    }
}
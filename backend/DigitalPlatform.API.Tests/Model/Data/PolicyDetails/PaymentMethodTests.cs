using DigitalPlatform.API.Models.Data.Products.PolicyDetails;

namespace DigitalPlatform.API.Tests.Models.Data.Products.PolicyDetails
{
    [TestFixture]
    public class PaymentMethodTests
    {
        [Test]
        public void PaymentMethod_ShouldSetRequiredPropertiesCorrectly()
        {
            // Arrange
            var expectedTitle = "Bank Transfer";
            var expectedType = "Direct Debit";
            var expectedBsb = "123456";
            var expectedAccountNumber = "987654321";
            var expectedCardNumber = "4111111111111111";
            var expectedCardExpiry = "12/25";

            // Act
            var paymentMethod = new PaymentMethod
            {
                Title = expectedTitle,
                Type = expectedType,
                Bsb = expectedBsb,
                AccountNumber = expectedAccountNumber,
                CardNumber = expectedCardNumber,
                CardExpiry = expectedCardExpiry
            };

            // Assert
            Assert.That(paymentMethod.Title, Is.EqualTo(expectedTitle), "Title property did not match the expected value.");
            Assert.That(paymentMethod.Type, Is.EqualTo(expectedType), "Type property did not match the expected value.");
            Assert.That(paymentMethod.Bsb, Is.EqualTo(expectedBsb), "Bsb property did not match the expected value.");
            Assert.That(paymentMethod.AccountNumber, Is.EqualTo(expectedAccountNumber), "AccountNumber property did not match the expected value.");
            Assert.That(paymentMethod.CardNumber, Is.EqualTo(expectedCardNumber), "CardNumber property did not match the expected value.");
            Assert.That(paymentMethod.CardExpiry, Is.EqualTo(expectedCardExpiry), "CardExpiry property did not match the expected value.");
        }

        [Test]
        public void PaymentMethod_ShouldSetOptionalPropertiesCorrectly()
        {
            // Arrange
            var expectedLinkText = "Manage Payment";
            var expectedLink = "https://example.com/manage";

            // Act
            var paymentMethod = new PaymentMethod
            {
                Title = "Bank Transfer",
                Type = "Direct Debit",
                Bsb = "123456",
                AccountNumber = "987654321",
                CardNumber = "4111111111111111",
                CardExpiry = "12/25",
                LinkText = expectedLinkText,
                Link = expectedLink
            };

            // Assert
            Assert.That(paymentMethod.LinkText, Is.EqualTo(expectedLinkText), "LinkText property did not match the expected value.");
            Assert.That(paymentMethod.Link, Is.EqualTo(expectedLink), "Link property did not match the expected value.");
        }
    }
}

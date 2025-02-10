using DigitalPlatform.API.Models.Data.Products.PolicyDetails;

namespace DigitalPlatform.API.Tests.Models.Data.Products.PolicyDetails
{
    [TestFixture]
    public class PaymentFrequencyTests
    {
        [Test]
        public void PaymentFrequency_ShouldSetPropertiesCorrectly()
        {
            // Arrange
            var expectedTitle = "Monthly Payment";
            var expectedPreMessage = "Your next payment is due on:";
            var expectedFrequency = "Monthly";
            var expectedMessage = "Please make your payment to avoid late fees.";
            var expectedLinkText = "View Details";
            var expectedLink = "https://example.com/details";

            // Act
            var paymentFrequency = new PaymentFrequency
            {
                Title = expectedTitle,
                PreMessage = expectedPreMessage,
                Frequency = expectedFrequency,
                Message = expectedMessage,
                LinkText = expectedLinkText,
                Link = expectedLink
            };

            // Assert
            Assert.That(paymentFrequency.Title, Is.EqualTo(expectedTitle), "Title property did not match the expected value.");
            Assert.That(paymentFrequency.PreMessage, Is.EqualTo(expectedPreMessage), "PreMessage property did not match the expected value.");
            Assert.That(paymentFrequency.Frequency, Is.EqualTo(expectedFrequency), "Frequency property did not match the expected value.");
            Assert.That(paymentFrequency.Message, Is.EqualTo(expectedMessage), "Message property did not match the expected value.");
            Assert.That(paymentFrequency.LinkText, Is.EqualTo(expectedLinkText), "LinkText property did not match the expected value.");
            Assert.That(paymentFrequency.Link, Is.EqualTo(expectedLink), "Link property did not match the expected value.");
        }
    }
}

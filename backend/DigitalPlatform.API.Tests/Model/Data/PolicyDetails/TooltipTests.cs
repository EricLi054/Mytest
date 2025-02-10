using DigitalPlatform.API.Models.Data.Products.PolicyDetails;

namespace DigitalPlatform.API.Tests.Models
{
    [TestFixture]
    public class TooltipTests
    {
        [Test]
        public void Tooltip_ShouldSetTitleAndMessageCorrectly()
        {
            // Arrange
            var expectedTitle = "Sample Title";
            var expectedMessage = "This is a sample message.";

            // Act
            var tooltip = new Tooltip
            {
                Title = expectedTitle,
                Message = expectedMessage
            };

            // Assert
            Assert.That(tooltip.Title, Is.EqualTo(expectedTitle), "Title property did not match the expected value.");
            Assert.That(tooltip.Message, Is.EqualTo(expectedMessage), "Message property did not match the expected value.");
        }
    }
}

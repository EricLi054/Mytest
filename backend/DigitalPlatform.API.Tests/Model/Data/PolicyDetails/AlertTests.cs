using DigitalPlatform.API.Models.Data.Products.PolicyDetails;

namespace DigitalPlatform.API.Tests.Models
{
    [TestFixture]
    public class AlertTests
    {
        [Test]
        public void Alert_ShouldSetSeverityAndMessageCorrectly()
        {
            // Arrange
            var expectedSeverity = "High";
            var expectedMessage = "This is an alert message.";

            // Act
            var alert = new Alert
            {
                Severity = expectedSeverity,
                Message = expectedMessage
            };

            // Assert
            Assert.That(alert.Severity, Is.EqualTo(expectedSeverity), "Severity property did not match the expected value.");
            Assert.That(alert.Message, Is.EqualTo(expectedMessage), "Message property did not match the expected value.");
        }
    }
}

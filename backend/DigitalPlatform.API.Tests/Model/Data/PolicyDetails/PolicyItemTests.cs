using DigitalPlatform.API.Models.Data.Products.PolicyDetails;

namespace DigitalPlatform.API.Tests.Models
{
    [TestFixture]
    public class PolicyItemTests
    {
        [Test]
        public void PolicyItem_ShouldInitializeWithRequiredProperties()
        {
            // Arrange & Act
            var policyItem = new PolicyItem
            {
                Label = "Sample Label",
                Value = "Sample Value"
            };

            // Assert
            Assert.That(policyItem.Label, Is.EqualTo("Sample Label"));
            Assert.That(policyItem.Value, Is.EqualTo("Sample Value"));
        }

        [Test]
        public void PolicyItem_ShouldAllowNullablePropertiesToBeNull()
        {
            // Arrange & Act
            var policyItem = new PolicyItem
            {
                Label = "Sample Label",
                Value = "Sample Value",
                PaymentMethod = null,
                Tooltip = null,
                PaymentFrequency = null,
                BundledAmount = null
            };

            // Assert
            Assert.That(policyItem.PaymentMethod, Is.Null);
            Assert.That(policyItem.Tooltip, Is.Null);
            Assert.That(policyItem.PaymentFrequency, Is.Null);
            Assert.That(policyItem.BundledAmount, Is.Null);
        }
    }
}

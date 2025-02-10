using System;
using NUnit.Framework;
using DigitalPlatform.API.Models.Data.Products.PolicyDetails;

namespace DigitalPlatform.API.Tests.Models
{
    [TestFixture]
    public class SubActionTests
    {
        [Test]
        public void SubAction_ShouldInitializeWithRequiredProperties()
        {
            // Arrange & Act
            var analytics = new Analytics
            {
                Description = "Analytics"
            };
            var subAction = new SubAction
            {
                Label = "SubAction Label",
                Analytics = analytics
            };

            // Assert
            Assert.That(subAction.Label, Is.EqualTo("SubAction Label"));
            Assert.That(subAction.Analytics, Is.Not.Null);
        }

        [Test]
        public void SubAction_ShouldAllowNullablePropertiesToBeNull()
        {
            // Arrange & Act
            var analytics = new Analytics
            {
                Description = "Analytics"
            };
            var subAction = new SubAction
            {
                Label = "SubAction Label",
                Analytics = analytics,
                SubLabel = null,  // Nullable property set to null
                Link = null       // Nullable property set to null
            };

            // Assert
            Assert.That(subAction.SubLabel, Is.Null);
            Assert.That(subAction.Link, Is.Null);
        }

        [Test]
        public void SubAction_ShouldAllowValidAnalyticsObject()
        {
            // Arrange & Act
            var analytics = new Analytics
            {
                Description = "Analytics"
            };
            var subAction = new SubAction
            {
                Label = "SubAction Label",
                Analytics = analytics
            };

            // Assert
            Assert.That(subAction.Analytics, Is.EqualTo(analytics));  // Check if Analytics is correctly set
        }
    }
}

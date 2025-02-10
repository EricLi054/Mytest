using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using Action = DigitalPlatform.API.Models.Data.Products.PolicyDetails.Action;

namespace DigitalPlatform.API.Tests.Models
{
    [TestFixture]
    public class ActionTests
    {
        [Test]
        public void Action_ShouldInitializeWithRequiredProperties()
        {
            // Arrange & Act
            var analytics = new Analytics
            {
                Description = "Analytics"
            };
            var action = new Action
            {
                Label = "Action Label",
                Analytics = analytics
            };

            // Assert
            Assert.That(action.Label, Is.EqualTo("Action Label"));
            Assert.That(action.Analytics, Is.Not.Null);
        }

        [Test]
        public void Action_ShouldAllowNullablePropertiesToBeNull()
        {
            // Arrange & Act
            var analytics = new Analytics
            {
                Description = "Analytics"
            };
            var action = new Action
            {
                Label = "Action Label",
                Analytics = analytics,
                Type = null,  // Nullable property set to null
                Link = null   // Nullable property set to null
            };

            // Assert
            Assert.That(action.Type, Is.Null);
            Assert.That(action.Link, Is.Null);
        }

        [Test]
        public void Action_ShouldInitializeWithEmptySubActionsList()
        {
            // Arrange & Act
            var analytics = new Analytics
            {
                Description = "Analytics"
            };
            var action = new Action
            {
                Label = "Action Label",
                Analytics = analytics,
                SubActions = []  // Empty list
            };

            // Assert
            Assert.That(action.SubActions, Has.Count.EqualTo(0));
        }

        [Test]
        public void Action_ShouldAllowPopulatedSubActionsList()
        {
            // Arrange & Act
            var analytics = new Analytics
            {
                Description = "Analytics"
            };
            var action = new Action
            {
                Label = "Action Label",
                Analytics = analytics,
                SubActions =
                [
                    new SubAction
                    {
                        Label = "SubAction 1",
                        Analytics = new Analytics
                        {
                            Description = "Analytics 1"
                        }
                    },
                    new SubAction
                    {
                        Label = "SubAction 2",
                        Analytics = new Analytics
                        {
                            Description = "Analytics 2"
                        }
                    }
                ]
            };

            // Assert
            Assert.That(action.SubActions, Has.Count.EqualTo(2));
        }
    }
}

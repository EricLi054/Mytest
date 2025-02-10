using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using Action = DigitalPlatform.API.Models.Data.Products.PolicyDetails.Action;

namespace DigitalPlatform.API.Tests.Models
{
    [TestFixture]
    public class PolicyDetailTests
    {
        [Test]
        public void PolicyDetail_ShouldInitializeWithRequiredProperties()
        {
            // Arrange & Act
            var policyDetail = new PolicyDetail
            {
                Type = "TypeA",
                Title = "Policy Title",
                Subtitle = "Policy Subtitle",
                PolicyItems =
                [
                    new PolicyItem { Label = "Item1", Value = "Value1" },
                    new PolicyItem { Label = "Item2", Value = "Value2" }
                ],
                Actions =
                [
                    new() {
                        Label = "Label",
                        Analytics = new Analytics{
                            Description = "Analytics"
                        }
                    }
                ]
            };

            // Assert
            Assert.That(policyDetail.Type, Is.EqualTo("TypeA"));
            Assert.That(policyDetail.Title, Is.EqualTo("Policy Title"));
            Assert.That(policyDetail.Subtitle, Is.EqualTo("Policy Subtitle"));
            Assert.That(policyDetail.PolicyItems, Has.Count.EqualTo(2));
            Assert.That(policyDetail.Actions, Has.Count.EqualTo(1));
        }

        [Test]
        public void PolicyDetail_ShouldAllowNullablePropertiesToBeNull()
        {
            // Arrange & Act
            var policyDetail = new PolicyDetail
            {
                Type = "TypeA",
                Title = "Policy Title",
                Subtitle = "Policy Subtitle",
                PolicyItems = new List<PolicyItem>
                {
                    new PolicyItem { Label = "Item1", Value = "Value1" }
                },
                Alerts = null,  // Nullable property set to null
                Actions = new List<Action>()
            };

            // Assert
            Assert.That(policyDetail.RegistrationNumber, Is.Null);
            Assert.That(policyDetail.SubtitleSecondary, Is.Null);
            Assert.That(policyDetail.Alerts, Is.Null);
        }

        [Test]
        public void PolicyDetail_ShouldInitializeEmptyAlertsList()
        {
            // Arrange & Act
            var policyDetail = new PolicyDetail
            {
                Type = "TypeA",
                Title = "Policy Title",
                Subtitle = "Policy Subtitle",
                PolicyItems = new List<PolicyItem>
                {
                    new PolicyItem { Label = "Item1", Value = "Value1" }
                },
                Alerts = new List<Alert>(),  // Empty list
                Actions = new List<Action>()
            };

            // Assert
            Assert.That(policyDetail.Alerts, Has.Count.EqualTo(0));
        }

        [Test]
        public void PolicyDetail_ShouldInitializeEmptyPolicyItemsList()
        {
            // Arrange & Act
            var policyDetail = new PolicyDetail
            {
                Type = "TypeA",
                Title = "Policy Title",
                Subtitle = "Policy Subtitle",
                PolicyItems = new List<PolicyItem>(),  // Empty list
                Alerts = new List<Alert>(),
                Actions = new List<Action>()
            };

            // Assert
            Assert.That(policyDetail.PolicyItems, Has.Count.EqualTo(0));
        }

        [Test]
        public void PolicyDetail_ShouldAllowEmptyActionsList()
        {
            // Arrange & Act
            var policyDetail = new PolicyDetail
            {
                Type = "TypeA",
                Title = "Policy Title",
                Subtitle = "Policy Subtitle",
                PolicyItems = new List<PolicyItem>
                {
                    new PolicyItem { Label = "Item1", Value = "Value1" }
                },
                Alerts = new List<Alert>(),
                Actions = new List<Action>()  // Empty list
            };

            // Assert
            Assert.That(policyDetail.Actions, Has.Count.EqualTo(0));
        }
    }
}

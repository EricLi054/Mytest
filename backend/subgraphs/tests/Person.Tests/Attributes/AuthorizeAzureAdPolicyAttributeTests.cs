using Person.Attributes;

namespace Person.Tests.Attributes
{
    public class AuthorizeAzureAdPolicyAttributeTests
    {
        [Test]
        public void Constructor_SetsPolicyCorrectly()
        {
            Assert.That(new AuthorizeAzureAdPolicyAttribute().Policy, 
                Is.EqualTo("AzureAdPolicy"));
        }
    }
}
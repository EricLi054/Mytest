using Person.Attributes;

namespace Person.Tests.Attributes
{
    public class AuthorizeAzureAdB2CPolicyAttributeTests
    {
        [Test]
        public void Constructor_SetsPolicyCorrectly()
        {
            Assert.That(new AuthorizeAzureAdB2CPolicyAttribute().Policy, 
                Is.EqualTo("AzureAdB2CPolicy"));
        }
    }
}
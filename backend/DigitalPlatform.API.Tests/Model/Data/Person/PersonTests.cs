using DigitalPlatform.API.Models.Data.Person;

namespace DigitalPlatform.API.Tests.Model
{
    [TestFixture]
    public class PersonTests
    {
        [TestCase("Red Card", "Red")]
        [TestCase("Blue", "Blue")]
        [TestCase("Bronze", "Bronze")]
        [TestCase("Silver", "Silver")]
        [TestCase("Gold", "Gold")]
        [TestCase("St Ives", "Gold")]
        [TestCase("St Ives Staff", "Gold")]
        [TestCase("Staff", "Gold")]
        [TestCase("Little Legends", "Little Legends")]
        [TestCase("Road Ready", "Road Ready")]
        [TestCase("Free2Go", "Free2Go")]
        [TestCase("Life", "Gold Life")]
        [TestCase("New Life", "Gold Life")]
        [TestCase("Gold Life", "Gold Life")]
        [TestCase("RAC Ignite", "RAC Ignite")]
        [TestCase("", "None")]
        public void Person_CardColour_ReturnsCorrectValues(string tier, string expectedColour)
        {
            // Arrange
            var person = new Person { Tier = tier };

            // Act & Assert
            Assert.That(person.CardColour, Is.EqualTo(expectedColour));
        }

        [TestCase("Doctor", "Dr")]
        [TestCase("Mr", "Mr")]
        [TestCase("", "")]
        [TestCase(null, "")]
        public void Person_Title_ReturnsCorrectTitle(string? title, string expectedTitle) {
            Person person = new () { Title = title! };

            Assert.That(person.Title, Is.EqualTo(expectedTitle));
        }

        [TestCase("23456789", true, "**** *789")]
        [TestCase("23456789", false, "2345 6789")]
        [TestCase("0823456789", true, "08 **** *789")]
        [TestCase("0823456789", false, "08 2345 6789")]
        [TestCase(null, false, "")]
        public void Person_HomePhone_ReturnsCorrectMasking(string? homePhone, bool masked, string expectedPhone)
        {
            var person = new Person { HomePhone = homePhone!, IsMasked = masked };

            Assert.That(person.HomePhone, Is.EqualTo(expectedPhone));
        }

        [TestCase("23456789", true, "**** *789")]
        [TestCase("23456789", false, "2345 6789")]
        [TestCase("0823456789", true, "08 **** *789")]
        [TestCase("0823456789", false, "08 2345 6789")]
        [TestCase(null, false, "")]
        public void Person_WorkPhone_ReturnsCorrectMasking(string? workPhone, bool masked, string expectedPhone)
        {
            var person = new Person { WorkPhone = workPhone!, IsMasked = masked };

            Assert.That(person.WorkPhone, Is.EqualTo(expectedPhone));
        }

        [TestCase("0423456789", true, "04** *** 789")]
        [TestCase("0423456789", false, "0423 456 789")]
        [TestCase(null, false, "")]
        public void Person_MobilePhone_ReturnsCorrectMasking(string? mobilePhone, bool masked, string expectedPhone)
        {
            var person = new Person { MobilePhone = mobilePhone!, IsMasked = masked };

            Assert.That(person.MobilePhone, Is.EqualTo(expectedPhone));
        }

        [TestCase("someemail@somedomain.com", true, "s*******l@somedomain.com")]
        [TestCase("someemail@somedomain.com", false, "someemail@somedomain.com")]
        [TestCase("sl@somedomain.com", false, "sl@somedomain.com")]
        [TestCase("sl@somedomain.com", true, "**@somedomain.com")]
        [TestCase(null, false, "")]
        public void Person_PersonalEmailAddress_ReturnsCorrectMasking(string? personalEmailAddress, bool masked, string expectedEmailAddress)
        {
            var person = new Person { PersonalEmailAddress = personalEmailAddress!, IsMasked = masked };

            Assert.That(person.PersonalEmailAddress, Is.EqualTo(expectedEmailAddress));
        }

        [TestCase("someemail@somedomain.com", true, "s*******l@somedomain.com")]
        [TestCase("someemail@somedomain.com", false, "someemail@somedomain.com")]
        [TestCase("sl@somedomain.com", false, "sl@somedomain.com")]
        [TestCase("sl@somedomain.com", true, "**@somedomain.com")]
        [TestCase(null, false, "")]
        public void Person_WorkEmailAddress_ReturnsCorrectMasking(string? workEmailAddress, bool masked, string expectedEmailAddress)
        {
            var person = new Person { WorkEmailAddress = workEmailAddress!, IsMasked = masked };

            Assert.That(person.WorkEmailAddress, Is.EqualTo(expectedEmailAddress));
        }

        [TestCase("", "PO Box 1234", "PO Box 1234", "Perth", "WA",  "5678", true, "*********** Perth, WA 5678")]
        [TestCase("", "", "PO Box 1234", "Perth", "WA", "5678", true, "*********** Perth, WA 5678")]
        [TestCase("", "PO Box 1234", "PO Box 1234", "Perth", "WA", "5678", false, "PO Box 1234 Perth, WA 5678")]
        [TestCase("", "", "PO Box 1234", "Perth", "WA", "5678", false, "PO Box 1234 Perth, WA 5678")]
        [TestCase("832", "Wellington St", "", "West Perth", "WA", "6005", true, "*** ************* West Perth, WA 6005")]
        [TestCase("832", "Wellington St", "", "West Perth", "WA", "6005", false, "832 Wellington St West Perth, WA 6005")]
        public static void Person_Address_ReturnsCorrectAddress(string houseNumber, string streetName, string poBox, string suburb, string state, string postcode, bool masked, string expectedFormattedAddress)
        {
            var person = new Person { IsMasked = masked, PostalAddress = new() { HouseNumber = houseNumber, StreetName = streetName, POBox = poBox, Suburb = suburb, State = state, Postcode = postcode } };

            Assert.That(person.PostalAddress.FormattedAddress, Is.EqualTo(expectedFormattedAddress));
        }

        [Test]
        public static void Person_UnmaskedPerson_ReturnsUnmaskedAddress() {
            var person = new Person {
                IsMasked = true,
                PostalAddress = new() {
                    HouseNumber = "832",
                    StreetName = "Wellington St",
                    Suburb = "West Perth",
                    State = "WA",
                    Postcode = "6005",
                    IsMasked = true
                }
            };

            Assert.That(person.PostalAddress.FormattedAddress, Is.EqualTo("*** ************* West Perth, WA 6005"));

            person.IsMasked = false;
            
            Assert.That(person.PostalAddress.FormattedAddress, Is.EqualTo("832 Wellington St West Perth, WA 6005"));
        }
    }
}
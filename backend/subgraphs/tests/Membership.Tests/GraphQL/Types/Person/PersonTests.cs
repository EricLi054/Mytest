using Membership.Interfaces;
using Moq;

namespace Membership.Tests.GraphQL.Types.Person;

public class PersonTests
{
    private Mock<IMemberCardService> _memberCardService;

    [SetUp]
    public void SetUp()
    {
        _memberCardService = new Mock<IMemberCardService>();
    }

    [Test]
    public async Task GetDigitalCardDetails_SuccessfulResponse_ReturnsCardDetails()
    {
        var person = new Membership.GraphQL.Types.Person
        {
            PersonId = "123",
            RacId = "RAC456"
        };

        Membership.GraphQL.Types.DigitalCardDetails response = new()
        {
            Id = "digital-pass-id",
            PassId = "digital-pass-1234",
            IsActive = true,
            PassUrl = "https://digital-pass-1234",
            NumberOfPassesInstalled = 0
        };

        _memberCardService.Setup(mc => mc.RetrieveDigitalCardDetailsAsync("123")).ReturnsAsync(response);
        var result = await person.GetDigitalCardDetailsAsync(_memberCardService.Object);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.Id, Is.EqualTo("digital-pass-id"));
            Assert.That(result.PassId, Is.EqualTo("digital-pass-1234"));
            Assert.That(result.PassUrl, Is.EqualTo("https://digital-pass-1234"));
            Assert.That(result.IsActive, Is.True);
            Assert.That(result.NumberOfPassesInstalled, Is.Zero);
        });
    }

    [Test]
    public void GetDigitalCardDetails_ShouldThrowException_WhenServiceDoes()
    {
        var person = new Membership.GraphQL.Types.Person
        {
            PersonId = "123",
            RacId = "RAC456"
        };

        _memberCardService.Setup(mc => mc.RetrieveDigitalCardDetailsAsync("123"))
            .ThrowsAsync(new Exception("Internal Server Error"));

        Assert.ThrowsAsync<Exception>(async () => await person.GetDigitalCardDetailsAsync(_memberCardService.Object));
    }
}
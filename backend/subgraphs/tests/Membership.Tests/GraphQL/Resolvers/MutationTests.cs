using Membership.GraphQL.Resolvers;
using Membership.Interfaces;
using Membership.Types.MemberCards;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;

namespace Membership.Tests.GraphQL.Resolvers;

internal class MutationTests
{
    private Mock<IMemberCardService> _memberCardService = null!;
    private Mock<ILogger<Mutation>> _loggerMock = null!;
    private Mutation _mutation = null!;

    [SetUp]
    public void SetUp()
    {
        _memberCardService = new Mock<IMemberCardService>();
        _loggerMock = new Mock<ILogger<Mutation>>();
        _mutation = new Mutation(_loggerMock.Object);
    }

    [Test]
    public async Task CreatePhysicalCardRequest_ShouldReturnSuccessfulResponse_WhenRequestIsSuccessful()
    {
        var crmId = "123456";
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("extension_crmId", crmId)
        ]));

        PhysicalCardResponse expectedResult = new()
        {
            IsSuccess = true,
            Value = "Physical card request is successful"
        };

        _memberCardService.Setup(mc => mc.CreatePhysicalCardRequestAsync("123456")).ReturnsAsync(expectedResult);
        var result = await _mutation.RequestPhysicalCardAsync(_memberCardService.Object, claimsPrincipal);

        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedResult));
    }

    [Test]
    public void CreatePhysicalCardRequest_ThrowsException_WhenServiceThrowsException()
    {
        var crmId = "123456";
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("extension_crmId", crmId)
        ]));

        _memberCardService.Setup(mc => mc.CreatePhysicalCardRequestAsync("123456"))
            .ThrowsAsync(new Exception("Internal Server Error"));

        Assert.ThrowsAsync<Exception>(async () => await _mutation.RequestPhysicalCardAsync(_memberCardService.Object, claimsPrincipal));
    }
}

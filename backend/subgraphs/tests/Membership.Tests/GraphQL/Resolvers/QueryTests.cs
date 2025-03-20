using Membership.GraphQL.Resolvers;
using Membership.Interfaces;
using Membership.Types.ADB2CGraph;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;

namespace Membership.Tests.GraphQL.Resolvers;

public class QueryTests
{
    private Mock<IAddressService> _addressService = null!;
    private Mock<IADB2CGraphService> _adb2cService = null!;

    private Query _query = null!;
    private Mock<ILogger<Query>> _loggerMock = null!;

    [SetUp]
    public void SetUp()
    {
        _loggerMock = new Mock<ILogger<Query>>();
        _addressService = new Mock<IAddressService>();
        _adb2cService = new Mock<IADB2CGraphService>();
        _query = new Query();
    }

    [Test]
    public async Task GetAddressListByPaf_ShouldReturnValidAddresses()
    {
        var expectedResponse = AddressTestData.ValidAddressLookupResponse;
        _addressService.Setup(s => s.GetPafAddressListAsync("832 welling")).ReturnsAsync(expectedResponse);
        var result = await _query.GetAddressListAsync("832 welling", _addressService.Object);

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Meta?.Count, Is.EqualTo(expectedResponse.Meta?.Count));
        Assert.That(result.Data?[0].Id, Is.EqualTo(expectedResponse.Data?[0].Id));
    }

    [Test]
    public async Task ValidatePafAddress_ShouldCallAddressService()
    {
        var expectedResponse = AddressTestData.ValidPAFVerificationResponse;
        _addressService.Setup(s => s.GetPafAddressAsync("832 welling")).ReturnsAsync(expectedResponse);
        var result = await _query.GetValidatePAFAsync("832 welling", _addressService.Object, _loggerMock.Object);

        Assert.That(result?.Data, Is.Not.Null);
        Assert.That(result.Data.Type, Is.EqualTo("addresses"));
        Assert.That(result.Data.Attributes.BuildingNumber, Is.EqualTo("832"));
    }

    [Test]
    public async Task GetADB2CAccount_ShouldCallADB2CServiceService()
    {
        var expectedEmail = "test@test.com";
        var claims = new[] { new Claim("name", expectedEmail) };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));
        var expectedResponse = new ADB2CAccount { Id = Guid.NewGuid(), AccountEnabled = true, DisplayName = "Test User", CrmId = Guid.NewGuid() };
        _adb2cService.Setup(s => s.GetUserByEmailAsync(expectedEmail)).ReturnsAsync(expectedResponse);

        var result = await _query.GetADB2CAccount(_adb2cService.Object, claimsPrincipal, _loggerMock.Object);

        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedResponse).UsingPropertiesComparer());
    }
}
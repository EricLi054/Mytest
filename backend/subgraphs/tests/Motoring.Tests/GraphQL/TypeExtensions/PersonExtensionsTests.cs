using Azure;
using Microsoft.Extensions.Logging;
using Moq;
using Motoring.API.FinOps.Interfaces;
using Motoring.GraphQL.TypeExtensions;
using Motoring.GraphQL.Types;

namespace Motoring.Tests.GraphQL.TypeExtensions;
public class PersonExtensionsTests
{
    private Mock<IFinOpsService> _mockFinOpsService = null!;
    private Mock<ILogger<PersonExtensions>> _mockLogger = null!;
    private PersonExtensions _personExtensions = null!;

    [SetUp]
    public void SetUp()
    {
        _mockFinOpsService = new Mock<IFinOpsService>();
        _mockLogger = new Mock<ILogger<PersonExtensions>>();
        _personExtensions = new PersonExtensions();
    }

    [Test]
    public async Task GetProductHoldingHeader_ShouldReturnNull_WhenRacIdIsNullOrWhiteSpace()
    {
        var person = new Person { PersonId = "Person124", RacId = string.Empty };

        var result =
            await _personExtensions.GetRoadsideProduct(person, _mockFinOpsService.Object, _mockLogger.Object, "id");

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetProductHoldingHeader_ShouldReturnProductHoldingHeader_WhenServiceReturnsResult()
    {
        var person = new Person { PersonId = "Person124", RacId = "RAC123" };
        const string id = "header123";

        var expectedRoadsideProduct = new RoadsideProduct
        {
            Id = id,
            CustAccount = "123",
            IsActive = true,
        };

        var mockResponse = Mock.Of<Response<RoadsideProduct>>(
            r => r.Value == expectedRoadsideProduct
        );

        _mockFinOpsService
            .Setup(s => s.GetRoadsideProductAsync(id, person.RacId))
            .ReturnsAsync(mockResponse);

        var result =
            await _personExtensions.GetRoadsideProduct(person, _mockFinOpsService.Object, _mockLogger.Object, id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedRoadsideProduct));
    }

    [Test]
    public async Task GetProductHoldingHeader_ShouldReturnNull_WhenServiceReturnsNull()
    {
        var person = new Person { PersonId = "Person124", RacId = "RAC123" };
        const string id = "header123";

        var mockResponse = Mock.Of<Response<RoadsideProduct>>(r => r.Value == null);

        _mockFinOpsService
            .Setup(s => s.GetRoadsideProductAsync(id, person.RacId))
            .ReturnsAsync(mockResponse);

        var result =
            await _personExtensions.GetRoadsideProduct(person, _mockFinOpsService.Object, _mockLogger.Object, id);

        Assert.That(result, Is.Null);
    }
}

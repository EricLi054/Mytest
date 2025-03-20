using FluentValidation;
using Microsoft.Extensions.Logging;
using Moq;
using Motoring.API.Vehicle.Interfaces;
using Motoring.GraphQL.Enums;
using Motoring.GraphQL.Resolvers;
using Motoring.GraphQL.Types;
using Motoring.GraphQL.Validators;

namespace Motoring.Tests.GraphQL.Resolvers;

public class QueryTests
{
    private Mock<IVehicleService> _vehicleServiceMock = null!;
    private Query _query = null!;
    private Mock<ILogger<Query>> _loggerMock = null!;
    private IValidator<VehicleByRegoQuery> _validator = null!;

    [SetUp]
    public void SetUp()
    {
        _vehicleServiceMock = new Mock<IVehicleService>();
        _loggerMock = new Mock<ILogger<Query>>();
        _query = new Query(_loggerMock.Object);
        _validator = new VehicleByRegoQueryValidator();
    }

    [Test]
    public async Task GetVehicleByRego_ReturnsVehicleDetail()
    {
        var vehicleType = VehicleType.Car;
        var rego = "ABC123";
        var state = State.WA;
        var expectedVehicleDetail = new VehicleDetail { Make = "Toyota", Model = "Corolla", Year = 2020, RegistrationNumber = "ABC123", Color = "Blue", Body = "Sedan", Fuel = "Petrol" };
        var query = new VehicleByRegoQuery { VehicleType = vehicleType, RegistrationNumber = rego, State = state };

        _vehicleServiceMock
            .Setup(vs => vs.GetVehicleByRegoAsync(vehicleType, rego, state))
            .ReturnsAsync(expectedVehicleDetail);

        var result = await _query.GetVehicleByRego(_vehicleServiceMock.Object, query, _validator);

        Assert.That(result, Is.Not.Null);
        Assert.That(result?.Make, Is.EqualTo(expectedVehicleDetail.Make));
        Assert.That(result?.Model, Is.EqualTo(expectedVehicleDetail.Model));
    }

    [Test]
    public void GetVehicleByRego_ThrowsException_WhenVehicleServiceFails()
    {
        var vehicleType = VehicleType.Car;
        var rego = "ABC123";
        var state = State.WA;
        var query = new VehicleByRegoQuery { VehicleType = vehicleType, RegistrationNumber = rego, State = state };

        _vehicleServiceMock
            .Setup(vs => vs.GetVehicleByRegoAsync(vehicleType, rego, state))
            .ThrowsAsync(new Exception("Service failure"));

        Assert.ThrowsAsync<Exception>(async () =>
            await _query.GetVehicleByRego(_vehicleServiceMock.Object, query, _validator));
    }

    [TestCase("ABC12345678910", TestName = "RegoTooLong")]
    [TestCase(" ABC12345", TestName = "RegoWithLeadingSpace")]
    [TestCase("ABC12345 ", TestName = "RegoWithTrailingSpace")]
    [TestCase("ABC 12345", TestName = "RegoWithInternalSpace")]
    [TestCase("ABC@123", TestName = "RegoWithSpecialCharacters")]
    [TestCase("ABC-123", TestName = "RegoWithInvalidCharacters")]
    public void GetVehicleByRego_ThrowsException_WhenRegoValidationFails(string rego)
    {
        var vehicleType = VehicleType.Car;
        var state = State.WA;
        var expectedVehicleDetail = new VehicleDetail { Make = "Toyota", Model = "Corolla", Year = 2020, RegistrationNumber = "ABC123", Color = "Blue", Body = "Sedan", Fuel = "Petrol" };
        var query = new VehicleByRegoQuery { VehicleType = vehicleType, RegistrationNumber = rego, State = state };

        _vehicleServiceMock
            .Setup(vs => vs.GetVehicleByRegoAsync(vehicleType, rego, state))
            .ReturnsAsync(expectedVehicleDetail);

        Assert.ThrowsAsync<ValidationException>(async () =>
            await _query.GetVehicleByRego(_vehicleServiceMock.Object, query, _validator));
    }
}
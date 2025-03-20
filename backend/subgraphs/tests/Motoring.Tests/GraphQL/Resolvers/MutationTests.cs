using Moq;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Motoring.API.FinOps.Interfaces;
using Motoring.GraphQL.Resolvers;
using Motoring.API.FinOps.Models;
using Motoring.Interfaces;
using GraphQLTypes = Motoring.GraphQL.Types;
using Motoring.GraphQL.Types;
using Motoring.GraphQL.Enums;
using Motoring.GraphQL.Validators;
using FluentValidation;

namespace Motoring.Tests.GraphQL.Resolvers;

public class MutationTests
{
    private Mock<IPersonService> _personServiceMock = null!;
    private Mock<IFinOpsService> _finOpsServiceMock = null!;
    private Mock<ILogger<Mutation>> _loggerMock = null!;
    private Mutation _mutation = null!;

    [SetUp]
    public void SetUp()
    {
        _personServiceMock = new Mock<IPersonService>();
        _finOpsServiceMock = new Mock<IFinOpsService>();
        _loggerMock = new Mock<ILogger<Mutation>>();
        _mutation = new Mutation(_loggerMock.Object);
    }

    [Test]
    public async Task UpdateVehicle_ShouldReturnUpdatedVehicle_WhenSuccessful()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("extension_crmId", "crm123"),
            new Claim("name", "user@test.com")
        ]));
        var validator = new VehicleDetailValidator();

        var productId = "ProductHoldingHeader123";
        var lineId = "ProductHoldingLine123";

        var newVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            RegistrationNumber = "ABC123",
            Color = "Blue",
            Body = "Sedan",
            Fuel = "Petrol"
        };

        var person = new Person
        {
            PersonId = "Person124",
            RacId = "rac123",
        };

        var expectedVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            RegistrationNumber = "ABC123",
            Color = "Blue",
            Body = "Sedan",
            Fuel = "Petrol"
        };

        var roadsideProductResponse = new RoadsideProduct
        {
            Id = productId,
            CustAccount = "rac123",
            IsActive = true,
            Lines =
                [
                    new()
                    {
                        Id = lineId,
                        Version = 1,
                        ProductType = RoadsideProductType.Classic,
                        CanUpdateVehicle = true,
                        VehicleDetail = expectedVehicleDetail
                    }
                ]
        };


        _personServiceMock
            .Setup(service => service.GetRacIdAsync(It.IsAny<string>()))
            .ReturnsAsync(person.RacId);

        _finOpsServiceMock
            .Setup(service => service.UpdateRoadsideVehicleAsync(It.IsAny<UpdateRoadsideVehicleRequest>()))
            .ReturnsAsync(roadsideProductResponse);

        // Act
        var result = await _mutation.UpdateRoadsideVehicleAsync(_personServiceMock.Object, _finOpsServiceMock.Object, claimsPrincipal, productId, lineId, newVehicleDetail, validator);
        var updatedVehicleDetail = result?.Lines?.FirstOrDefault()?.VehicleDetail;

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(updatedVehicleDetail, Is.Not.Null);
        });

        Assert.Multiple(() =>
        {
            Assert.That(updatedVehicleDetail!.Make, Is.EqualTo(expectedVehicleDetail.Make));
            Assert.That(updatedVehicleDetail.Model, Is.EqualTo(expectedVehicleDetail.Model));
            Assert.That(updatedVehicleDetail.Year, Is.EqualTo(expectedVehicleDetail.Year));
            Assert.That(updatedVehicleDetail.Color, Is.EqualTo(expectedVehicleDetail.Color));
            Assert.That(updatedVehicleDetail.Body, Is.EqualTo(expectedVehicleDetail.Body));
            Assert.That(updatedVehicleDetail.Fuel, Is.EqualTo(expectedVehicleDetail.Fuel));
        });
    }

    [Test]
    public void UpdateVehicle_ShouldLogErrorAndThrow_WhenExceptionOccurs()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("extension_crmId", "crm123"),
            new Claim("name", "user@test.com")
        ]));
        var validator = new VehicleDetailValidator();

        var productId = "ProductHoldingHeader123";
        var lineId = "ProductHoldingLine123";

        var newVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            RegistrationNumber = "ABC123",
            Color = "Blue",
            Body = "Sedan",
            Fuel = "Petrol"
        };

        var person = new Person
        {
            PersonId = "Person124",
            RacId = "rac123",
        };

        var exception = new Exception("Test exception");

        _personServiceMock
            .Setup(service => service.GetRacIdAsync(It.IsAny<string>()))
            .ReturnsAsync(person.RacId);

        _finOpsServiceMock
            .Setup(service => service.UpdateRoadsideVehicleAsync(It.IsAny<UpdateRoadsideVehicleRequest>()))
            .ThrowsAsync(exception);

        // Act & Assert
        var ex = Assert.ThrowsAsync<Exception>(async () =>
            await _mutation.UpdateRoadsideVehicleAsync(_personServiceMock.Object, _finOpsServiceMock.Object, claimsPrincipal, productId, lineId, newVehicleDetail, validator));
        Assert.That(ex!.Message, Is.EqualTo("Test exception"));
    }

    [TestCase("ABC12345678910", TestName = "RegoTooLong")]
    [TestCase(" ABC12345", TestName = "RegoWithLeadingSpace")]
    [TestCase("ABC12345 ", TestName = "RegoWithTrailingSpace")]
    [TestCase("ABC 12345", TestName = "RegoWithInternalSpace")]
    [TestCase("ABC@123", TestName = "RegoWithSpecialCharacters")]
    [TestCase("ABC-123", TestName = "RegoWithInvalidCharacters")]
    public void UpdateVehicle_ShouldLogErrorAndThrow_WhenRegoNumberValidationExceptionOccurs(string rego)
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("extension_crmId", "crm123"),
            new Claim("name", "user@test.com")
        ]));
        var validator = new VehicleDetailValidator();

        var productId = "ProductHoldingHeader123";
        var lineId = "ProductHoldingLine123";

        var newVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            RegistrationNumber = rego,
            Color = "Blue",
            Body = "Sedan",
            Fuel = "Petrol"
        };

        var person = new Person
        {
            PersonId = "Person124",
            RacId = "rac123",
        };

        var exception = new ValidationException("Invalid registration number");

        var expectedVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            RegistrationNumber = "ABC123",
            Color = "Blue",
            Body = "Sedan",
            Fuel = "Petrol"
        };

        var roadsideProductResponse = new RoadsideProduct
        {
            Id = productId,
            CustAccount = "rac123",
            IsActive = true,
            Lines =
                        [
                            new()
                    {
                        Id = lineId,
                        Version = 1,
                        ProductType = RoadsideProductType.Classic,
                        CanUpdateVehicle = true,
                        VehicleDetail = expectedVehicleDetail
                    }
                        ]
        };

        _personServiceMock
            .Setup(service => service.GetRacIdAsync(It.IsAny<string>()))
            .ReturnsAsync(person.RacId);

        _finOpsServiceMock
            .Setup(service => service.UpdateRoadsideVehicleAsync(It.IsAny<UpdateRoadsideVehicleRequest>()))
            .ReturnsAsync(roadsideProductResponse);

        // Act & Assert
        Assert.ThrowsAsync<ValidationException>(async () =>
            await _mutation.UpdateRoadsideVehicleAsync(_personServiceMock.Object, _finOpsServiceMock.Object, claimsPrincipal, productId, lineId, newVehicleDetail, validator));
    }

    [Test]
    public void UpdateVehicle_ShouldThrowUnauthorizedAccessException_WhenClaimsPrincipalDoesNotContainCrmId()
    {
        // Arrange
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());
        var validator = new VehicleDetailValidator();

        var productId = "ProductHoldingHeader123";
        var lineId = "ProductHoldingLine123";

        var newVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            RegistrationNumber = "ABC123",
            Color = "Blue",
            Body = "Sedan",
            Fuel = "Petrol"
        };

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
            await _mutation.UpdateRoadsideVehicleAsync(_personServiceMock.Object, _finOpsServiceMock.Object, claimsPrincipal, productId, lineId, newVehicleDetail, validator));
    }
}
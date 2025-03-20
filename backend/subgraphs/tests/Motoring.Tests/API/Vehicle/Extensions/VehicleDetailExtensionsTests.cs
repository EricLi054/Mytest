using Motoring.API.Vehicle.Extensions;
using Motoring.API.Vehicle.Models;
using Motoring.GraphQL.Enums;

namespace Motoring.Tests.API.Vehicle.Extensions;

[TestFixture]
public class VehicleDetailsExtensionsTests
{
    [Test]
    public void ToGraphQLType_ShouldMapCorrectly()
    {
        var vehicleDetail = new VehicleDetail
        {
            NVIC = "654321",
            Year = 2020,
            Make = "Honda",
            Model = "Civic",
            Variant = "Sedan",
            Series = "10th Gen",
            Body = "Sedan",
            CC = "1498",
            Transmission = "Automatic",
            Engine = "2.0L",
            Cylinder = "4",
            CO2Emission = "162",
            VIN = "19XFC2F53LE012345",
            Fuel = "Petrol",
            Height = 1415,
            Length = 4658,
            Width = 1799,
            KerbWeight = 1316
        };

        var result = vehicleDetail.ToGraphQLType(VehicleType.Car, "MOCK102");

        Assert.Multiple(() =>
        {
            Assert.That(result.VehicleType, Is.EqualTo(VehicleType.Car));
            Assert.That(result.RegistrationNumber, Is.EqualTo("MOCK102"));
            Assert.That(result.NVIC, Is.EqualTo("654321"));
            Assert.That(result.Year, Is.EqualTo(2020));
            Assert.That(result.Make, Is.EqualTo("Honda"));
            Assert.That(result.Model, Is.EqualTo("Civic"));
            Assert.That(result.Variant, Is.EqualTo("Sedan"));
            Assert.That(result.Series, Is.EqualTo("10th Gen"));
            Assert.That(result.Body, Is.EqualTo("Sedan"));
            Assert.That(result.CC, Is.EqualTo("1498"));
            Assert.That(result.Transmission, Is.EqualTo("Automatic"));
            Assert.That(result.Engine, Is.EqualTo("2.0L"));
            Assert.That(result.Cylinder, Is.EqualTo("4"));
            Assert.That(result.CO2Emission, Is.EqualTo("162"));
            Assert.That(result.VIN, Is.EqualTo("19XFC2F53LE012345"));
            Assert.That(result.Fuel, Is.EqualTo("Petrol"));
            Assert.That(result.Height, Is.EqualTo(1415));
            Assert.That(result.Length, Is.EqualTo(4658));
            Assert.That(result.Width, Is.EqualTo(1799));
            Assert.That(result.KerbWeight, Is.EqualTo(1316));
        });
    }
}
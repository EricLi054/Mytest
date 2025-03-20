using Motoring.API.FinOps.Extensions;
using Motoring.API.FinOps.Models;
using GraphQLTypes = Motoring.GraphQL.Types;
using GraphQLEnums = Motoring.GraphQL.Enums;

namespace Motoring.Tests.API.FinOps.Extensions;

[TestFixture]
public class VehicleDetailsExtensionsTests
{
    [Test]
    public void ToGraphQLType_ShouldMapCorrectly()
    {
        var vehicleDetail = new VehicleDetail
        {
            RegistrationNumber = "MOCK101",
            NVIC = "123456",
            Year = "2023",
            Make = "Toyota",
            Model = "Corolla",
            Variant = "Hatchback",
            Series = "ZWE211R",
            BodyType = "Hatchback",
            Color = "Blue",
            CC = "1798",
            Transmission = "Automatic",
            Cylinder = "4",
            CO2Emission = 144,
            VIN = "JTNK43BE3P3001234",
            FuelType = "Petrol",
            Height = 1455,
            Length = 4375,
            Width = 1790,
            KerbWeight = 1380
        };

        var result = vehicleDetail.ToGraphQLType();

        Assert.Multiple(() =>
        {
            Assert.That(result.RegistrationNumber, Is.EqualTo("MOCK101"));
            Assert.That(result.NVIC, Is.EqualTo("123456"));
            Assert.That(result.Year, Is.EqualTo(2023));
            Assert.That(result.Make, Is.EqualTo("Toyota"));
            Assert.That(result.Model, Is.EqualTo("Corolla"));
            Assert.That(result.Variant, Is.EqualTo("Hatchback"));
            Assert.That(result.Series, Is.EqualTo("ZWE211R"));
            Assert.That(result.Body, Is.EqualTo("Hatchback"));
            Assert.That(result.Color, Is.EqualTo("Blue"));
            Assert.That(result.CC, Is.EqualTo("1798"));
            Assert.That(result.Transmission, Is.EqualTo("Automatic"));
            Assert.That(result.Cylinder, Is.EqualTo("4"));
            Assert.That(result.CO2Emission, Is.EqualTo("144"));
            Assert.That(result.VIN, Is.EqualTo("JTNK43BE3P3001234"));
            Assert.That(result.Fuel, Is.EqualTo("Petrol"));
            Assert.That(result.Height, Is.EqualTo(1455));
            Assert.That(result.Length, Is.EqualTo(4375));
            Assert.That(result.Width, Is.EqualTo(1790));
            Assert.That(result.KerbWeight, Is.EqualTo(1380));
        });
    }

    [Test]
    public void ToFinOpsModel_ShouldMapCorrectly()
    {
        var vehicleDetail = new GraphQLTypes.VehicleDetail
        {
            VehicleType = GraphQLEnums.VehicleType.Car,
            RegistrationNumber = "MOCK101",
            NVIC = "123456",
            Year = 2023,
            Make = "Toyota",
            Model = "Corolla",
            Variant = "Hatchback",
            Series = "ZWE211R",
            Body = "Hatchback",
            CC = "1798",
            Transmission = "Automatic",
            Cylinder = "4",
            CO2Emission = "144",
            VIN = "JTNK43BE3P3001234",
            Fuel = "Petrol",
            Height = 1455,
            Length = 4375,
            Width = 1790,
            KerbWeight = 1380
        };

        var result = vehicleDetail.ToFinOpsModel();

        Assert.Multiple(() =>
        {
            Assert.That(result.Type, Is.EqualTo(VehicleType.Vehicle));
            Assert.That(result.RegistrationNumber, Is.EqualTo("MOCK101"));
            Assert.That(result.NVIC, Is.EqualTo("123456"));
            Assert.That(result.Year, Is.EqualTo("2023"));
            Assert.That(result.Make, Is.EqualTo("Toyota"));
            Assert.That(result.Model, Is.EqualTo("Corolla"));
            Assert.That(result.Variant, Is.EqualTo("Hatchback"));
            Assert.That(result.Series, Is.EqualTo("ZWE211R"));
            Assert.That(result.BodyType, Is.EqualTo("Hatchback"));
            Assert.That(result.CC, Is.EqualTo("1798"));
            Assert.That(result.Transmission, Is.EqualTo("Automatic"));
            Assert.That(result.Cylinder, Is.EqualTo("4"));
            Assert.That(result.CO2Emission, Is.EqualTo(144));
            Assert.That(result.VIN, Is.EqualTo("JTNK43BE3P3001234"));
            Assert.That(result.FuelType, Is.EqualTo("Petrol"));
            Assert.That(result.Height, Is.EqualTo(1455));
            Assert.That(result.Length, Is.EqualTo(4375));
            Assert.That(result.Width, Is.EqualTo(1790));
            Assert.That(result.KerbWeight, Is.EqualTo(1380));
        });
    }
}
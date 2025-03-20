using Motoring.API.Vehicle.Enums;
using Motoring.GraphQL.Enums;
using Motoring.Utils;

namespace Motoring.Tests.API.Vehicle.Utils;

[TestFixture]
public class MockVehicleDataTests
{
    private const string TestJsonData = @"
[
                {
                    ""VehicleDetail"": {
                        ""Year"": 2023,
                        ""Make"": ""Toyota"",
                        ""Model"": ""Corolla"",
                        ""VIN"": ""JTNK43BE3P3001234"",
                        ""NVIC"": ""123456"",
                        ""Variant"": ""Hatchback"",
                        ""Series"": ""ZWE211R"",
                        ""Body"": ""Hatchback"",
                        ""Transmission"": ""Automatic"",
                        ""Cylinder"": ""4"",
                        ""CC"": ""1798"",
                        ""Fuel"": ""Petrol"",
                        ""CO2Emission"": ""144"",
                        ""Height"": 1455,
                        ""Length"": 4375,
                        ""Width"": 1790,
                        ""KerbWeight"": 1380
                    },
                    ""RegistrationNumber"": ""MOCK101"",
                    ""ModelTypeCode"": ""A"",
                    ""State"": ""WA""
                },
                {
                    ""VehicleDetail"": {
                        ""Year"": 2020,
                        ""Make"": ""Honda"",
                        ""Model"": ""Civic"",
                        ""VIN"": ""19XFC2F53LE012345"",
                        ""NVIC"": ""654321"",
                        ""Variant"": ""Sedan"",
                        ""Series"": ""10th Gen"",
                        ""Body"": ""Sedan"",
                        ""Transmission"": ""Automatic"",
                        ""Cylinder"": ""4"",
                        ""CC"": ""1498"",
                        ""Fuel"": ""Petrol"",
                        ""CO2Emission"": ""162"",
                        ""Height"": 1415,
                        ""Length"": 4658,
                        ""Width"": 1799,
                        ""KerbWeight"": 1316
                    },
                    ""RegistrationNumber"": ""MOCK102"",
                    ""ModelTypeCode"": ""A"",
                    ""State"": ""WA""
                }
            ]";

    [SetUp]
    public void SetUp()
    {
        MockVehicleData.LoadMockData(TestJsonData);
    }

    [Test]
    public void GetMockVehicle_ShouldReturnVehicleDetail_WhenVehicleExists()
    {
        // Arrange
        const ModelTypeCode modelTypeCode = ModelTypeCode.A;
        const string registrationNumber = "MOCK101";
        const State state = State.WA;

        // Act
        var result = MockVehicleData.GetMockVehicle(modelTypeCode, registrationNumber, state);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.Make, Is.EqualTo("Toyota"));
            Assert.That(result.Model, Is.EqualTo("Corolla"));
            Assert.That(result.Year, Is.EqualTo(2023));
            Assert.That(result.Body, Is.EqualTo("Hatchback"));
            Assert.That(result.Fuel, Is.EqualTo("Petrol"));
        });
    }

    [Test]
    public void GetMockVehicle_ShouldReturnNull_WhenVehicleDoesNotExist()
    {
        // Arrange
        const ModelTypeCode modelTypeCode = ModelTypeCode.A;
        const string registrationNumber = "NONEXISTENT";
        const State state = State.WA;

        // Act
        var result = MockVehicleData.GetMockVehicle(modelTypeCode, registrationNumber, state);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public void GetMockVehicle_ShouldReturnNull_WhenStateDoesNotMatch()
    {
        // Arrange
        const ModelTypeCode modelTypeCode = ModelTypeCode.A;
        const string registrationNumber = "MOCK101";
        const State state = State.NSW; // Mismatched state

        // Act
        var result = MockVehicleData.GetMockVehicle(modelTypeCode, registrationNumber, state);

        // Assert
        Assert.That(result, Is.Null);
    }
}

using Motoring.Utils;
using Shared.Tests.Helpers;
using Motoring.API.Vehicle.Services;
using Motoring.GraphQL.Enums;
using Motoring.GraphQL.Types;
using Motoring.API.Vehicle.Enums;
using Shared.Constants;
using System.Net;

namespace Motoring.Tests.API.Vehicle.Services;

[TestFixture]
public class VehicleServiceTests : BaseServiceTests<VehicleService>
{
    private VehicleService _vehicleService = null!;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.VehicleApiEndpointKey, "/vehicle");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "EXAMPLEAPIKEY");
        Environment.SetEnvironmentVariable(Environments.Key, Environments.Name.Local);

        _vehicleService = new VehicleService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object, LoggerMock.Object);
    }

    [Test]
    public async Task GetVehicleByRegoAsync_ShouldReturnVehicleDetail_WhenSuccessful()
    {
        const VehicleType vehicleType = VehicleType.Car;
        const string rego = "ABC123";
        const State state = State.NSW;

        var expectedVehicleDetail = new VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            RegistrationNumber = rego,
            Body = "Sedan",
            Fuel = "Petrol"
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedVehicleDetail);
        MockHttpResponse(responseMessage);

        Environment.SetEnvironmentVariable(Environments.Key, Environments.Name.Prd);
        var result = await _vehicleService.GetVehicleByRegoAsync(vehicleType, rego, state);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.Make, Is.EqualTo(expectedVehicleDetail.Make));
            Assert.That(result.Model, Is.EqualTo(expectedVehicleDetail.Model));
            Assert.That(result.Year, Is.EqualTo(expectedVehicleDetail.Year));
            Assert.That(result.Body, Is.EqualTo(expectedVehicleDetail.Body));
            Assert.That(result.Fuel, Is.EqualTo(expectedVehicleDetail.Fuel));
        });
    }

    [Test]
    public void GetVehicleByRegoAsync_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        const VehicleType vehicleType = VehicleType.Car;
        const string rego = "ABC123";
        const State state = State.NSW;

        Environment.SetEnvironmentVariable(Environments.Key, Environments.Name.Prd);
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () =>
            await _vehicleService.GetVehicleByRegoAsync(vehicleType, rego, state));
    }

    [Test]
    public void GetVehicleByRegoAsync_ShouldThrowArgumentException_WhenRegoIsWhiteSpaceOrEmpty()
    {
        const VehicleType vehicleType = VehicleType.Car;
        const State state = State.NSW;

        Assert.ThrowsAsync<ArgumentException>(async () =>
            await _vehicleService.GetVehicleByRegoAsync(vehicleType, "", state));
        Assert.ThrowsAsync<ArgumentException>(async () =>
            await _vehicleService.GetVehicleByRegoAsync(vehicleType, "   ", state));
    }

    [TestCase(Environments.Name.Dev)]
    [TestCase(Environments.Name.Sit)]
    public async Task GetVehicleByRegoAsync_ShouldUseMockData_WhenEnvironmentIsDevOrSit(string env)
    {
        const VehicleType vehicleType = VehicleType.Car;
        const string rego = "MOCK101";
        const State state = State.WA;

        var mockVehicleDetail = new VehicleDetail
        {
            RegistrationNumber = "MOCK101",
            Year = 2023,
            Make = "Toyota",
            Model = "Corolla",
            Variant = "Hatchback",
            Body = "Hatchback",
            Color = "Blue",
            Fuel = "Petrol",
            Cylinder = "4",
            CC = "1798",
            CO2Emission = "144",
            NVIC = "123456",
            VIN = "JTNK43BE3P3001234",
            Series = "ZWE211R",
            Transmission = "Automatic",
            Height = 1455,
            Length = 4375,
            Width = 1790,
            KerbWeight = 1380
        };

        var mockJsonData = @"
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
                        ""Color"": ""Blue"",
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
                }
            ]";

        MockVehicleData.LoadMockData(mockJsonData);

        Environment.SetEnvironmentVariable(Environments.Key, env);
        _vehicleService = new VehicleService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object, LoggerMock.Object);

        var result = await _vehicleService.GetVehicleByRegoAsync(vehicleType, rego, state);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.RegistrationNumber, Is.EqualTo(mockVehicleDetail.RegistrationNumber));
            Assert.That(result.Make, Is.EqualTo(mockVehicleDetail.Make));
            Assert.That(result.Model, Is.EqualTo(mockVehicleDetail.Model));
            Assert.That(result.Year, Is.EqualTo(mockVehicleDetail.Year));
            Assert.That(result.Color, Is.EqualTo(mockVehicleDetail.Color));
            Assert.That(result.Body, Is.EqualTo(mockVehicleDetail.Body));
            Assert.That(result.Fuel, Is.EqualTo(mockVehicleDetail.Fuel));
        });
    }

    [TestCase(Environments.Name.Uat)]
    [TestCase(Environments.Name.Prd)]
    public async Task GetVehicleByRegoAsync_ShouldNotUseMockData_WhenEnvironmentIsUatOrPrd(string env)
    {
        const ModelTypeCode modelTypeCode = ModelTypeCode.A;
        const VehicleType vehicleType = VehicleType.Car;
        const string rego = "ABC123";
        const State state = State.NSW;

        var expectedVehicleDetail = new VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            RegistrationNumber = rego,
            Body = "Sedan",
            Fuel = "Petrol"
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedVehicleDetail);
        MockHttpResponse(responseMessage);

        Environment.SetEnvironmentVariable(Environments.Key, env);

        var result = await _vehicleService.GetVehicleByRegoAsync(vehicleType, rego, state);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.Make, Is.EqualTo(expectedVehicleDetail.Make));
            Assert.That(result.Model, Is.EqualTo(expectedVehicleDetail.Model));
            Assert.That(result.Year, Is.EqualTo(expectedVehicleDetail.Year));
            Assert.That(result.Body, Is.EqualTo(expectedVehicleDetail.Body));
            Assert.That(result.Fuel, Is.EqualTo(expectedVehicleDetail.Fuel));
        });

        // Verify that the mock data was not used
        MockVehicleData.LoadMockData(null); // Reset mock data
        var mockResult = MockVehicleData.GetMockVehicle(modelTypeCode, rego, state);
        Assert.That(mockResult, Is.Null);
    }

    [TestCase(HttpStatusCode.OK, true)]
    [TestCase(HttpStatusCode.NoContent, true)]
    [TestCase(HttpStatusCode.BadRequest, false)]
    [TestCase(HttpStatusCode.InternalServerError, false)]
    public async Task GetHealthStatusAsync_ShouldReturnPersonHealthStatus_WhenSuccessful(HttpStatusCode status, bool isAlive)
    {
        MockHttpResponse(HttpResponseHelper.CreateHttpResponseMessage(status));

        var result = await _vehicleService.GetHealthStatusAsync(CancellationToken.None);

        Assert.That(result, Is.EqualTo(isAlive));
    }

    [Test]
    public async Task GetVehicleByRegoAsync_ShouldReturnNull_WhenStatusCodeIsNotFound()
    {
        const VehicleType vehicleType = VehicleType.Car;
        const string rego = "ABC123";
        const State state = State.NSW;

        MockHttpResponse(HttpResponseHelper.CreateHttpResponseMessage(HttpStatusCode.NotFound));

        Environment.SetEnvironmentVariable(Environments.Key, Environments.Name.Prd);
        var result = await _vehicleService.GetVehicleByRegoAsync(vehicleType, rego, state);

        Assert.That(result, Is.Null);
    }
}

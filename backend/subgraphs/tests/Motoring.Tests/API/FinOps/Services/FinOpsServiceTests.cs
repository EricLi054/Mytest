using Motoring.API.FinOps.Services;
using Shared.Exceptions;
using Shared.Tests.Helpers;
using Motoring.API.FinOps.Models;
using Motoring.API.FinOps.Exceptions;
using GraphQLTypes = Motoring.GraphQL.Types;
using System.Text.Json;
using Moq;
using Moq.Protected;
using System.Net;

namespace Motoring.Tests.API.FinOps.Services;

[TestFixture]
public class FinOpsServiceTests : BaseServiceTests<FinOpsService>
{
    private FinOpsService _finOpsService = null!;
    private const string email = "user@test.com";

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.ProductHoldingsApiEndpointKey, "/productholdings");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "EXAMPLEAPIKEY");

        var httpClient = new HttpClient(HttpMessageHandlerMock.Object);

        _finOpsService = new FinOpsService(httpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object,
            LoggerMock.Object);
    }

    [Test]
    public async Task GetRoadsideProductHoldingAsync_ShouldReturnRoadsideProduct_WhenSuccessful()
    {
        const string racId = "rac123";
        const string productHoldingHeaderId = "ProductHoldingHeader123";
        const int vehicleYear = 2020;


        var expectedProductHoldingHeader = new ProductHoldingHeader
        {
            ProductHoldingHeaderId = productHoldingHeaderId,
            CustAccount = racId,
            Status = Constants.FinOps.ActiveStatus,
            ProductHoldingLines =
            [
                new()
                {
                    ProductHoldingId = "ProductHoldingLine123",
                    ProductHoldingVersion = 1,
                    ProductId = "Product123",
                    CanUpdateVehicle = true,
                    VehicleDetail = new()
                    {
                        Make = "Toyota",
                        Model = "Corolla",
                        Year = vehicleYear.ToString(),
                        RegistrationNumber = "ABC123",
                        Color = "Blue",
                        BodyType = "Sedan",
                        FuelType = "Petrol"
                    }
                }
            ]
        };

        var productHoldingHeaderResponse = new GetProductHoldingHeaderResponse
        {
            IsSuccess = true,
            Value = expectedProductHoldingHeader
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(productHoldingHeaderResponse);
        MockHttpResponse(responseMessage);

        var result = await _finOpsService.GetRoadsideProductAsync(productHoldingHeaderId, racId);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.Lines, Is.Not.Null);
            Assert.That(result.Id,
                Is.EqualTo(expectedProductHoldingHeader.ProductHoldingHeaderId));
            Assert.That(result.CustAccount, Is.EqualTo(expectedProductHoldingHeader.CustAccount));
            Assert.That(result.IsActive, Is.EqualTo(true));
        });
        Assert.That(result.Lines,
            Has.Count.EqualTo(expectedProductHoldingHeader.ProductHoldingLines.Count));

        var actualVehicle = result.Lines![0].VehicleDetail;
        var expectedVehicle = expectedProductHoldingHeader.ProductHoldingLines[0].VehicleDetail;

        Assert.Multiple(() =>
        {
            Assert.That(actualVehicle, Is.Not.Null);
            Assert.That(expectedVehicle, Is.Not.Null);
        });
        Assert.Multiple(() =>
        {
            Assert.That(actualVehicle!.Make, Is.EqualTo(expectedVehicle!.Make));
            Assert.That(actualVehicle.Model, Is.EqualTo(expectedVehicle.Model));
            Assert.That(actualVehicle.Year, Is.EqualTo(vehicleYear));
            Assert.That(actualVehicle.Color, Is.EqualTo(expectedVehicle.Color));
            Assert.That(actualVehicle.Body, Is.EqualTo(expectedVehicle.BodyType));
            Assert.That(actualVehicle.Fuel, Is.EqualTo(expectedVehicle.FuelType));
        });
    }

    [Test]
    public void GetRoadsideProductHoldingAsync_ShouldThrowNotFoundException_WhenRoadsideProductNotFound()
    {
        // Arrange
        var racId = "rac123";
        var productHoldingHeaderId = "ProductHoldingHeader123";

        var productHoldingHeaderResponse = new GetProductHoldingHeaderResponse { IsSuccess = true, Value = null };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(productHoldingHeaderResponse);
        MockHttpResponse(responseMessage);

        // Act & Assert
        var ex = Assert.ThrowsAsync<NotFoundException>(async () =>
            await _finOpsService.GetRoadsideProductAsync(productHoldingHeaderId, racId));
        Assert.That(ex!.Message, Is.EqualTo($"Roadside product with ID [{productHoldingHeaderId}] not found."));
    }

    [Test]
    public void GetRoadsideProductHoldingAsync_ShouldThrowNotFoundException_WhenOwnershipMismatch()
    {
        // Arrange
        var racId = "rac123";
        var productHoldingHeaderId = "ProductHoldingHeader123";

        var expectedProductHoldingHeader = new ProductHoldingHeader
        {
            ProductHoldingHeaderId = productHoldingHeaderId,
            CustAccount = "differentRacId",
            Status = Constants.FinOps.ActiveStatus,
            ProductHoldingLines =
            [
                new()
                {
                    ProductHoldingId = "ProductHoldingLine123",
                    ProductHoldingVersion = 1,
                    ProductId = "Product123",
                    CanUpdateVehicle = true,
                    VehicleDetail = new()
                    {
                        Make = "Toyota",
                        Model = "Corolla",
                        Year = "2020",
                        RegistrationNumber = "ABC123",
                        Color = "Blue",
                        BodyType = "Sedan",
                        FuelType = "Petrol"
                    }
                }
            ]
        };

        var productHoldingHeaderResponse = new GetProductHoldingHeaderResponse
        {
            IsSuccess = true,
            Value = expectedProductHoldingHeader
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(productHoldingHeaderResponse);
        MockHttpResponse(responseMessage);

        // Act & Assert
        var ex = Assert.ThrowsAsync<NotFoundException>(async () =>
            await _finOpsService.GetRoadsideProductAsync(productHoldingHeaderId, racId));
        Assert.That(ex!.Message,
            Is.EqualTo(
                $"Roadside product with ID [{productHoldingHeaderId}] is not owned by RacID [{racId}]."));
    }

    [Test]
    public async Task UpdateRoadsideVehicle_ShouldReturnUpdatedRoadsideProduct_WhenSuccessful()
    {
        // Arrange
        const string racId = "rac123";
        const string productHoldingHeaderId = "ProductHoldingHeader123";
        const string productHoldingLineId = "ProductHoldingLine123";

        var originalVehicleDetail = new VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = "2020",
            Color = "Blue",
            BodyType = "Sedan",
            FuelType = "Petrol",
            RegistrationNumber = "ABC123"
        };

        var newVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            Color = "Blue",
            Body = "Sedan",
            Fuel = "Petrol",
            RegistrationNumber = "ABC123"
        };

        var expectedProductHoldingHeader = new ProductHoldingHeader
        {
            ProductHoldingHeaderId = productHoldingHeaderId,
            CustAccount = racId,
            Status = Constants.FinOps.ActiveStatus,
            ProductHoldingLines =
        [
            new()
            {
                ProductHoldingId = productHoldingLineId,
                ProductHoldingVersion = 1,
                ProductId = "Product123",
                CanUpdateVehicle = true,
                VehicleDetail = originalVehicleDetail
            }
        ]
        };

        var productHoldingHeaderResponse = new GetProductHoldingHeaderResponse
        {
            IsSuccess = true,
            Value = expectedProductHoldingHeader
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(productHoldingHeaderResponse);
        MockHttpResponse(responseMessage);

        var request = new UpdateRoadsideVehicleRequest
        {
            RacId = racId,
            Email = email,
            ProductId = productHoldingHeaderId,
            LineId = productHoldingLineId,
            NewVehicleDetail = newVehicleDetail
        };

        // Act
        var result = await _finOpsService.UpdateRoadsideVehicleAsync(request);

        // Assert
        var actualVehicle = result.Lines
            ?.Find(line => line.Id == productHoldingLineId)?.VehicleDetail;

        Assert.That(actualVehicle, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(actualVehicle!.Make, Is.EqualTo(newVehicleDetail.Make));
            Assert.That(actualVehicle.Model, Is.EqualTo(newVehicleDetail.Model));
            Assert.That(actualVehicle.Year, Is.EqualTo(newVehicleDetail.Year));
            Assert.That(actualVehicle.Color, Is.EqualTo(newVehicleDetail.Color));
            Assert.That(actualVehicle.Body, Is.EqualTo(newVehicleDetail.Body));
            Assert.That(actualVehicle.Fuel, Is.EqualTo(newVehicleDetail.Fuel));
            Assert.That(actualVehicle.RegistrationNumber, Is.EqualTo(newVehicleDetail.RegistrationNumber));
        });
    }

    [Test]
    public void UpdateRoadsideVehicle_ShouldThrowHttpRequestException_WhenCallToFinOpsFails()
    {
        // Arrange
        var newVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Year = 2020,
            Make = "Toyota",
            Model = "Corolla",
            RegistrationNumber = "XYZ789"
        };

        var request = new UpdateRoadsideVehicleRequest
        {
            RacId = "rac123",
            Email = email,
            ProductId = "ProductHoldingHeader123",
            LineId = "ProductHoldingLine123",
            NewVehicleDetail = newVehicleDetail
        };

        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Update failed");

        // Act & Assert
        Assert.ThrowsAsync<HttpRequestException>(async () =>
            await _finOpsService.UpdateRoadsideVehicleAsync(request));
    }

    [Test]
    public void UpdateRoadsideVehicle_ShouldThrowVehicleUpdateException_WhenUpdateHasErrors()
    {
        // Arrange
        var newVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Year = 2020,
            Make = "Toyota",
            Model = "Corolla",
            RegistrationNumber = "XYZ789"
        };

        var request = new UpdateRoadsideVehicleRequest
        {
            RacId = "rac123",
            Email = email,
            ProductId = "ProductHoldingHeader123",
            LineId = "ProductHoldingLine123",
            NewVehicleDetail = newVehicleDetail
        };

        var productHoldingHeaderResponse = new GetProductHoldingHeaderResponse
        {
            IsSuccess = true,
            Value = new ProductHoldingHeader
            {
                ProductHoldingHeaderId = "ProductHoldingHeader123",
                CustAccount = "rac123",
                Status = Constants.FinOps.ActiveStatus,
                ProductHoldingLines =
                [
                    new()
                    {
                        ProductHoldingId = "ProductHoldingLine123",
                        ProductHoldingVersion = 1,
                        ProductId = "Product123",
                        CanUpdateVehicle = true,
                        VehicleDetail = new VehicleDetail
                        {
                            Make = "Toyota",
                            Model = "Corolla",
                            Year = "2020",
                            RegistrationNumber = "XYZ789",
                            Color = "Blue",
                            BodyType = "Sedan",
                            FuelType = "Petrol"
                        }
                    }
                ]
            }
        };

        var updateVehicleResponse = new GetProductHoldingHeaderResponse
        {
            IsSuccess = false,
            Errors = ["Error 1", "Error 2"]
        };

        var responseMessages = new Queue<HttpResponseMessage>();
        responseMessages.Enqueue(HttpResponseHelper.CreateHttpResponseMessage(productHoldingHeaderResponse));
        responseMessages.Enqueue(HttpResponseHelper.CreateHttpResponseMessage(updateVehicleResponse));
        MockHttpResponse(responseMessages);

        // Act & Assert
        Assert.ThrowsAsync<UpdateRoadsideVehicleException>(async () =>
            await _finOpsService.UpdateRoadsideVehicleAsync(request));
    }

    [Test]
    public void UpdateRoadsideVehicleAsync_ShouldThrowNotFoundException_WhenRoadsideProductNotFound()
    {
        var request = new UpdateRoadsideVehicleRequest
        {
            RacId = "rac123",
            Email = email,
            ProductId = "ProductHoldingHeader123",
            LineId = "ProductHoldingLine123",
            NewVehicleDetail = new()
            {
                Year = 2020,
                Make = "Toyota",
                Model = "Corolla",
                RegistrationNumber = "XYZ789"
            }
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage<ProductHoldingHeader?>(null);
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<NotFoundException>(async () =>
            await _finOpsService.UpdateRoadsideVehicleAsync(request));
    }

    [Test]
    public void UpdateRoadsideVehicleAsync_ShouldThrowBadRequestException_WhenRoadsideProductIsNotActive()
    {
        const string racId = "rac123";
        const string productHoldingHeaderId = "ProductHoldingHeader123";

        var request = new UpdateRoadsideVehicleRequest
        {
            RacId = racId,
            Email = email,
            ProductId = productHoldingHeaderId,
            LineId = "ProductHoldingLine123",
            NewVehicleDetail = new()
            {
                Year = 2025,
                Make = "Volkswagen",
                Model = "Tiguan",
                RegistrationNumber = "MU5TB3N1C3"
            }
        };

        var headerResponse = new GetProductHoldingHeaderResponse
        {
            IsSuccess = true,
            Value = new ProductHoldingHeader
            {
                ProductHoldingHeaderId = productHoldingHeaderId,
                CustAccount = racId,
                Status = "Inactive",
            }
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(headerResponse);
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<BadRequestException>(async () =>
            await _finOpsService.UpdateRoadsideVehicleAsync(request));
    }

    [TestCase("Toyota", "Corolla", 2020, "ABC123", "toyota", "corolla", 2020, "abc123", ReasonCode.CORREC, TestName = "SameVehicleDetailsDifferentCases")]
    [TestCase("Toyota", "Corolla", 2020, "ABC123", "toyota", "corolla", 2020, "XYZ789", ReasonCode.REGOCH, TestName = "DifferentRegistrationNumbers")]
    [TestCase("Toyota", "Corolla", 2020, "ABC123", "Honda", "Civic", 2020, "ABC123", ReasonCode.REPLVE, TestName = "DifferentMakeAndModel")]
    public async Task UpdateRoadsideVehicle_ShouldSendCorrectReasonCodeInRequest(string originalMake, string originalModel, int originalYear, string originalReg,
                                                                                 string newMake, string newModel, int newYear, string newReg, ReasonCode expectedReasonCode)
    {
        // Arrange
        const string racId = "rac123";
        const string productHoldingHeaderId = "ProductHoldingHeader123";
        const string productHoldingLineId = "ProductHoldingLine123";

        var originalVehicleDetail = new VehicleDetail
        {
            Make = originalMake,
            Model = originalModel,
            Year = originalYear.ToString(),
            RegistrationNumber = originalReg
        };

        var newVehicleDetail = new GraphQLTypes.VehicleDetail
        {
            Make = newMake,
            Model = newModel,
            Year = newYear,
            RegistrationNumber = newReg
        };

        var expectedProductHoldingHeader = new ProductHoldingHeader
        {
            ProductHoldingHeaderId = productHoldingHeaderId,
            CustAccount = racId,
            Status = Constants.FinOps.ActiveStatus,
            ProductHoldingLines =
            [
                new()
                {
                    ProductHoldingId = productHoldingLineId,
                    ProductHoldingVersion = 1,
                    ProductId = "Product123",
                    CanUpdateVehicle = true,
                    VehicleDetail = originalVehicleDetail
                }
            ]
        };

        var productHoldingHeaderResponse = new GetProductHoldingHeaderResponse
        {
            IsSuccess = true,
            Value = expectedProductHoldingHeader
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(productHoldingHeaderResponse);
        MockHttpResponse(responseMessage);

        var request = new UpdateRoadsideVehicleRequest
        {
            RacId = racId,
            Email = email,
            ProductId = productHoldingHeaderId,
            LineId = productHoldingLineId,
            NewVehicleDetail = newVehicleDetail
        };

        HttpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(JsonSerializer.Serialize(productHoldingHeaderResponse))
            })
            .Callback<HttpRequestMessage, CancellationToken>((requestMessage, cancellationToken) =>
            {
                // Capture the request content
                var requestContent = requestMessage?.Content?.ReadAsStringAsync(cancellationToken).Result;
                if (!string.IsNullOrEmpty(requestContent))
                {
                    var updateVehicleRequest = JsonSerializer.Deserialize<UpdateVehicleRequest>(requestContent);

                    // Assert
                    Assert.That(updateVehicleRequest, Is.Not.Null);
                    Assert.That(updateVehicleRequest!.ReasonCode, Is.EqualTo(expectedReasonCode));
                }
            });

        // Act
        await _finOpsService.UpdateRoadsideVehicleAsync(request);
    }
}
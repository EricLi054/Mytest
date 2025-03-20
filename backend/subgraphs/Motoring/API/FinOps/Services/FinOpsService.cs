using System.Text.Json;
using Motoring.API.FinOps.Exceptions;
using Motoring.API.FinOps.Extensions;
using Motoring.API.FinOps.Interfaces;
using Motoring.API.FinOps.Models;
using Motoring.GraphQL.Types;
using Shared.Exceptions;
using Shared.Extensions;
using static Shared.Extensions.HttpClientExtensions;

namespace Motoring.API.FinOps.Services;

public class FinOpsService : IFinOpsService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<FinOpsService> _logger;

    private readonly string _apimBaseUrl;
    private readonly string _productHoldingEndpoint;

    public FinOpsService(HttpClient httpClient, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILogger<FinOpsService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        _apimBaseUrl = _configuration["APIM:BaseUrl"] ?? throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
        _productHoldingEndpoint = _configuration["APIM:ProductHoldingsApiEndpoint"] ?? throw new ArgumentException("APIM:ProductHoldingsApiEndpoint configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<RoadsideProduct> GetRoadsideProductAsync(string productId, string racId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(productId, nameof(productId));
        ArgumentException.ThrowIfNullOrWhiteSpace(racId, nameof(racId));

        _logger.LogInformation("Fetching roadside product with ID [{ProductId}], RacID [{RacId}]", productId, racId);

        var uri = $"{_productHoldingEndpoint}/productholding/{productId}";
        var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
        request.AddRequestHeaders(_httpContextAccessor, _configuration);

        var result = await _httpClient.SendRequestAsync<GetProductHoldingHeaderResponse>(request, productId, _logger);
        if (result == null || result?.Value == null || result.IsSuccess == false)
        {
            _logger.LogWarning("Roadside product with ID [{ProductHoldingHeaderId}] not found.", productId);
            throw new NotFoundException($"Roadside product with ID [{productId}] not found.");
        }
        if (result.Value.CustAccount != racId)
        {
            _logger.LogWarning("Roadside product with ID [{ProductId}] is not owned by RacID [{RacId}].", productId, racId);
            throw new NotFoundException($"Roadside product with ID [{productId}] is not owned by RacID [{racId}].");
        }

        return result.Value.ToRoadsideProduct();
    }

    public async Task<RoadsideProduct> UpdateRoadsideVehicleAsync(UpdateRoadsideVehicleRequest request)
    {
        var racId = request.RacId;
        var productHoldingHeaderId = request.ProductId;
        var productHoldingLineId = request.LineId;
        var newVehicleDetail = request.NewVehicleDetail;
        var email = request.Email;

        ArgumentException.ThrowIfNullOrWhiteSpace(racId, nameof(racId));
        ArgumentException.ThrowIfNullOrWhiteSpace(productHoldingHeaderId, nameof(productHoldingHeaderId));
        ArgumentException.ThrowIfNullOrWhiteSpace(productHoldingLineId, nameof(productHoldingLineId));
        ArgumentException.ThrowIfNullOrWhiteSpace(email, nameof(email));
        ArgumentNullException.ThrowIfNull(newVehicleDetail, nameof(newVehicleDetail));

        _logger.LogInformation("Updating vehicle for roadside product holding with ID [{ProductID}], LineID [{LineId}], RacID [{RacId}].", productHoldingHeaderId, productHoldingLineId, racId);

        var roadsideProductHolding = await GetRoadsideProductAsync(productHoldingHeaderId, racId);

        if (!roadsideProductHolding.IsActive)
        {
            _logger.LogWarning("Roadside product with ID [{RoadsideProductHoldingId}] is not active.", roadsideProductHolding.Id);
            throw new BadRequestException(
                $"Roadside product with ID [{roadsideProductHolding.Id}] is not active.");
        }

        var line = roadsideProductHolding.Lines?.Find(line => line.Id == productHoldingLineId);

        if (line == null)
        {
            _logger.LogWarning("Roadside product line with ID [{LineId}] not found in roadside product with ID [{ProductId}].", productHoldingLineId, roadsideProductHolding.Id);
            throw new NotFoundException($"Roadside product line with ID [{productHoldingLineId}] not found in roadside product with ID [{roadsideProductHolding.Id}].");
        }

        var originalVehicleDetail = line.VehicleDetail;

        var reasonCode = DetermineReasonCode(originalVehicleDetail, newVehicleDetail);

        _logger.LogInformation("Determined reason code [{ReasonCode}] for roadside product line with ID [{LineId}].", reasonCode, line.Id);

        var updateVehicleRequest = new UpdateVehicleRequest
        {
            UserId = email,
            ProductHoldingId = line.Id,
            ProductHoldingVersion = line.Version,
            ReasonCode = reasonCode,
            VehicleDetail = newVehicleDetail.ToFinOpsModel()
        };

        var jsonContent = JsonSerializer.Serialize(updateVehicleRequest);

        var uri = $"{_productHoldingEndpoint}/updatevehicle";
        var httpRequest = CreateInvokeMethodRequest(HttpMethod.Put, _apimBaseUrl, uri, jsonContent);
        httpRequest.AddRequestHeaders(_httpContextAccessor, _configuration);

        var result = await _httpClient.SendRequestAsync<GetProductHoldingHeaderResponse>(httpRequest, line.Id, _logger);

        if (result?.Value == null || !result.IsSuccess || result.Errors?.Count > 0)
        {
            var errorMessage = result?.Errors != null && result.Errors.Count > 0
                ? string.Join(", ", result.Errors)
                : "Unknown error";

            _logger.LogWarning("Vehicle update failed for roadside product line with ID [{LineId}]. Errors [{Errors}].", line.Id, errorMessage);
            throw new UpdateRoadsideVehicleException($"Vehicle update failed for roadside product line with ID [{line.Id}]. Errors: [{errorMessage}].");
        }

        return result.Value.ToRoadsideProduct();
    }

    private static ReasonCode DetermineReasonCode(GraphQL.Types.VehicleDetail? originalVehicleDetail, GraphQL.Types.VehicleDetail newVehicleDetail)
    {
        var isSameVehicle = originalVehicleDetail != null &&
            originalVehicleDetail.Year == newVehicleDetail.Year &&
            string.Equals(originalVehicleDetail.Make, newVehicleDetail.Make, StringComparison.OrdinalIgnoreCase) &&
            string.Equals(originalVehicleDetail.Model, newVehicleDetail.Model, StringComparison.OrdinalIgnoreCase);

        if (!isSameVehicle)
        {
            return ReasonCode.REPLVE; // Replacement vehicle
        }

        if (!string.Equals(originalVehicleDetail?.RegistrationNumber, newVehicleDetail.RegistrationNumber, StringComparison.OrdinalIgnoreCase))
        {
            return ReasonCode.REGOCH; // Registration plate change
        }
        else
        {
            return ReasonCode.CORREC; // Correction
        }
    }
}

using System.Web;
using Motoring.API.Vehicle.Models;
using Motoring.API.Vehicle.Enums;
using Motoring.API.Vehicle.Interfaces;
using Motoring.GraphQL.Enums;
using Motoring.Utils;
using Shared.Extensions;
using Motoring.API.Vehicle.Extensions;
using System.Net;

namespace Motoring.API.Vehicle.Services;

public class VehicleService : IVehicleService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<VehicleService> _logger;

    private readonly string _apimBaseUrl;
    private readonly string _vehicleEndpoint;

    public VehicleService(HttpClient httpClient, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILogger<VehicleService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        _apimBaseUrl = _configuration["APIM:BaseUrl"] ?? throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
        _vehicleEndpoint = _configuration["APIM:VehicleApiEndpoint"] ?? throw new ArgumentException("APIM:VehicleApiEndpoint configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<GraphQL.Types.VehicleDetail?> GetVehicleByRegoAsync(VehicleType vehicleType, string rego, State state)
    {
        rego.ThrowIfNullOrWhiteSpace(nameof(rego));

        _logger.LogInformation("Fetching vehicle details for Rego [{Rego}], VehicleType [{VehicleType}], State [{State}].", rego, vehicleType, state);

        var modelTypeCode = vehicleType switch
        {
            VehicleType.Car => ModelTypeCode.A,
            VehicleType.Motorcycle => ModelTypeCode.B,
            _ => throw new ArgumentOutOfRangeException(nameof(vehicleType), vehicleType, "Invalid vehicle type")
        };

        var environment = Environment.GetEnvironmentVariable(Shared.Constants.Environments.Key) ?? Shared.Constants.Environments.Name.Prd;

        if (environment is Shared.Constants.Environments.Name.Local
            or Shared.Constants.Environments.Name.Dev
            or Shared.Constants.Environments.Name.Sit)
        {
            _logger.LogInformation("Using mock vehicle data for Rego [{Rego}], ModelTypeCode [{ModelTypeCode}], State [{State}].", rego, modelTypeCode, state);

            var result = MockVehicleData.GetMockVehicle(modelTypeCode, rego, state);

            if (result == null)
            {
                _logger.LogWarning("Vehicle details not found for Rego [{Rego}], VehicleType [{VehicleType}], State [{State}].", rego, vehicleType, state);
                return null;
            }

            return result.ToGraphQLType(vehicleType, rego);
        }

        var uriBuilder = new UriBuilder($"{_apimBaseUrl}/{_vehicleEndpoint}/vehicle");
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        query["modelTypeCode"] = modelTypeCode.ToString();
        query["rego"] = rego;
        query["state"] = state.ToString();
        uriBuilder.Query = query.ToString();

        var request = new HttpRequestMessage(HttpMethod.Get, uriBuilder.ToString());
        request.AddRequestHeaders(_httpContextAccessor, _configuration);

        try
        {
            var response = await _httpClient.SendRequestAsync<VehicleDetail>(request, rego, _logger);

            if (response == null)
            {
                _logger.LogWarning("Vehicle details not found for Rego [{Rego}], VehicleType [{VehicleType}], State [{State}].", rego, vehicleType, state);
                return null;
            }

            return response.ToGraphQLType(vehicleType, rego);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            _logger.LogWarning("Vehicle details not found for Rego [{Rego}], VehicleType [{VehicleType}], State [{State}].", rego, vehicleType, state);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching vehicle details for Rego [{Rego}], VehicleType [{VehicleType}], State [{State}].", rego, vehicleType, state);
            throw;
        }
    }

    public async Task<bool> GetHealthStatusAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Checking vehicle service health status.");

        try
        {
            var uri = $"{_apimBaseUrl}/{_vehicleEndpoint}/isalive";
            var request = new HttpRequestMessage(HttpMethod.Get, uri);
            request.AddRequestHeadersForHealthChecks(_httpContextAccessor, _configuration, Constants.DefaultSourceSystem);

            var response = await _httpClient.SendAsync(request, cancellationToken);

            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking vehicle service health status.");
            return false;
        }
    }
}

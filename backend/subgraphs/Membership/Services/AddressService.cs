using Membership.Constants;
using Membership.Interfaces;
using Membership.Types.Address;
using System.Net;
using static Shared.Extensions.HttpClientExtensions;

namespace Membership.Services;

public class AddressService : IAddressService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<AddressService> _logger;
    private readonly string _apimBaseUrl;
    private readonly string _addressServiceEndpoint;

    public AddressService(
        HttpClient httpClient,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor,
        ILogger<AddressService> logger
    )
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor =
            httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _apimBaseUrl =
            _configuration[ConfigurationKeys.BaseUrlKey]
            ?? throw new ArgumentException(
                "APIM:BaseUrl configuration is missing or empty.",
                nameof(_configuration)
            );
        _addressServiceEndpoint =
            _configuration[ConfigurationKeys.AddressManagementApiEndpointKey]
            ?? throw new ArgumentException(
                "APIM:AddressManagementApiEndpoint configuration is missing or empty.",
                nameof(_configuration)
            );
    }

    public async Task<PAFVerification?> GetPafAddressAsync(string moniker)
    {
        var query = string.Format("/paf/search/address/{0}", moniker);
        return await RunQueryAsync<PAFVerification>(query);
    }

    public async Task<AddressLookup?> GetPafAddressListAsync(string partialAddress)
    {
        string query = string.Format("/paf/search?query={0}", partialAddress);
        return await RunQueryAsync<AddressLookup>(query);
    }

    private async Task<T?> RunQueryAsync<T>(string query)
        where T : class
    {
        try
        {
            var uri = $"{_addressServiceEndpoint}{query}";
            var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            return await _httpClient.SendRequestAsync<T>(
                request,
                string.Empty,
                _logger
            );
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            _logger.LogError(ex, ex.Message);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }
}

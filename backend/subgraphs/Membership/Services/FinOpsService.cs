using Membership.Constants;
using Membership.Interfaces;
using Membership.Types.FinOps;
using Shared.Exceptions;
using static Shared.Extensions.HttpClientExtensions;

namespace Membership.Services;

public class FinOpsService : IFinOpsService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<FinOpsService> _logger;

    private readonly string _apimBaseUrl;
    private readonly string _productHoldingEndpoint;

    public FinOpsService(
        HttpClient httpClient,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor,
        ILogger<FinOpsService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        _apimBaseUrl = _configuration[ConfigurationKeys.BaseUrlKey] ?? throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
        _productHoldingEndpoint = _configuration[ConfigurationKeys.ProductHoldingsApiEndpointKey] ?? throw new ArgumentException("APIM:ProductHoldingsApiEndpoint configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<List<ProductHolding>> GetProductHoldingListAsync(string customerAccount)
    {
        try
        {
            string today = DateTime.Now.ToString("yyyy-MM-dd");

            string query = $"?CustAccount={customerAccount}"
             + $"&CompanyId={FinOpsConstants.CompanyId}"
             + $"&FromDate={today}";

            var uri = $"{_productHoldingEndpoint}/productholding{query}";
            var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            var result = await _httpClient.SendRequestAsync<FinOpsResponse<List<ProductHolding>>>(request, string.Empty, _logger) ?? throw new NotFoundException("ProductHolding list not found");

            if (result?.Value == null || !result.IsSuccess)
            {
                _logger.LogError("Failed to get product holding list for {CustomerAccount}", customerAccount);
                return [];
            }

            return result.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }
}
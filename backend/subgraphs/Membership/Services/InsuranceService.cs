using Membership.Constants;
using Membership.Interfaces;
using Membership.Types.Insurance;
using Shared.Exceptions;
using static Shared.Extensions.HttpClientExtensions;

namespace Membership.Services;

// TODO: Migrate to Insurance subgraph - https://rac-wa.atlassian.net/browse/DED-1794
public class InsuranceService : IInsuranceService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<InsuranceService> _logger;
    private readonly string _apimBaseUrl;
    private readonly string _shieldEnvironment;

    public InsuranceService(HttpClient httpClient, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILogger<InsuranceService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _apimBaseUrl = _configuration[ConfigurationKeys.BaseUrlKey] ?? throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
        _shieldEnvironment = _configuration[ConfigurationKeys.InsuranceEnvironment] ?? throw new ArgumentException("Insurance:ShieldEnvironment configuration is missing or empty.", nameof(_shieldEnvironment));
    }

    public async Task<InsurancePortfolioSummary> GetPortfolioSummaryAsync(string shieldContactNumber)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(shieldContactNumber, nameof(shieldContactNumber));
        try
        {
            string query = $"?contactId={shieldContactNumber}";
            var uri = $"/insurance/reference-data/api/v1/pcm/portfolio-summary{query}";

            var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);
            request.AddRequestHeaders(GetInsuranceHeaders());

            var response = await _httpClient.SendRequestAsync<InsurancePortfolioSummary>(request, string.Empty, _logger);
            return response!;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }

    public async Task<Contact> GetContactByExternalShieldNumberAsync(string externalShieldNumber)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(externalShieldNumber, nameof(externalShieldNumber));
        try
        {
            string query = $"?externalNumber={externalShieldNumber}";
            var uri = $"/insurance/contacts/api/v1/contacts{query}";

            var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);
            request.AddRequestHeaders(GetInsuranceHeaders());

            var response = await _httpClient.SendRequestAsync<Contact>(request, string.Empty, _logger);
            return response!;

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }

    public async Task<InsuranceProductResponse> GetInsurancePoliciesAsync(string policyNumber)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(policyNumber, nameof(policyNumber));
        try
        {
            string query = $"?excludeInstallment=false";
            var uri = $"/insurance/policy/api/v1/policies/{policyNumber}/{query}";

            var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);
            request.AddRequestHeaders(GetInsuranceHeaders());

            var response = await _httpClient.SendRequestAsync<InsuranceProductResponse>(request, string.Empty, _logger);
            return response!;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }

    private (string name, string value)[] GetInsuranceHeaders() => new[]
    {
        (InsuranceConstants.ShieldEnvironmentHeaderKey, _shieldEnvironment)
    };

}

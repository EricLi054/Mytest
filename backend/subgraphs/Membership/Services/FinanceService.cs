using Membership.Constants;
using Membership.Interfaces;
using Membership.Types.Finance;
using Shared.Exceptions;
using static Shared.Extensions.HttpClientExtensions;

namespace Membership.Services;

public class FinanceService : IFinanceService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<FinanceService> _logger;

    private readonly string _apimBaseUrl;
    private readonly string _financeLoansEndpoint;
    private readonly string _financeQuotesEndpoint;
    private readonly string _financeOrganisation;

    public FinanceService(
        HttpClient httpClient,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor,
        ILogger<FinanceService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        _apimBaseUrl = _configuration[ConfigurationKeys.BaseUrlKey] ?? throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
        _financeLoansEndpoint = _configuration[ConfigurationKeys.FinanceLoansApiEndpointKey] ?? throw new ArgumentException("APIM:FinanceLoansApiEndpoint configuration is missing or empty.", nameof(_configuration));
        _financeQuotesEndpoint = _configuration[ConfigurationKeys.FinanceQuotesApiEndpointKey] ?? throw new ArgumentException("APIM:FinanceQuotesApiEndpoint configuration is missing or empty.", nameof(_configuration));
        _financeOrganisation = _configuration[ConfigurationKeys.FinanceOrganisation] ?? throw new ArgumentException("Finance:Organisation configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<FinanceProductResponse?> GetProductListAsync(string rimId)
    {
        try
        {
            string query = $"?RIMNumber={rimId}"
             + $"&ServiceId={FinanceConstants.ServiceId}"
             + $"&UserName={FinanceConstants.Username}"
             + $"&Organisation={_financeOrganisation}";

            var uri = $"{_financeLoansEndpoint}/GetProductList{query}";
            var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            return await _httpClient.SendRequestAsync<FinanceProductResponse>(request, string.Empty, _logger)!;
        }
        catch (NotFoundException)
        {
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }

    public async Task<List<FinanceQuote>?> GetFinanceQuotesAsync(string crmId)
    {
        try
        {
            var uri = $"{_financeQuotesEndpoint}/{crmId}/finance-quotes";
            var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            return await _httpClient.SendRequestAsync<List<FinanceQuote>>(request, string.Empty, _logger)!;
        }
        catch (NotFoundException)
        {
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }
}
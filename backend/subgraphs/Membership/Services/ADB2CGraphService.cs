
using Membership.Constants;
using Membership.Interfaces;
using Membership.Types.ADB2CGraph;
using Shared.Extensions;
using System.Text.Json;

namespace Membership.Services;

[Obsolete("Use ADB2CGraphService in the Person subgraph instead.")]
public class ADB2CGraphService : IADB2CGraphService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<ADB2CGraphService> _logger;
    private readonly string _apimBaseUrl;

    public ADB2CGraphService(HttpClient httpClient, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILogger<ADB2CGraphService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _apimBaseUrl = _configuration[ConfigurationKeys.BaseUrlKey] ?? throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<ADB2CAccount?> GetUserByEmailAsync(string emailAddress)
    {
        try
        {
            emailAddress.ThrowIfNullOrWhiteSpace(nameof(emailAddress));

            var maskedEmail = emailAddress.MaskEmail();
            _logger.LogInformation("Fetching ADB2CAccount details for email: {maskedEmail}", maskedEmail);

            const string uri = "/adb2cgraph/v1/user-by-email";
            var jsonContent = JsonSerializer.Serialize(new ADB2CRequest { Email = emailAddress });

            var request = HttpClientExtensions.CreateInvokeMethodRequest(HttpMethod.Post, _apimBaseUrl, uri, jsonContent);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            var accounts = await _httpClient.SendRequestAsync<List<ADB2CAccount>>(request, maskedEmail, _logger);

            if (accounts is null || accounts.Count == 0)
            {
                _logger.LogWarning("ADB2CAccount with email [{Email}] not found.", maskedEmail);
                return null;
            }

            return accounts.FirstOrDefault();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }
}

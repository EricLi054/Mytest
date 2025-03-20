using Person.API.ADB2C.Interfaces;
using Person.GraphQL.Types.ADB2CGraph;
using Shared.Extensions;
using System.Text;
using System.Text.Json;
using static Person.Constants;

namespace Person.API.ADB2C.Services;

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
        _apimBaseUrl = _configuration[ConfigurationKeys.Apim.BaseUrl] ?? throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<ADB2CUserAccount?> GetUserByEmailAsync(string emailAddress)
    {
        try
        {
            emailAddress.ThrowIfNullOrWhiteSpace(nameof(emailAddress));

            var maskedEmail = emailAddress.MaskEmail();
            _logger.LogInformation("Fetching ADB2CAccount details for email: {maskedEmail}", maskedEmail);

            const string uri = "/adb2cgraph/v1/user-by-email";
            var jsonContent = JsonSerializer.Serialize(new ADB2CGetUserRequest { Email = emailAddress });

            var request = HttpClientExtensions.CreateInvokeMethodRequest(HttpMethod.Post, _apimBaseUrl, uri, jsonContent);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            var accounts = await _httpClient.SendRequestAsync<List<ADB2CUserAccount>>(request, maskedEmail, _logger);

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

    public async Task<PatchAdb2cAccountResponse?> UpdateUserCrmIdByAccountIdAsync(string accountId, string crmId)
    {
        try
        {
            _logger.LogInformation("Updating crmId for account: {accountId}", accountId);

            string uri = GetAdb2cUsersUri(accountId);
            var jsonContent = JsonSerializer.Serialize(new UpdateUserCrmIdRequest { CrmId = crmId });
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Patch, new Uri(new Uri(_apimBaseUrl), uri))
            {
                Content = content
            };
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Successfully updated crmId for account: {accountId}", accountId);
                return new PatchAdb2cAccountResponse { IsSuccessful = true };
            }
            else
            {
                _logger.LogWarning("Failed to update crmId for account: {accountId}. Status Code: {StatusCode}", accountId, response.StatusCode);
                return new PatchAdb2cAccountResponse { IsSuccessful = false };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }

    public async Task<ADB2CUserAccount?> UpdateUserEmailByIdAsync(string accountId, string newEmailAddress)
    {
        try
        {
            _logger.LogInformation("Updating email address for account: {accountId}", accountId);

            var uri = GetAdb2cUsersUri(accountId);
            var jsonContent = JsonSerializer.Serialize(new UpdateUserEmailRequest { Email = newEmailAddress });
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Patch, new Uri(new Uri(_apimBaseUrl), uri))
            {
                Content = content
            };
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            var response = await _httpClient.SendAsync(request);

            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to update email address for account: {accountId}. Status Code: {response.StatusCode}.");
            }
            return JsonSerializer.Deserialize<ADB2CUserAccount>(responseContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }

    /// <summary>
    /// Update the URI to include the accountId as a query parameter
    /// </summary>
    /// <param name="accountId"></param>
    /// <returns>Adb2cUsersUri</returns>
    private static string GetAdb2cUsersUri(string accountId)
    {
        return $"/adb2cgraph/v1/users/{accountId}";
    }
}

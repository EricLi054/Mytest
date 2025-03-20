using Membership.Interfaces;
using System.Text.Json;
using static Shared.Extensions.HttpClientExtensions;
using Membership.Types.MemberCards;
using Membership.Constants;
using System.Net;
using Membership.GraphQL.Exceptions;

namespace Membership.Services;

public class MemberCardService : IMemberCardService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<MemberCardService> _logger;
    private readonly string _apimBaseUrl;
    private readonly string _memberCardEndpoint;

    public MemberCardService(
        HttpClient httpClient,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor,
        ILogger<MemberCardService> logger)
    {

        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        _apimBaseUrl = _configuration[ConfigurationKeys.BaseUrlKey] ??
            throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
        _memberCardEndpoint = _configuration[ConfigurationKeys.MemberCardApiEndpointKey] ??
            throw new ArgumentException("APIM:MemberCardApiEndpoint configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<PhysicalCardResponse?> CreatePhysicalCardRequestAsync(string crmId)
    {
        try
        {
            var uri = $"{_memberCardEndpoint}/CreatePhysicalReplacementCard";
            var jsonContent = JsonSerializer.Serialize(new PhysicalCardRequest { MemberId = crmId });

            var request = CreateInvokeMethodRequest(HttpMethod.Post, _apimBaseUrl, uri, jsonContent);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            return await _httpClient.SendRequestAsync<PhysicalCardResponse>(request, crmId, _logger);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.BadRequest)
        {
            _logger.LogError(ex, "Bad request error occurred: {Message}", ex.Message);
            throw new PhysicalCardAlreadyOrdered("A Physical Card has already been ordered.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }

    public async Task<GraphQL.Types.DigitalCardDetails?> RetrieveDigitalCardDetailsAsync(string crmId)
    {
        try
        {
            var uri = $"{_memberCardEndpoint}/RetrieveDigitalCardDetails/{crmId}";

            var request = CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            var response = await _httpClient.SendRequestAsync<DigitalCardDetailsResponse>(request, string.Empty, _logger);

            return response?.Value != null ?
                new GraphQL.Types.DigitalCardDetails
                {
                    Id = response.Value.Id,
                    PassId = response.Value.DigitalCardPassId,
                    PassUrl = response.Value.DigitalCardPassUrl,
                    IsActive = response.Value.DigitalCardPassIsActive,
                    NumberOfPassesInstalled = response.Value.NumberOfPassesInstalled
                } : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }
    }
}

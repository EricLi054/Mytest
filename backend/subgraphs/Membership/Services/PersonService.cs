using Membership.Constants;
using Membership.GraphQL.Types;
using Membership.Interfaces;
using Membership.Types.Person;
using Shared.Exceptions;
using Shared.Extensions;

namespace Membership.Services;

public class PersonService : IPersonService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<PersonService> _logger;

    private readonly string _apimBaseUrl;
    private readonly string _personEndpoint;

    public PersonService(HttpClient httpClient, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILogger<PersonService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        _apimBaseUrl = _configuration[ConfigurationKeys.BaseUrlKey] ?? throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
        _personEndpoint = _configuration[ConfigurationKeys.PersonApiEndpointKey] ?? throw new ArgumentException("APIM:PersonApiEndpoint configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<Person> GetPersonAsync(string crmId)
    {
        crmId.ThrowIfNullOrWhiteSpace(nameof(crmId));
        _logger.LogInformation("Fetching person details for crmId: {crmId}", crmId);

        var uri = $"{_personEndpoint}/person/{crmId}";

        var request = HttpClientExtensions.CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
        request.AddRequestHeaders(_httpContextAccessor, _configuration);

        var person = await _httpClient.SendRequestAsync<Person>(request, crmId, _logger);

        if (person is null)
        {
            _logger.LogWarning("Person with CRM ID [{CrmId}] not found.", crmId);
            throw new NotFoundException("Person not found");
        }

        return person;
    }

    public async Task<List<PersonProductHolding>?> GetPersonProductsAsync(string crmId)
    {
        try
        {
            crmId.ThrowIfNullOrWhiteSpace(nameof(crmId));

            var uri = $"{_personEndpoint}/products?personIdList={crmId}";

            var request = HttpClientExtensions.CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
            request.AddRequestHeaders(_httpContextAccessor, _configuration);

            var result = await _httpClient.SendRequestAsync<PersonProducts>(request, crmId, _logger);

            return result?.ProductHoldings;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting person products: {message}", ex.Message);
            throw;
        }
    }
}

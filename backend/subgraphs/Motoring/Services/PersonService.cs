using Shared.Extensions;
using Motoring.Interfaces;
using Shared.Exceptions;
using Motoring.GraphQL.Types;

namespace Motoring.Services;

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

        _apimBaseUrl = _configuration["APIM:BaseUrl"] ?? throw new ArgumentException("APIM:BaseUrl configuration is missing or empty.", nameof(_configuration));
        _personEndpoint = _configuration["APIM:PersonApiEndpoint"] ?? throw new ArgumentException("APIM:PersonApiEndpoint configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<string> GetRacIdAsync(string crmId)
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

        return person.RacId;
    }
}


using Person.API.Person.Interfaces;
using Person.API.Person.Models;
using Person.GraphQL.Types;
using PersonType = Person.GraphQL.Types.Person;
using Shared.Constants;
using Shared.Exceptions;
using Shared.Extensions;
using System.Net;
using System.Reflection;
using System.Text.Json;
using static Person.Constants;

namespace Person.API.Person.Services;

/// <inheritdoc cref="IPersonService"/>
public class PersonService : IPersonService
{
    private const string ServiceName = nameof(PersonService);

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

        _apimBaseUrl = _configuration[ConfigurationKeys.Apim.BaseUrl]
                        ?? throw new ArgumentException($"{ConfigurationKeys.Apim.BaseUrl} configuration is missing or empty.", nameof(_configuration));
        _personEndpoint = _configuration[ConfigurationKeys.Apim.PersonApiEndpoint]
                        ?? throw new ArgumentException($"{ConfigurationKeys.Apim.PersonApiEndpoint} configuration is missing or empty.", nameof(_configuration));
    }

    public async Task<PersonType> GetPersonAsync(string crmId)
    {
        crmId.ThrowIfNullOrWhiteSpace(nameof(crmId));

        var uri = $"{_personEndpoint}/person/{crmId}";
        var request = HttpClientExtensions.CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
        request.AddRequestHeaders(_httpContextAccessor, _configuration);
        var correlationId = request.TryGetHeaderValue(Headers.CorrelationId);

        _logger.LogInformation(
            "[{ServiceName}] Fetching person details for CrmID [{CrmID}] with CorrelationID [{CorrelationID}]",
            ServiceName, crmId, correlationId);

        var person = await _httpClient.SendRequestAsync<PersonType>(request, crmId, _logger);

        if (person is null)
        {
            _logger.LogWarning(
                "[{ServiceName}] Person with CRM ID [{CrmId}] not found for request with CorrelationID [{CorrelationID}].",
                ServiceName, crmId, correlationId);
            throw new NotFoundException($"[{ServiceName}] Person not found");
        }

        return person;
    }

    public async Task<MatchedPerson?> GetMatchPersonAsync(MatchPersonRequest request)
    {
        request.FirstName.ThrowIfNullOrWhiteSpace(nameof(request.FirstName));
        request.Surname.ThrowIfNullOrWhiteSpace(nameof(request.Surname));
        request.DateOfBirth.ThrowIfNullOrWhiteSpace(nameof(request.DateOfBirth));

        if (string.IsNullOrWhiteSpace(request.RacId) &&
            string.IsNullOrWhiteSpace(request.ProductNumber) &&
            string.IsNullOrWhiteSpace(request.MobilePhone))
        {
            throw new ArgumentException($"[{ServiceName}] At least one Match Identification Method must be provided.");
        }

        var uriBuilder = new UriBuilder($"{_apimBaseUrl}/{_personEndpoint}/Match?");
        var query = System.Web.HttpUtility.ParseQueryString(string.Empty);

        query["FirstName"] = request.FirstName;
        query["DateOfBirth"] = request.DateOfBirth;
        query["Surname"] = request.Surname;
        if (!string.IsNullOrWhiteSpace(request.RacId))
        {
            query["RacId"] = request.RacId;
        }
        if (!string.IsNullOrWhiteSpace(request.ProductNumber))
        {
            query["ProductNumber"] = request.ProductNumber;
        }
        if (!string.IsNullOrWhiteSpace(request.MobilePhone))
        {
            query["MobilePhone"] = request.MobilePhone;
        }

        uriBuilder.Query = query.ToString();

        var httpRequest = new HttpRequestMessage(HttpMethod.Get, uriBuilder.Uri);
        httpRequest.AddRequestHeaders(_httpContextAccessor, _configuration);

        var correlationId = httpRequest.TryGetHeaderValue(Headers.CorrelationId);
        var matchIdentificationMethodQueryParams = GetMatchIdentificationMethodQueryParams();

        try
        {
            _logger.LogInformation(
                "[{ServiceName}] Calling Person API Match endpoint with CorrelationId [{CorrelationId}] and Match Identification Method query param(s): {matchIdentificationMethodQueryParams}",
                ServiceName, correlationId, matchIdentificationMethodQueryParams);

            return await _httpClient.SendRequestAsync<MatchedPerson>(httpRequest, uriBuilder.GetHashCode().ToString(), _logger);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            _logger.LogError(ex,
                "[{ServiceName}] Match person failed for CorrelationId [{CorrelationId}]: {NoMatchException}",
                ServiceName, correlationId, nameof(NoMatchException));
            throw new NoMatchException(ex.Message);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
        {
            _logger.LogError(ex,
                "[{ServiceName}] Match person failed for CorrelationId [{CorrelationId}]: {DuplicateMatchException}",
                ServiceName, correlationId, nameof(DuplicateMatchException));
            throw new DuplicateMatchException(ex.Message);
        }
        catch (Exception e)
        {
            _logger.LogError(e,
               "[{ServiceName}] Match person failed for CorrelationId [{CorrelationId}]",
               ServiceName, correlationId);
            throw;
        }

        // Match Identification Method is either MobilePhone, MembershipNumber or PolicyNumber.
        // Do not log any Personally Identifiable Information (PII), eg FirstName/Surname/DateOfBirth/MobilePhone.
        string GetMatchIdentificationMethodQueryParams()
        {
            var queryParams = string.Empty;
            var filteredProperties = request.GetType()
                .GetProperties()
                .OrderBy(p => p.Name)
                .Where(p => p.Name
                    is nameof(MatchPersonRequest.MobilePhone)
                    or nameof(MatchPersonRequest.ProductNumber)
                    or nameof(MatchPersonRequest.RacId));

            foreach (PropertyInfo property in filteredProperties)
            {
                var value = property.GetValue(request)?.ToString();
                if (string.IsNullOrWhiteSpace(value))
                {
                    break;
                }
                var name = property.Name;
                var param = $"[{name}{(name == nameof(MatchPersonRequest.MobilePhone) ? "" : $": {value}")}]";
                queryParams = string.Join(" ", queryParams, param);
            }

            return queryParams.Trim();
        }
    }

    public async Task<PersonType?> UpdatePersonAsync(UpdatePersonRequest request, string crmId)
    {
        crmId.ThrowIfNullOrWhiteSpace(nameof(crmId));

        var uri = $"{_personEndpoint}/person/{crmId}";
        var jsonContent = JsonSerializer.Serialize(request);

        var updateRequest = HttpClientExtensions.CreateInvokeMethodRequest(HttpMethod.Put, _apimBaseUrl, uri, jsonContent);
        updateRequest.AddRequestHeaders(_httpContextAccessor, _configuration);
        var correlationId = updateRequest.TryGetHeaderValue(Headers.CorrelationId);

        try
        {
            _logger.LogInformation(
                "[{ServiceName}] Updating person details for CrmID [{CrmID}] with CorrelationID [{CorrelationID}]",
                ServiceName, crmId, correlationId);

            return await _httpClient.SendRequestAsync<PersonType>(updateRequest, crmId, _logger);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "[{ServiceName}] An unexpected error occurred while updating person for CRM ID [{CrmId}] with CorrelationID [{CorrelationID}]",
                ServiceName, crmId, correlationId);
            throw;
        }
    }

    public async Task<bool> GetHealthStatusAsync(CancellationToken cancellationToken = new())
    {
        var uri = $"{_personEndpoint}/isalive";
        var request = HttpClientExtensions.CreateInvokeMethodRequest(HttpMethod.Get, _apimBaseUrl, uri);
        request.AddRequestHeadersForHealthChecks(_httpContextAccessor, _configuration, DefaultSourceSystem);
        var correlationId = request.TryGetHeaderValue(Headers.CorrelationId);

        try
        {
            _logger.LogInformation(
                "[{ServiceName}] Calling health check with CorrelationID [{CorrelationID}]",
                ServiceName, correlationId);

            var response = await _httpClient.SendAsync(request, cancellationToken);

            _logger.LogInformation(
                "[{ServiceName}] Health check response status code for CorrelationID [{CorrelationID}]: {StatusCode}",
                ServiceName, correlationId, response.StatusCode);

            var isAlive = response.StatusCode == HttpStatusCode.NoContent;

            _logger.LogInformation(
                "[{ServiceName}] Service is alive for CorrelationID [{CorrelationID}]: {IsAlive}",
                ServiceName, correlationId, isAlive);

            return isAlive;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex,
                "[{ServiceName}] HTTP request error while calling health check with CorrelationID [{CorrelationID}]",
                ServiceName, correlationId);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "[{ServiceName}] An unexpected error occurred while calling health check with CorrelationID [{CorrelationID}]",
                ServiceName, correlationId);
            throw;
        }
    }
}

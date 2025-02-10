using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.API.Tests.Services;
public class DaprServiceTests
{
    private IConfiguration _configuration;
    private IHttpContextAccessor _httpContextAccessor;
    private ILogger<DaprService> _logger;
    [SetUp]
    public void SetUp()
    {
        _configuration = Substitute.For<IConfiguration>();
        _httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        _logger = Substitute.For<ILogger<DaprService>>();
    }


    [Test]
    public async Task InvokeDaprGetMethodAsync_InvokesWithPersonReturnsCorrectResult()
    {
        // Arrange
        var url = "http://localhost";
        var endpoint = "/test";
        _configuration[ConfigDescriptors.CORRELATION_ID_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.APIM_SUBSCRIPTION_KEY_HEADER_KEY] = "HeaderValue";

        var person = new Person { FirstName = "John" };
        var personJson = JsonSerializer.Serialize(person);

        var messageHandler = new MockHttpMessageHandler(personJson, HttpStatusCode.OK);
        var _httpClient = new HttpClient(messageHandler);
        var _daprService = new DaprService(_httpClient, _configuration, _httpContextAccessor, _logger);
        // Act
        var result = await _daprService.InvokeDaprGetMethodAsync<Person>(url, endpoint);
        // Assert
        Assert.That(result.FirstName, Is.EqualTo(person.FirstName));
        Assert.That(messageHandler.NumberOfCalls, Is.EqualTo(1));
    }
    [Test]
    public async Task InvokeDaprGetMethodAsync_StringResultHandledCorrectly()
    {
        // Arrange
        var url = "http://localhost";
        var endpoint = "/test";
        _configuration[ConfigDescriptors.CORRELATION_ID_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.APIM_SUBSCRIPTION_KEY_HEADER_KEY] = "HeaderValue";

        var mockPersonResponse = "Unusual text response";

        var messageHandler = new MockHttpMessageHandler(mockPersonResponse, HttpStatusCode.OK, "text/plain");
        var _httpClient = new HttpClient(messageHandler);
        var _daprService = new DaprService(_httpClient, _configuration, _httpContextAccessor, _logger);
        // Act
        var result = await _daprService.InvokeDaprGetMethodAsync<string>(url, endpoint);
        // Assert
        Assert.That(result, Is.EqualTo(mockPersonResponse));
        Assert.That(messageHandler.NumberOfCalls, Is.EqualTo(1));
    }
    [Test]
    public async Task InvokeDaprPutMethodAsync_PersonResultHandledCorrectly()
    {
        // Arrange
        var url = "http://localhost";
        var endpoint = "/test";
        _configuration[ConfigDescriptors.CORRELATION_ID_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.APIM_SUBSCRIPTION_KEY_HEADER_KEY] = "HeaderValue";

        var person = new Person { FirstName = "John" };
        var personJson = JsonSerializer.Serialize(person);

        var messageHandler = new MockHttpMessageHandler(personJson, HttpStatusCode.OK);
        var _httpClient = new HttpClient(messageHandler);
        var _daprService = new DaprService(_httpClient, _configuration, _httpContextAccessor, _logger);

        var updatedPerson = new PersonUpdateMutation { FirstName = "John" };

        // Act
        var result = await _daprService.InvokeDaprPutMethodAsync<Person, PersonUpdateMutation>(url, endpoint, updatedPerson);
        // Assert
        Assert.That(result.FirstName, Is.EqualTo(person.FirstName));
        Assert.That(messageHandler.NumberOfCalls, Is.EqualTo(1));
    }
    [Test]
    public async Task InvokeDaprPutMethodAsync_UsesDefaultSourceSystemCorrectly()
    {
        // Arrange
        var url = "http://localhost";
        var endpoint = "/test";
        _configuration[ConfigDescriptors.CORRELATION_ID_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.APIM_SUBSCRIPTION_KEY_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY] = "SourceSystem";
        _configuration[ConfigDescriptors.APP_SOURCE_SYSTEM] = "DefaultSourceSystem";

        var person = new Person { FirstName = "John" };
        var personJson = JsonSerializer.Serialize(person);

        var messageHandler = new MockHttpMessageHandler(personJson, HttpStatusCode.OK);
        var _httpClient = new HttpClient(messageHandler);
        var _daprService = new DaprService(_httpClient, _configuration, _httpContextAccessor, _logger);

        var updatedPerson = new PersonUpdateMutation { FirstName = "John" };

        // Act
        var result = await _daprService.InvokeDaprPutMethodAsync<Person, PersonUpdateMutation>(url, endpoint, updatedPerson);
        // Assert
        Assert.That(result.FirstName, Is.EqualTo(person.FirstName));
        Assert.That(messageHandler.NumberOfCalls, Is.EqualTo(1));
        Assert.That(messageHandler.Headers?.First(x => x.Key.Equals(_configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY])).Value.First(), Is.EqualTo("DefaultSourceSystem"));
    }
    [Test]
    public async Task InvokeDaprPutMethodAsync_UsesOverrideSourceSystemCorrectly()
    {
        // Arrange
        var url = "http://localhost";
        var endpoint = "/test";
        _configuration[ConfigDescriptors.CORRELATION_ID_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.APIM_SUBSCRIPTION_KEY_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY] = "SourceSystem";
        _configuration[ConfigDescriptors.APP_SOURCE_SYSTEM] = "DefaultSourceSystem";
        _httpContextAccessor.HttpContext = new DefaultHttpContext();
        _httpContextAccessor.HttpContext.Request.Headers[_configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY]!] = "OverrideSourceSystem";

        var person = new Person { FirstName = "John" };
        var personJson = JsonSerializer.Serialize(person);

        var messageHandler = new MockHttpMessageHandler(personJson, HttpStatusCode.OK);
        var _httpClient = new HttpClient(messageHandler);
        var _daprService = new DaprService(_httpClient, _configuration, _httpContextAccessor, _logger);

        var updatedPerson = new PersonUpdateMutation { FirstName = "John" };

        // Act
        var result = await _daprService.InvokeDaprPutMethodAsync<Person, PersonUpdateMutation>(url, endpoint, updatedPerson);
        // Assert
        Assert.That(result.FirstName, Is.EqualTo(person.FirstName));
        Assert.That(messageHandler.NumberOfCalls, Is.EqualTo(1));
        Assert.That(messageHandler.Headers?.First(x => x.Key.Equals(_configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY])).Value.First(), Is.EqualTo("OverrideSourceSystem"));
    }
    [Test]
    public async Task InvokeDaprPutMethodAsync_UsesNoRetryHeaderCorrectly()
    {
        // Arrange
        var url = "http://localhost";
        var endpoint = "/test";
        _configuration[ConfigDescriptors.CORRELATION_ID_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.APIM_SUBSCRIPTION_KEY_HEADER_KEY] = "HeaderValue";
        _configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY] = "SourceSystem";
        _configuration[ConfigDescriptors.APP_SOURCE_SYSTEM] = "DefaultSourceSystem";
        _httpContextAccessor.HttpContext = new DefaultHttpContext();
        _httpContextAccessor.HttpContext.Request.Headers["NoRetry"] = bool.TrueString;

        var person = new Person { FirstName = "John" };
        var personJson = JsonSerializer.Serialize(person);

        var messageHandler = new MockHttpMessageHandler(personJson, HttpStatusCode.OK);
        var _httpClient = new HttpClient(messageHandler);
        var _daprService = new DaprService(_httpClient, _configuration, _httpContextAccessor, _logger);

        var updatedPerson = new PersonUpdateMutation { FirstName = "John" };

        // Act
        var result = await _daprService.InvokeDaprPutMethodAsync<Person, PersonUpdateMutation>(url, endpoint, updatedPerson);
        // Assert
        Assert.That(result.FirstName, Is.EqualTo(person.FirstName));
        Assert.That(messageHandler.NumberOfCalls, Is.EqualTo(1));
        Assert.That(messageHandler.Headers?.First(x => x.Key.Equals("NoRetry")).Value.First(), Is.EqualTo(bool.TrueString));
    }
}
public class MockHttpMessageHandler(string response, HttpStatusCode statusCode, string mediaType = "application/json") : HttpMessageHandler
{
    public string Input { get; private set; } = string.Empty;
    public int NumberOfCalls { get; private set; }
    public HttpRequestHeaders? Headers { get; private set; }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        NumberOfCalls++;
        if (request.Content != null) // Could be a GET-request without a body
        {
            Input = await request.Content.ReadAsStringAsync(cancellationToken);
        }
        if (request.Headers != null) // Could be a GET-request without a body
        {
            Headers = request.Headers;
        }
        return new HttpResponseMessage
        {
            StatusCode = statusCode,
            Content = new StringContent(response, Encoding.UTF8, new MediaTypeHeaderValue(mediaType))
        };
    }
}
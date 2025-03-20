using Motoring.GraphQL.Types;
using Motoring.Services;
using Shared.Tests.Helpers;

namespace Motoring.Tests.Services;

[TestFixture]
public class PersonServiceTests : BaseServiceTests<PersonService>
{
    private PersonService _personService = null!;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.PersonApiEndpointKey, "/person");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "EXAMPLEAPIKEY");

        _personService = new PersonService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object, LoggerMock.Object);
    }

    [Test]
    public async Task GetRacIdAsync_ShouldReturnPerson_WhenSuccessful()
    {
        const string crmId = "crm123";

        var expectedPerson = new Person { PersonId = "person123", RacId = "rac123" };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedPerson);
        MockHttpResponse(responseMessage);

        var result = await _personService.GetRacIdAsync(crmId);

        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedPerson.RacId));
    }

    [Test]
    public void GetRacIdAsync_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        const string crmId = "crm123";

        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () => await _personService.GetRacIdAsync(crmId));
    }

    [Test]
    public void GetRacIdAsync_ShouldThrowArgumentException_WhenCrmIdIsWhiteSpaceOrEmpty()
    {
        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.GetRacIdAsync(""));
        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.GetRacIdAsync("   "));
    }
}
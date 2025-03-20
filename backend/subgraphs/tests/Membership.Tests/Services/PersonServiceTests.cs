using Membership.Services;
using Membership.GraphQL.Types;
using Membership.Types.Person;
using Shared.Tests.Helpers;
using System.Text.Json;

namespace Membership.Tests.Services;


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
    public async Task GetPersonAsync_ShouldReturnPerson_WhenSuccessful()
    {
        const string crmId = "crm123";

        var expectedPerson = new Person { PersonId = "person123", RacId = "rac123" };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedPerson);
        MockHttpResponse(responseMessage);

        var result = await _personService.GetPersonAsync(crmId);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.PersonId, Is.EqualTo(expectedPerson.PersonId));
            Assert.That(result.RacId, Is.EqualTo(expectedPerson.RacId));
        });
    }

    [Test]
    public void GetPersonAsync_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        const string crmId = "crm123";

        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () => await _personService.GetPersonAsync(crmId));
    }

    [Test]
    public void GetPersonAsync_ShouldThrowArgumentException_WhenCrmIdIsWhiteSpaceOrEmpty()
    {
        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.GetPersonAsync(""));
        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.GetPersonAsync("   "));
    }

    [Test]
    public async Task GetPersonProductsAsync_ValidCrmId_ReturnsProducts()
    {
        const string crmId = "crm123";

        PersonProducts expectedProducts = new()
        {
            ProductHoldings =
            [
                new PersonProductHolding()
                {
                    ProductId = new Guid(),
                    SourceId = "17269478",
                    ProductBusinessType = "Insurance"
                }
            ]
        };


        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedProducts);
        MockHttpResponse(responseMessage);

        var result = await _personService.GetPersonProductsAsync(crmId);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(JsonSerializer.Serialize(result), Is.EqualTo(JsonSerializer.Serialize(expectedProducts.ProductHoldings)));
        });
    }
}
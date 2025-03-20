using Microsoft.Extensions.Logging;
using Moq;
using Person.API.Person.Models;
using Person.API.Person.Services;
using Person.GraphQL.Types;
using Shared.Exceptions;
using Shared.Tests.Helpers;
using System.Collections;
using System.Net;
using PersonType = Person.GraphQL.Types.Person;

namespace Person.Tests.API.Person.Services;

[TestFixture]
public class PersonServiceTests : BaseServiceTests<PersonService>
{
    private const string ServiceName = nameof(PersonService);
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

        var expectedPerson = new PersonType { PersonId = "person123", RacId = "rac123", FirstName = "John" };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(expectedPerson);
        MockHttpResponse(responseMessage);

        var result = await _personService.GetPersonAsync(crmId);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.PersonId, Is.EqualTo(expectedPerson.PersonId));
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

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void GetPersonAsync_ShouldThrowArgumentException_WhenCrmIdIsWhiteSpaceOrEmptyOrNull(string crmId)
    {
        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.GetPersonAsync(crmId));
    }

    [TestCase("0400000000", "Member")]
    [TestCase(null, "Member")]
    [TestCase("0400000000", null)]
    public async Task GetMatchPerson_ShouldReturnMatchedPerson_WhenSuccessful(string? mobilePhone, string? membershipType)
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = "1990-01-01",
            MobilePhone = "0400000000",
            RacId = "rac123",
            ProductNumber = "prod123"
        };
        var expectedMatchedPerson = new MatchedPerson
        {
            PersonId = "person123",
            RacId = "rac123",
            FirstName = "Anurag",
            MobilePhone = mobilePhone,
            MembershipType = membershipType
        };
        MockHttpResponse(HttpResponseHelper.CreateHttpResponseMessage(expectedMatchedPerson));

        var result = await _personService.GetMatchPersonAsync(request);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.PersonId, Is.EqualTo(expectedMatchedPerson.PersonId));
            Assert.That(result.RacId, Is.EqualTo(expectedMatchedPerson.RacId));
            Assert.That(result.FirstName, Is.EqualTo(expectedMatchedPerson.FirstName));
            Assert.That(result.MobilePhone, Is.EqualTo(expectedMatchedPerson.MobilePhone));
            Assert.That(result.MembershipType, Is.EqualTo(expectedMatchedPerson.MembershipType));
        });
        LoggerMock.VerifyLog(LogLevel.Information,
            $"[{ServiceName}] Calling Person API Match endpoint with CorrelationId [{TestCorrelationId}] and Match Identification Method query param(s): [MobilePhone] [ProductNumber: {request.ProductNumber}] [RacId: {request.RacId}]",
            Times.Once);
    }

    [Test]
    public void GetMatchPerson_ShouldThrowArgumentException_WhenCalledWithoutAnyMatchIdentificationMethod()
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = "1990-01-01"
        };

        var ex = Assert.ThrowsAsync<ArgumentException>(async () => await _personService.GetMatchPersonAsync(request));
        Assert.That(ex!.Message, Is.EqualTo($"[{ServiceName}] At least one Match Identification Method must be provided."));
    }

    [Test]
    public void GetMatchPerson_ShouldNotThrow_WhenCalledWithMobileNumberMatchIdentificationMethod()
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = "1990-01-01",
            MobilePhone = "0400000000"
        };
        var expectedMatchedPerson = new MatchedPerson
        {
            PersonId = "person123",
            RacId = "rac123",
            FirstName = "Anurag"
        };
        MockHttpResponse(HttpResponseHelper.CreateHttpResponseMessage(expectedMatchedPerson));

        Assert.DoesNotThrowAsync(async () => await _personService.GetMatchPersonAsync(request));
    }

    [Test]
    public void GetMatchPerson_ShouldNotThrow_WhenCalledWithRaciIdMatchIdentificationMethod()
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = "1990-01-01",
            RacId = "0123456789"
        };
        var expectedMatchedPerson = new MatchedPerson
        {
            PersonId = "person123",
            RacId = "rac123",
            FirstName = "Anurag"
        };
        MockHttpResponse(HttpResponseHelper.CreateHttpResponseMessage(expectedMatchedPerson));

        Assert.DoesNotThrowAsync(async () => await _personService.GetMatchPersonAsync(request));
    }

    [Test]
    public void GetMatchPerson_ShouldNotThrow_WhenCalledWithProductNumberMatchIdentificationMethod()
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = "1990-01-01",
            ProductNumber = "MGP12345678"
        };
        var expectedMatchedPerson = new MatchedPerson
        {
            PersonId = "person123",
            RacId = "rac123",
            FirstName = "Anurag"
        };
        MockHttpResponse(HttpResponseHelper.CreateHttpResponseMessage(expectedMatchedPerson));

        Assert.DoesNotThrowAsync(async () => await _personService.GetMatchPersonAsync(request));
    }

    [Test]
    public void GetMatchPerson_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = "1990-01-01",
            MobilePhone = "1234567890",
            RacId = "rac123",
            ProductNumber = "prod123"
        };
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () => await _personService.GetMatchPersonAsync(request));
    }

    [Test]
    public void GetMatchPersonAsync_ShouldThrowNoMatchException_WhenRequestFailsWithNotFoundStatusCode()
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = "1990-01-01",
            MobilePhone = "1234567890",
            RacId = "rac123",
            ProductNumber = "prod123"
        };
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed", HttpStatusCode.NotFound);

        Assert.ThrowsAsync<NoMatchException>(async () => await _personService.GetMatchPersonAsync(request));
    }

    [Test]
    public void GetMatchPersonAsync_ShouldThrowDuplicateMatchException_WhenRequestFailsWithConflictStatusCode()
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = "1990-01-01",
            MobilePhone = "1234567890",
            RacId = "rac123",
            ProductNumber = "prod123"
        };
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed", HttpStatusCode.Conflict);

        Assert.ThrowsAsync<DuplicateMatchException>(async () => await _personService.GetMatchPersonAsync(request));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void GetMatchPerson_ShouldThrowArgumentException_WhenFirstNameIsWhiteSpaceOrEmptyOrNull(string firstName)
    {
        var request = new MatchPersonRequest
        {
            FirstName = firstName,
            Surname = "Sharma",
            DateOfBirth = "1990-01-01",
            MobilePhone = "1234567890",
            RacId = "rac123",
            ProductNumber = "prod123"
        };
        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.GetMatchPersonAsync(request));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void GetMatchPerson_ShouldThrowArgumentException_WhenSurnameIsWhiteSpaceOrEmptyOrNull(string surname)
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = surname,
            DateOfBirth = "1990-01-01",
            MobilePhone = "1234567890",
            RacId = "rac123",
            ProductNumber = "prod123"
        };
        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.GetMatchPersonAsync(request));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void GetMatchPerson_ShouldThrowArgumentException_WhenDateOfBirthIsWhiteSpaceOrEmptyOrNull(string dateOfBirth)
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = dateOfBirth,
            MobilePhone = "1234567890",
            RacId = "rac123",
            ProductNumber = "prod123"
        };
        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.GetMatchPersonAsync(request));
    }

    [TestCaseSource(nameof(CustomExceptionTestCases))]
    public void GetMatchPerson_ShouldThrowCustomException_WhenCustomExceptionIsTriggered(Type exceptionType, Exception exception, HttpStatusCode statusCode)
    {
        var request = new MatchPersonRequest
        {
            FirstName = "Anurag",
            Surname = "Sharma",
            DateOfBirth = "1990-01-01",
            MobilePhone = "1234567890",
            RacId = "rac123",
            ProductNumber = "prod123"
        };

        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, exception);

        if (exceptionType == typeof(NoMatchException))
        {
            Assert.ThrowsAsync<NoMatchException>(async () => await _personService.GetMatchPersonAsync(request));
        }
        else if (exceptionType == typeof(DuplicateMatchException))
        {
            Assert.ThrowsAsync<DuplicateMatchException>(async () => await _personService.GetMatchPersonAsync(request));
        }

    }

    [TestCase(HttpStatusCode.NoContent, true)]
    [TestCase(HttpStatusCode.InternalServerError, false)]
    public async Task GetHealthStatusAsync_ShouldReturnPersonHealthStatus_WhenSuccessful(HttpStatusCode status, bool isAlive)
    {
        MockHttpResponse(HttpResponseHelper.CreateHttpResponseMessage(status));

        var result = await _personService.GetHealthStatusAsync();

        Assert.That(result, Is.EqualTo(isAlive));
    }

    private static UpdatePersonRequest CreateUpdatePersonRequest()
    {
        return new UpdatePersonRequest
        {
            Title = "Mx",
            FirstName = "John2",
            MiddleName = "Smith2",
            Surname = "Doe2",
            MobilePhone = "1234567890",
            HomePhone = "0412345678",
            WorkPhone = "",
            PersonalEmailAddress = "abc@xyz.com",
            PostalAddress = new Address
            {
                HouseNumber = "831",
                StreetName = "Wellington St",
                Suburb = "Perth",
                State = "WA",
                Country = "Australia"
            }
        };
    }

    private static PersonType CreateUpdatedPerson()
    {
        return new PersonType
        {
            PersonId = "person123",
            RacId = "rac123",
            Title = "Mx",
            FirstName = "John2",
            MiddleName = "Smith2",
            Surname = "Doe2",
            MobilePhone = "1234567890",
            HomePhone = "0412345678",
            WorkPhone = "",
            PersonalEmailAddress = "abc@xyz.com",
            PostalAddress = new Address
            {
                HouseNumber = "831",
                StreetName = "Wellington St",
                Suburb = "Perth",
                State = "WA",
                Country = "Australia"
            }
        };
    }

    [Test]
    public void UpdatePerson_ShouldThrowHttpRequestException_WhenRequestFails()
    {
        var request = CreateUpdatePersonRequest();
        HttpResponseHelper.MockHttpException(HttpMessageHandlerMock, "Request failed");

        Assert.ThrowsAsync<HttpRequestException>(async () => await _personService.UpdatePersonAsync(request, "crm123"));
    }

    [TestCaseSource(typeof(TestCases.String), nameof(TestCases.String.NullEmptyWhiteSpace))]
    public void UpdatePerson_ShouldThrowArgumentException_WhenCrmIdIsWhiteSpaceOrEmptyOrNull(string crmId)
    {
        var request = CreateUpdatePersonRequest();

        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.UpdatePersonAsync(request, crmId));
    }

    [Test]
    public async Task UpdatePerson_ShouldReturnUpdatedPerson_WhenSuccessful()
    {
        const string crmId = "crm123";

        var request = CreateUpdatePersonRequest();
        var expectedPerson = CreateUpdatedPerson();

        MockHttpResponse(HttpResponseHelper.CreateHttpResponseMessage(expectedPerson));

        var result = await _personService.UpdatePersonAsync(request, crmId);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.PersonId, Is.EqualTo(expectedPerson.PersonId));
            Assert.That(result.RacId, Is.EqualTo(expectedPerson.RacId));
            Assert.That(result.FirstName, Is.EqualTo(request.FirstName));
            Assert.That(result.Title, Is.EqualTo(request.Title));
            Assert.That(result.Surname, Is.EqualTo(request.Surname));
            Assert.That(result.PostalAddress?.HouseNumber, Is.EqualTo(request.PostalAddress?.HouseNumber));
        });
    }

    [Test]
    public void UpdatePerson_ShouldHttpRequestException_WhenPersonDoesNotExist()
    {
        const string crmId = "crm123";

        var notFoundResponse = new HttpResponseMessage
        {
            StatusCode = HttpStatusCode.NotFound,
            Content = null
        };
        MockHttpResponse(notFoundResponse);

        var request = CreateUpdatePersonRequest();

        var exception = Assert.ThrowsAsync<HttpRequestException>(async () =>
            await _personService.UpdatePersonAsync(request, crmId));
        Assert.That(exception.Message, Is.EqualTo("Response status code does not indicate success: 404 (Not Found)."));
    }

    public static IEnumerable CustomExceptionTestCases
    {
        get
        {
            yield return new TestCaseData(typeof(DuplicateMatchException), new DuplicateMatchException("Test"), HttpStatusCode.Conflict).SetDescription($"Should throw {nameof(DuplicateMatchException)} when response status code is {HttpStatusCode.Conflict}");
            yield return new TestCaseData(typeof(NoMatchException), new NoMatchException("Test"), HttpStatusCode.NotFound).SetDescription($"Should throw {nameof(NoMatchException)} when response status code is {HttpStatusCode.NotFound}");
        }
    }

    [Test]
    public void UpdatePerson_ShouldThrowArgumentNullException_WhenCrmIdIsNull()
    {
        var request = CreateUpdatePersonRequest();

        Assert.ThrowsAsync<ArgumentException>(async () => await _personService.UpdatePersonAsync(request, null!));
    }
}
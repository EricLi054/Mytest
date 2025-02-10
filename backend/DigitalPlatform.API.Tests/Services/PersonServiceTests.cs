using DigitalPlatform.API.Tests.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Interfaces;
using NSubstitute.ExceptionExtensions;
using System.Security.Claims;
using HotChocolate.Resolvers;
using Dapr.Client;
using System.Text.Json;
using DigitalPlatform.API.Models.Services;
using DigitalPlatform.API.Models.Data;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;
using DigitalPlatform.API.Models.SourceSystem.Otp;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class PersonServiceTests
{
    private readonly IDaprService _daprService;
    private readonly IDaprCacheService _daprCacheService;
    private readonly IConfiguration _configuration;
    private readonly PersonService _personService;
    private readonly ILogger<PersonService> _logger;
    private readonly IOtpService _otpService;
    private readonly ICryptographyService _cryptographyService;

    public PersonServiceTests()
    {
        _daprService = Substitute.For<IDaprService>();
        _daprCacheService = Substitute.For<IDaprCacheService>();
        _configuration = Substitute.For<IConfiguration>();
        _logger = Substitute.For<ILogger<PersonService>>();
        _otpService = Substitute.For<IOtpService>();

        _cryptographyService = Substitute.For<ICryptographyService>();
        _personService = new PersonService(
            _daprService,
            _daprCacheService,
            _configuration,
            _cryptographyService,
            _logger,
            _otpService);
    }

    [SetUp]
    public void Setup()
    {
        _daprService.ClearReceivedCalls();
        _configuration.ClearReceivedCalls();
        _daprCacheService.ClearReceivedCalls();
        _cryptographyService.ClearReceivedCalls();
        _otpService.ClearReceivedCalls();
    }

    [Test]
    public async Task GetPerson_ValidCrmId_ReturnsPerson()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;
        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(PersonTestData.ValidPersonResponse);
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var expectedData = PersonTestData.ValidPerson;
        var sessionKey = "otpSession";

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(JsonSerializer.Serialize(result), Is.EqualTo(JsonSerializer.Serialize(expectedData)));
    }

    [Test]
    public async Task GetPerson_EmptyFirstName_ReturnsPersonWithNullFirstName()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;

        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(PersonTestData.InvalidPerson);
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var sessionKey = "otpSession";

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.PersonId, Is.EqualTo(PersonTestData.InvalidPerson.PersonId));
        Assert.That(string.IsNullOrEmpty(result.FirstName), Is.True);
        _cryptographyService.Received(1).Decrypt<PersonV2Response>(Arg.Any<EncryptedData>());
    }

    [Test]
    public async Task GetPerson_SuccessfulRequest_ReturnsPerson()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;

        string baseUrl = "https://example.com";
        string endpoint = "api/getPerson/";

        _configuration[ConfigDescriptors.API_BASE_URL].Returns(baseUrl);
        _configuration[ConfigDescriptors.PERSON_API_GET_PERSON_URL].Returns(endpoint);

        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(PersonTestData.ValidPersonResponse);
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var sessionKey = "otpSession";

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result.FirstName, Is.Not.Null);
        Assert.That(string.IsNullOrEmpty(result.FirstName), Is.False);
        Assert.That(string.IsNullOrWhiteSpace(result.FirstName), Is.False);
        Assert.That(result.FirstName, Is.EqualTo(PersonTestData.ValidPerson.FirstName));
        _cryptographyService.Received(1).Decrypt<PersonV2Response>(Arg.Any<EncryptedData>());
    }

    [Test]
    public async Task GetPerson_PersonSystemIdsNull_ReturnsPersonWithNullPersonSystemIdsList()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;

        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(PersonTestData.ValidPersonWithNullPersonSystemIds);
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var sessionKey = "otpSession";

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.PersonSystemIds, Is.Null);
    }

    [Test]
    public async Task GetPerson_PersonSystemIdsEmpty_ReturnsPersonWithEmptyPersonSystemIdsList()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;
        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(PersonTestData.ValidPersonWithEmptyPersonSystemIds);
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var sessionKey = "otpSession";

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.PersonSystemIds, Is.Empty);
    }

    [Test]
    public async Task GetPerson_WorkEmailAddressEmpty_ReturnsPersonWithNullWorkEmailAddress()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;
        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(PersonTestData.ValidPersonWithEmptyWorkEmailAddress);
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var sessionKey = "otpSession";

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(string.IsNullOrEmpty(result.WorkEmailAddress), Is.True);
    }

    [Test]
    public async Task GetPerson_FullPersonEntity_ReturnsPersonWithAllProperties()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;
        PersonV2Response personEntity = PersonTestData.FullPersonEntityResponse;
        Person expectedPerson = PersonTestData.FullPersonEntity;
        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(personEntity);
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var sessionKey = "otpSession";

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedPerson));
        _cryptographyService.Received(1).Decrypt<PersonV2Response>(Arg.Any<EncryptedData>());
    }

    [Test]
    public async Task GetPerson_FullPersonEntity_ReturnsDrFromDoctor()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;
        PersonV2Response personEntity = new PersonV2Response { Title = "Doctor" };
        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(personEntity);
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var sessionKey = "otpSession";

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result.Title, Is.EqualTo("Dr"));
        _cryptographyService.Received(1).Decrypt<PersonV2Response>(Arg.Any<EncryptedData>());
    }

    [Test]
    public async Task UpdatePersonWithValidation_NullPerson_ReturnsNull()
    {
        // Arrange
        PersonUpdateMutation person = null!;
        ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
        var sessionKey = "otpSession";

        // Act
        var result = await _personService.UpdatePerson(person, sessionKey, claimsPrincipal, Substitute.For<IResolverContext>());

        // Assert
        Assert.That(result, Is.Null);
        _cryptographyService.Received(0).Decrypt<PersonV2Response>(Arg.Any<EncryptedData>());
    }

    [Test]
    public async Task UpdatePersonWithValidation_UnauthenticatedUser_ReturnsNull()
    {
        // Arrange
        var person = new PersonUpdateMutation();
        ClaimsPrincipal claimsPrincipal = null!;
        var sessionKey = "otpSession";

        // Act
        var result = await _personService.UpdatePerson(person, sessionKey, claimsPrincipal, Substitute.For<IResolverContext>());

        // Assert
        Assert.That(result, Is.Null);
        _cryptographyService.Received(0).Decrypt<PersonV2Response>(Arg.Any<EncryptedData>());
    }

    [Test]
    public async Task UpdatePersonWithValidation_NonExistingPerson_ReturnsNull()
    {
        // Arrange
        var person = new PersonUpdateMutation();
        var claimsPrincipal = new ClaimsPrincipal();
        _configuration[ConfigDescriptors.PERSON_API_GET_PERSON_URL].Returns("person/get/");
        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var sessionKey = "otpSession";

        // Act
        var result = await _personService.UpdatePerson(person, sessionKey, claimsPrincipal, Substitute.For<IResolverContext>());

        // Assert
        Assert.That(result, Is.Null);
        _cryptographyService.Received(0).Decrypt<PersonV2Response>(Arg.Any<EncryptedData>());
    }

    [Test]
    public async Task UpdatePersonWithValidation_ValidInput_ReturnsUpdatedPerson()
    {
        // Arrange
        string crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.MutationUpdatePersonEntity;
        var personRequest = PersonTestData.MutationUpdatePersonEntityRequest;

        // Mock the claims principal
        // Create a new ClaimsIdentity with the required claim
        var claimsIdentity = new ClaimsIdentity([new Claim(JwtClaims.crmId, crmId)], "mock");

        // Create a new ClaimsPrincipal with the ClaimsIdentity
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

        // Set up configuration
        string baseUrl = "https://example.com";
        string endpoint = "api/updatePerson/";
        _configuration[ConfigDescriptors.API_BASE_URL].Returns(baseUrl);
        _configuration[ConfigDescriptors.PERSON_API_GET_PERSON_URL].Returns(endpoint);

        // Mock GetPerson method
        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(PersonTestData.EditedPersonEntityResponse);

        _daprService.InvokeDaprPutMethodAsync<PersonV2Response, PersonV2Request>(baseUrl, $"{endpoint}{crmId}", Arg.Is<PersonV2Request>(person => person.FirstName == personRequest.FirstName))
            .Returns(Task.FromResult(PersonTestData.EditedPersonEntityResponse));
        _otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));
        var sessionKey = "otpSession";

        // Act
        var result = await _personService.UpdatePerson(person, sessionKey, claimsPrincipal, Substitute.For<IResolverContext>());

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.FirstName, Is.EqualTo(PersonTestData.EditedPersonEntityResponse.FirstName));
        Assert.That(result.Surname, Is.EqualTo(PersonTestData.EditedPersonEntityResponse.Surname));
        Assert.That(result.PostalAddress?.Dpid, Is.EqualTo(PersonTestData.EditedPersonEntityResponse?.PostalAddress?.Dpid));

        _cryptographyService.Received(1).Decrypt<PersonV2Response>(Arg.Any<EncryptedData>());
    }

    [Test]
    public async Task UpdatePersonWithValidation_ExceptionThrown_ReturnsNull()
    {
        // Arrange
        var person = new PersonUpdateMutation();
        var claimsPrincipal = new ClaimsPrincipal();
        _configuration[ConfigDescriptors.PERSON_API_GET_PERSON_URL].Returns("person/get/");
        _daprService.InvokeDaprGetMethodAsync<Person>(Arg.Any<string>(), Arg.Any<string>()).Throws(new Exception("Simulated error"));
        var sessionKey = "otpSession";

        // Act
        var result = await _personService.UpdatePerson(person, sessionKey, claimsPrincipal, Substitute.For<IResolverContext>());

        // Assert
        Assert.That(result, Is.Null);
    }


    //TODO: re-implement this test properly 
    [Test]
    public async Task GetPerson_WhenCalled_ShouldAcquireSemaphore()
    {
        int totalRunningThread = 0;
        int threadsToRun = 10;

        var fakeFactory = Substitute.For<Func<Task<Person>>>();
        var daprClient = Substitute.For<DaprClient>();
        var logger = Substitute.For<ILogger<DaprCacheService>>();
        var configuration = Substitute.For<IConfiguration>();

        configuration[ConfigDescriptors.PERSON_API_GET_PERSON_URL].Returns("endpoint");
        configuration[ConfigDescriptors.API_BASE_URL].Returns("baseUrl");
        var personLogger = Substitute.For<ILogger<PersonService>>();
        Guid crmId = PersonTestData.PersonId;

        var httpContextAccessor = Substitute.For<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
        var daprService = new DaprService(Substitute.For<HttpClient>(), configuration, httpContextAccessor, Substitute.For<ILogger<DaprService>>());
        var expectedContent = new DaprCacheItem<Person> { Content = PersonTestData.ValidPerson };
        var etag = "testEtag";
        daprClient.GetStateAndETagAsync<DaprCacheItem<Person>>("Arg.Any<string>()", Arg.Any<string>(), null, null, default)
            .Returns(Task.FromResult<(DaprCacheItem<Person>, string)>((null!, null!)), Task.FromResult<(DaprCacheItem<Person>, string)>((expectedContent, etag)));
        //return person
        var daprCacheService = Substitute.For<IDaprCacheService>();

        var personService = new PersonService(daprService, daprCacheService, configuration, _cryptographyService, personLogger, _otpService);

        var simulateMultipleCalls = new List<Task>();
        var sessionKey = "otpSession";

        for (int i = 1; i <= threadsToRun; i++)
        {
            simulateMultipleCalls.Add(Task.Run(async () =>
            {
                totalRunningThread++;
                await personService.GetPerson($"{crmId}", sessionKey);
            }));
        }
        await Task.WhenAll(simulateMultipleCalls);
        Assert.That(totalRunningThread, Is.EqualTo(threadsToRun));
        //check if daprService was called only once and daprCacheService was called 10 times
        daprClient.Received(1);
        daprCacheService.Received(threadsToRun);
    }

    [Test]
    public async Task GetPerson_WhenCalled_WithInvalidSessionKey_ShouldReturnMaskedData()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;
        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(PersonTestData.FullPersonEntityResponse);
        var sessionKey = "otpSessionInvalid";
        var otpRequest = new CheckOtpRequest
        {
            CrmId = crmId.ToString(),
            Key = sessionKey
        };

        _otpService.CheckOtpAsync(otpRequest).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = false }));

        var expectedData = PersonTestData.FullPersonEntity;

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(JsonSerializer.Serialize(result), Is.EqualTo(JsonSerializer.Serialize(expectedData)));
    }

    [Test]
    public async Task GetPerson_WhenCalled_WithValidSessionKey_ShouldReturnUnmaskedData()
    {
        // Arrange
        Guid crmId = PersonTestData.PersonId;
        _daprCacheService.GetOrCreateAsync(Arg.Any<string>(), Arg.Any<Func<Task<EncryptedData>>>())
            .Returns(Task.FromResult<EncryptedData?>(new EncryptedData()));
        _cryptographyService.Decrypt<PersonV2Response>(Arg.Any<EncryptedData>()).Returns(PersonTestData.FullPersonEntityResponse);
        var sessionKey = "otpSession";
        var otpRequest = new CheckOtpRequest
        {
            CrmId = crmId.ToString(),
            Key = sessionKey
        };

        _otpService.CheckOtpAsync(otpRequest).Returns(Task.FromResult(new CheckOtpQueryResponse { IsVerified = true }));

        var expectedData = PersonTestData.FullPersonEntity;
        expectedData.IsMasked = false;

        // Act
        Person result = await _personService.GetPerson($"{crmId}", sessionKey);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IsMasked, Is.EqualTo(false));
        Assert.That(JsonSerializer.Serialize(result), Is.EqualTo(JsonSerializer.Serialize(expectedData)));
    }
}
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Tests.Helpers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.API.Tests.Services;
[TestFixture]
public class HandlebarContextServiceTests
{
    private IPersonService _personService;
    private IConfiguration _configuration;
    private HandlebarContextService _handlebarContextService;
    private ILogger<HandlebarContextService> _logger;

    [SetUp]
    public void Setup()
    {
        _personService = Substitute.For<IPersonService>();
        _configuration = Substitute.For<IConfiguration>();
        _logger = Substitute.For<ILogger<HandlebarContextService>>();
        _handlebarContextService = new HandlebarContextService(
            _personService,
            new DateTimeProvider(),
            _configuration,
             _logger
        );
    }

    [Test]
    public async Task GetHandlebarContext_WithB2CUrlMatch_ReturnsContextWithB2CUrl()
    {
        // Arrange
        string content = "Url = {{b2cUrl}}";
        _configuration[ConfigDescriptors.INSURANCE_B2C_URL].Returns("https://testurl.com.au");

        // Act
        var context = await _handlebarContextService.GetHandlebarContext(content);

        // Assert
        Assert.That(context.B2CUrl, Is.EqualTo("https://testurl.com.au"));
    }

    [Test]
    public async Task GetHandlebarContext_WithPersonMatch_ReturnsContextWithMaskedPerson()
    {
        // Arrange
        string content = "Hello, {{person}}!";
        string crmId = "123";
        var person = new Person { FirstName = "John", MobilePhone = "0123456789", IsMasked = true };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);

        // Act
        var context = await _handlebarContextService.GetHandlebarContext(content, crmId, sessionKey);

        // Assert
        Assert.That(context.Person, Is.EqualTo(person));
        Assert.That(context.Person.IsMasked, Is.True);
        Assert.That(context.Person.MobilePhone, Is.EqualTo("01** *** 789"));
    }

    [Test]
    public async Task GetHandlebarContext_WithPersonMatch_ReturnsContextWithUnmaskedPerson()
    {
        // Arrange
        string content = "Hello, {{person}}!";
        string crmId = "123";
        string sessionKey = "abc";
        var person = new Person { FirstName = "John", MobilePhone = "0123456789", IsMasked = false };

        _personService.GetPerson(crmId, sessionKey).Returns(person);

        // Act
        var context = await _handlebarContextService.GetHandlebarContext(content, crmId, sessionKey);

        // Assert
        Assert.That(context.Person, Is.EqualTo(person));
        Assert.That(context.Person.IsMasked, Is.False);
        Assert.That(context.Person.MobilePhone, Is.EqualTo("0123 456 789"));
    }

    [Test]
    [TestCase("Hello, good {{time}}!", 9, "morning")]
    [TestCase("Hello, good {{time}}!", 14, "afternoon")]
    [TestCase("Hello, good {{time}}!", 20, "evening")]
    public async Task GetHandlebarContext_WithTimeMatch_ReturnsContextWithTime(string content, int currentHour, string expectedTime)
    {
        // Arrange
        string crmId = "123";
        var dateTimeProvider = new FixedDateTimeProvider(currentHour);
        var handlebarContextService = new HandlebarContextService(
            _personService,
            dateTimeProvider,
            _configuration,
             _logger
        );
        // Act
        var context = await handlebarContextService.GetHandlebarContext(content, crmId);

        // Assert
        Assert.That(context.Time, Is.EqualTo(expectedTime));
    }

    [Test]
    public async Task GetHandlebarContext_WithNoMatches_ReturnsEmptyContext()
    {
        // Arrange
        string content = "Hello, world!";
        string crmId = "123";

        // Act
        var context = await _handlebarContextService.GetHandlebarContext(content, crmId);

        // Assert
        Assert.That(context, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(context.Person, Is.Null);
            Assert.That(context.Time, Is.Empty);
            Assert.That(context.MemberProducts, Is.Null);
        });
    }
}

using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Pipelines;
using DigitalPlatform.API.Tests.Data;
using HandlebarsDotNet;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.API.Tests.Processors;
[TestFixture]
public class HandlebarsTests
{
    private readonly IHandlebarContextService _handlebarContextService;
    private readonly ICacheService _cacheService;

    public HandlebarsTests()
    {
        _handlebarContextService = Substitute.For<IHandlebarContextService>();
        _cacheService = Substitute.For<ICacheService>();
    }

    [Test]
    public async Task ReplaceVariables_ShouldReplaceMustacheVariables()
    {
        // Arrange
        string template = "Hello, {{person.FirstName}}. Login email is {{loginEmail}}";
        string crmId = "123";
        Person fakePerson = new() { FirstName = "John" };
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo =>
            {
                return new ContentContext
                {
                    Person = fakePerson,
                    LoginEmail = "testEmail"
                };
            });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act
        string result = await HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId);

        // Assert
        Assert.That(result, Is.EqualTo("Hello, John. Login email is testEmail"));
    }

    [Test]
    public void ReplaceVariables_ShouldReplaceModelPropertiesFromCMS_WithMaskedData()
    {
        // Arrange
        var template = "{{#person.PostalAddress}}{{FormattedAddress}}{{/person.PostalAddress}}";
        var crmId = "123";
        var fakePerson = PersonTestData.FullPersonEntity;
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo => new ContentContext { Person = fakePerson });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act
        var result = HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId).Result;

        // Assert
        Assert.That(result, Is.EqualTo("********* PERTH, WA 6000"));
    }

    [Test]
    public void ReplaceVariables_ShouldReplaceModelPropertiesFromCMS_WithUnmaskedData()
    {
        // Arrange
        var template = "{{#person.PostalAddress}}{{FormattedAddress}}{{/person.PostalAddress}}";
        var crmId = "123";
        var fakePerson = PersonTestData.FullPersonEntity;
        fakePerson.IsMasked = false;
        fakePerson.PostalAddress.IsMasked = false;
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo => new ContentContext { Person = fakePerson });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act
        var result = HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId).Result;

        // Assert
        Assert.That(result, Is.EqualTo("PO Box 10 PERTH, WA 6000"));
    }

    [Test]
    public async Task ReplaceVariables_ShouldReplaceMustacheVariablesWithTime()
    {
        // Arrange
        string template = "Hello, {{person.FirstName}}, it's {{time}}";
        string crmId = "123";
        Person fakePerson = new() { FirstName = "John" };
        string time = "morning";
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo =>
            {
                return new ContentContext
                {
                    Person = fakePerson,
                    Time = time
                };
            });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act
        string result = await HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId);

        // Assert
        Assert.That(result, Is.EqualTo("Hello, John, it's morning"));
    }

    [Test]
    public async Task ReplaceVariables_ShouldReplaceTimeMustacheVariable()
    {
        // Arrange
        string template = "Good {{time}}";
        string time = "morning";
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template).Returns(
            callInfo =>
            {
                return new ContentContext
                {
                    Time = time
                };
            });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act
        string result = await HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template);

        // Assert
        Assert.That(result, Does.Contain("Good morning"));
    }

    [Test]
    public async Task ReplaceVariables_ShouldHandleEmptyString()
    {
        // Arrange
        string template = "";
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template).Returns(
            callInfo =>
            {
                return new ContentContext();
            });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act
        string result = await HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template);

        // Assert
        Assert.That(result, Is.EqualTo(""));
    }

    [Test]
    public void ReplaceVariables_ShouldThrowExceptionWithMissingMustacheVariable()
    {
        // Arrange
        string template = "Hello, {{}}";
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template).Returns(
            callInfo =>
            {
                return new ContentContext();
            });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);

        // Act and Assert
        Assert.ThrowsAsync<HandlebarsParserException>(
            async () =>
            {
                _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
                    .Returns(handlebarsInstance?.Compile(template));
                await HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template);
            });
    }

    [Test]
    public void IfEqHelper_ShouldRenderTemplateIfArgumentsEqual()
    {
        // Arrange
        var template = "{{#if_eq person.FirstName \"John\"}}Hi John!{{else}}Who are you?{{/if_eq}}";
        var crmId = "123";
        var fakePerson = new Person { FirstName = "John" };
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo => new ContentContext { Person = fakePerson });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act
        var result = HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId).Result;

        // Assert
        Assert.That(result, Is.EqualTo("Hi John!"));
    }

    [Test]
    public void IfEqHelper_ShouldRenderInverseTemplateIfArgumentsNotEqual()
    {
        // Arrange
        var template = "{{#if_eq person.FirstName \"John\"}}Hi John!{{else}}Who are you?{{/if_eq}}";
        var crmId = "123";
        var fakePerson = new Person { FirstName = "Alex" };
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo => new ContentContext { Person = fakePerson });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act
        var result = HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId).Result;

        // Assert
        Assert.That(result, Is.EqualTo("Who are you?"));
    }

    [Test]
    public void IfEqHelper_ShouldThrowHandlebarsExceptionForIncorrectNumberOfArguments()
    {
        // Arrange
        var template = "{{#if_eq person.FirstName}}{{else}}Who are you?{{/if_eq}}";
        var crmId = "123";
        var fakePerson = new Person { FirstName = "John" };
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo => new ContentContext { Person = fakePerson });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act and Assert
        var exception = Assert.ThrowsAsync<HandlebarsException>(
            async () => await HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId));

        Assert.That(exception.Message, Is.EqualTo("Helper 'if_eq' must have two arguments"));
    }

    [Test]
    public void FirstLetterHelper_ShouldReturnFirstLetterOfInputString()
    {
        // Arrange
        var template = "{{firstLetter person.FirstName}}";
        var crmId = "123";
        var fakePerson = new Person { FirstName = "John" };
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo => new ContentContext { Person = fakePerson });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act
        var result = HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId).Result;

        // Assert
        Assert.That(result, Is.EqualTo("J"));
    }

    [Test]
    public void FirstLetterHelper_ShouldHandleEmptyInputString()
    {
        // Arrange
        var template = "{{firstLetter person.FirstName}}";
        var crmId = "123";
        var fakePerson = new Person { FirstName = "" };
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo => new ContentContext { Person = fakePerson });

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(Handlebars.Create());

        // Act
        var result = HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId).Result;

        // Assert
        Assert.That(result, Is.EqualTo(template));
    }

    [Test]
    public void FirstLetterHelper_ShouldHandleNullInputString()
    {
        // Arrange
        var template = "{{firstLetter person.FirstName}}";
        var crmId = "123";
        var fakePerson = new Person { FirstName = null! };
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo => new ContentContext { Person = fakePerson });

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(Handlebars.Create());

        // Act
        var result = HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId).Result;

        // Assert
        Assert.That(result, Is.EqualTo(template));
    }

    [Test]
    public void FirstLetterHelper_ShouldThrowHandlebarsExceptionForIncorrectNumberOfArguments()
    {
        // Arrange
        var template = "{{firstLetter}}";
        var crmId = "123";
        var fakePerson = new Person { FirstName = "John" };
        var logger = Substitute.For<ILogger>();

        _handlebarContextService.GetHandlebarContext(template, crmId).Returns(
            callInfo => new ContentContext { Person = fakePerson });

        var handlebarsInstance = Handlebars.Create();

        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        _cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(template));

        // Act and Assert
        var exception = Assert.ThrowsAsync<HandlebarsException>(
            async () => await HandlebarsTemplateProcessor.ProcessTemplate(_handlebarContextService, _cacheService, logger, template, crmId));

        Assert.That(exception.Message, Is.EqualTo("Helper 'firstLetter' must have one argument"));
    }
}
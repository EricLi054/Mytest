using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Tests.Data;
using DigitalPlatform.API.GraphQL.DataLoaders;
using GreenDonut;
using HandlebarsDotNet;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.API.Tests.GraphQL;

[TestFixture]
public class ContentDataLoaderTests
{
    [Test]
    public async Task ContentDataLoader_Returns_SuccessfulResult()
    {
        // Arrange
        var queryKv = new KeyValuePair<string, string>("query", "{ testCmsComponent { id, name } }");
        var crmidKv = new KeyValuePair<string, string>("crmId", PersonTestData.PersonId.ToString());
        var emailKv = new KeyValuePair<string, string>("loginEmail", "test-email@test.com.au");
        var sessionKeyKv = new KeyValuePair<string, string>("sessionKey", "test-session-key");
        var contentData = new List<KeyValuePair<string, string>> {
            queryKv,
            crmidKv,
            emailKv,
            sessionKeyKv
        };

        var contentResult = "{ testCmsComponent { id: 1, name: \"{{loginEmail}}\" } }";
        var contentService = Substitute.For<IContentService>();
        contentService.GetContentAsync(queryKv.Value).Returns(contentResult);

        var handlebarContextService = Substitute.For<IHandlebarContextService>();
        handlebarContextService.GetHandlebarContext(contentResult, crmidKv.Value, sessionKeyKv.Value).Returns(new ContentContext { LoginEmail = emailKv.Value });

        var handlebarsInstance = Handlebars.Create();

        var cacheService = Substitute.For<ICacheService>();
        cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<IHandlebars?>>>())
            .Returns(handlebarsInstance);
        cacheService.GetOrCreateAsync(Arg.Any<object>(), Arg.Any<Func<ICacheEntry, Task<HandlebarsTemplate<object, object>>>>())
            .Returns(handlebarsInstance?.Compile(contentResult));

        var logger = Substitute.For<ILogger<ContentDataLoader>>();

        var batchScheduler = new AutoBatchScheduler();
        var contentDataLoader = new ContentDataLoader(contentService, handlebarContextService, cacheService, batchScheduler, logger);

        var expectedResult = new List<string>
        {
            { "{ testCmsComponent { id: 1, name: \"test-email@test.com.au\" } }" },
            { crmidKv.Value },
            { emailKv.Value },
            { sessionKeyKv.Value }
        };

        // Act
        var result = await contentDataLoader.LoadAsync(contentData.AsReadOnly());

        // Assert
        Assert.That(result.Count, Is.EqualTo(expectedResult.Count));
        Assert.That(result[0], Is.EqualTo(expectedResult[0]));
        Assert.That(result[1], Is.EqualTo(expectedResult[1]));
        Assert.That(result[2], Is.EqualTo(expectedResult[2]));
    }
}

using DigitalPlatform.API.GraphQL.Mutations;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.API.Tests.Extensions;

[TestFixture]
public class ContentMustacheExtensionsTests
{
    [Test]
    public void PerformPostActions_WhenTimeIsMorning_ShouldUpdateBannerImageArray()
    {
        // Arrange
        var str = "{\"data\":{\"component\":{\"bannerImage\":[\"image1\",\"image2\",\"image3\"]}}}";
        var context = new ContentContext { Time = "morning" };
        var logger = Substitute.For<ILogger>();

        // Act
        var result = str.PerformPostActions(context, logger);

        // Assert
        var expected = "{\"data\":{\"component\":{\"bannerImage\":[\"image1\"]}}}";
        Assert.That(result, Is.EqualTo(expected));
    }

    [Test]
    public void PerformPostActions_WhenTimeIsAfternoon_ShouldUpdateBannerImageArray()
    {
        // Arrange
        var str = "{\"data\":{\"component\":{\"bannerImage\":[\"image1\",\"image2\",\"image3\"]}}}";
        var context = new ContentContext { Time = "afternoon" };
        var logger = Substitute.For<ILogger>();

        // Act
        var result = str.PerformPostActions(context, logger);

        // Assert
        var expected = "{\"data\":{\"component\":{\"bannerImage\":[\"image2\"]}}}";
        Assert.That(result, Is.EqualTo(expected));
    }

    [Test]
    public void PerformPostActions_WhenTimeIsEvening_ShouldUpdateBannerImageArray()
    {
        // Arrange
        var str = "{\"data\":{\"component\":{\"bannerImage\":[\"image1\",\"image2\",\"image3\"]}}}";
        var context = new ContentContext { Time = "evening" };
        var logger = Substitute.For<ILogger>();

        // Act
        var result = str.PerformPostActions(context, logger);

        // Assert
        var expected = "{\"data\":{\"component\":{\"bannerImage\":[\"image3\"]}}}";
        Assert.That(result, Is.EqualTo(expected));
    }

    [Test]
    public void PerformPostActions_WhenTimeIsNotMorningAfternoonOrEvening_ShouldNotUpdateBannerImageArray()
    {
        // Arrange
        var str = "{\"data\":{\"component\":{\"bannerImage\":[\"image1\",\"image2\",\"image3\"]}}}";
        var context = new ContentContext { Time = "night" };
        var logger = Substitute.For<ILogger>();

        // Act
        var result = str.PerformPostActions(context, logger);

        // Assert
        Assert.That(result, Is.EqualTo(str));
    }

    [Test]
    public void PerformPostActions_WhenTimeIsNotSet_ShouldUpdateBannerImageArray()
    {
        // Arrange
        var str = "{\"data\":{\"component\":{\"bannerImage\":[\"image1\",\"image2\",\"image3\"]}}}";
        var context = new ContentContext { Time = "" };
        var logger = Substitute.For<ILogger>();

        // Act
        var result = str.PerformPostActions(context, logger);

        // Assert
        Assert.That(result, Does.Contain("{\"data\":{\"component\":{\"bannerImage\":[\"image"));
    }
}
using Shared.Extensions;
using System.Text.Json;

namespace Shared.Tests.Extensions;

public class SampleObject
{
    public string? Name { get; set; }
    public int Age { get; set; }
}

public class DeserializeExtensionsTests
{
    [Test]
    public void Deserialize_ShouldReturnObject_WhenValidJsonProvided()
    {
        const string json = "{\"Name\":\"John\", \"Age\":30}";

        var result = json.Deserialize<SampleObject>();

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.Name, Is.EqualTo("John"));
            Assert.That(result.Age, Is.EqualTo(30));
        });
    }

    [Test]
    public void Deserialize_ShouldReturnNull_WhenInvalidJsonProvided()
    {
        const string invalidJson = "{invalid json}";

        Assert.Throws<JsonException>(() => invalidJson.Deserialize<SampleObject>());
    }

    [Test]
    public void Deserialize_ShouldIgnoreCase_WhenDeserializing()
    {
        const string json = "{\"name\":\"John\", \"age\":30}"; // lowercase properties

        var result = json.Deserialize<SampleObject>();

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.Name, Is.EqualTo("John"));
            Assert.That(result.Age, Is.EqualTo(30));
        });
    }

    [Test]
    public void Deserialize_ShouldReturnNull_WhenJsonIsEmpty()
    {
        const string emptyJson = "";

        var result = emptyJson.Deserialize<SampleObject>();

        Assert.That(result, Is.Null);
    }
}
using Membership.Util;
using Shouldly;
using System.Text.Json;

namespace Membership.Tests.util;

[TestFixture]
public class EmptyDateTimeConverterTests
{
    private static readonly JsonSerializerOptions options;

    static EmptyDateTimeConverterTests()
    {
        options = new JsonSerializerOptions();
        options.Converters.Add(new EmptyDateTimeConverter());
    }

    [Test]
    public void Read_ValidDate_ReturnsDateTime()
    {
        // Arrange
        var json = "{\"MaturityDate\": \"2023-09-01T00:00:00\"}";

        // Act
        var result = JsonSerializer.Deserialize<TestObject>(json, options);

        // Assert
        result.ShouldNotBeNull();
        result.MaturityDate.ShouldBe(new DateTime(2023, 9, 1, 0, 0, 0));
    }

    [Test]
    public void Read_EmptyString_ReturnsNull()
    {
        // Arrange
        var json = "{\"MaturityDate\": \"\"}";

        // Act
        var result = JsonSerializer.Deserialize<TestObject>(json, options);

        // Assert
        result?.MaturityDate.ShouldBeNull();
    }

    [Test]
    public void Read_NullDate_ReturnsNull()
    {
        // Arrange
        var json = "{\"MaturityDate\": null}";

        // Act
        var result = JsonSerializer.Deserialize<TestObject>(json, options);

        // Assert
        result?.MaturityDate.ShouldBeNull();
    }

    [Test]
    public void Read_InvalidDate_ThrowsJsonException()
    {
        // Arrange
        var json = "{\"MaturityDate\": \"InvalidDate\"}";

        // Act & Assert
        Should.Throw<JsonException>(() => JsonSerializer.Deserialize<TestObject>(json, options));
    }

    [Test]
    public void Write_ValidDate_SerializesCorrectly()
    {
        // Arrange
        var myObject = new TestObject
        {
            MaturityDate = new DateTime(2023, 9, 1, 0, 0, 0)
        };

        // Act
        var json = JsonSerializer.Serialize(myObject, options);

        // Assert
        json.ShouldBe("{\"MaturityDate\":\"2023-09-01T00:00:00\"}");
    }

    [Test]
    public void Write_NullDate_SerializesToNull()
    {
        // Arrange
        var myObject = new TestObject { MaturityDate = null };

        // Act
        var json = JsonSerializer.Serialize(myObject, options);

        // Assert
        json.ShouldBe("{\"MaturityDate\":null}");
    }

    private class TestObject
    {
        public DateTime? MaturityDate { get; set; }
    }
}
using Shared.Util;
using System.Text;
using System.Text.Json;

namespace Shared.Tests.Util;

public class IntToStringConverterTests
{
    private readonly JsonSerializerOptions _options = new() {Converters = {new IntToStringConverter()}};

    [Test]
    public void Read_ShouldConvertNumberToString()
    {
        const string json = "42";
        var utf8Json = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(utf8Json);

        reader.Read();
        var result = new IntToStringConverter().Read(ref reader, typeof(string), _options);

        Assert.That(result, Is.EqualTo("42"));
    }

    [Test]
    public void Read_ShouldReturnStringAsIs()
    {
        const string json = "\"TestString\"";
        var utf8Json = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(utf8Json);

        reader.Read();
        var result = new IntToStringConverter().Read(ref reader, typeof(string), _options);

        Assert.That(result, Is.EqualTo("TestString"));
    }

    [Test]
    public void Write_ShouldWriteStringValue()
    {
        using var stream = new MemoryStream();
        using var writer = new Utf8JsonWriter(stream);
        const string value = "TestValue";

        new IntToStringConverter().Write(writer, value, _options);
        writer.Flush();

        var json = Encoding.UTF8.GetString(stream.ToArray());
        Assert.That(json, Is.EqualTo("\"TestValue\""));
    }
}
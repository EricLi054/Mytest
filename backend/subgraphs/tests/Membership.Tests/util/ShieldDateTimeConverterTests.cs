using Membership.Util;
using System.Text.Json;

namespace Membership.Tests.util;
public class ShieldDateTimeConverterTests
{
    public class TestClass
    {
        public DateTime ShieldDate { get; set; }
        public DateTime? NullableDateTime { get; set; }
        public DateTime DateWithNoOffset { get; set; }

    }

    [Test]
    public void Read_ShouldConvertStringDateTime()
    {
        const string json = "{\"ShieldDate\":\"2024-07-01T13:18:21.000+0800\",\"NullableDateTime\":null,\"DateWithNoOffset\":\"9/07/2024 1:30:00 PM\"}";

        var deserializeOptions = new JsonSerializerOptions();
        deserializeOptions.Converters.Add(new ShieldDateTimeConverter());
        var result = JsonSerializer.Deserialize<TestClass>(json, deserializeOptions)!;

        Assert.That(result.ShieldDate.ToUniversalTime(), Is.EqualTo(new DateTime(2024, 07, 01, 5, 18, 21, DateTimeKind.Utc).ToUniversalTime()));
        Assert.That(result.NullableDateTime, Is.EqualTo(null));
        Assert.That(result.DateWithNoOffset.ToUniversalTime(), Is.EqualTo(new DateTime(2024, 7, 9, 13, 30, 0).ToUniversalTime()));
    }

    [Test]
    public void Write_ShouldConvertDateTimeToString()
    {
        var testObject = new TestClass
        {
            ShieldDate = new DateTime(2024, 7, 1, 13, 30, 21),
            NullableDateTime = null,
            DateWithNoOffset = new DateTime(2024, 1, 17, 16, 30, 0)
        };

        var serializeOptions = new JsonSerializerOptions();
        serializeOptions.Converters.Add(new ShieldDateTimeConverter());
        var json = JsonSerializer.Serialize(testObject, serializeOptions);

        const string expectedJson = "{\"ShieldDate\":\"01/07/2024 13:30:21\",\"NullableDateTime\":null,\"DateWithNoOffset\":\"17/01/2024 16:30:00\"}";
        Assert.That(json, Is.EqualTo(expectedJson));
    }
}
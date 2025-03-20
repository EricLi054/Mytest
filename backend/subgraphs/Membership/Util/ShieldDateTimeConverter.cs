using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Membership.Util;

public class ShieldDateTimeConverter : JsonConverter<DateTime>
{
    private readonly CultureInfo culture = CultureInfo.GetCultureInfo("en-AU");
    private const string DateFormat = "dd/MM/yyyy HH:mm:ss";
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var dateString = reader.GetString();
        if (DateTime.TryParse(dateString, culture, DateTimeStyles.None, out DateTime result))
        {
            return result;
        }
        throw new JsonException($"Invalid date format: {dateString}.");
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(DateFormat, culture));
    }
}

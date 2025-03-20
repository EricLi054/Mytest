using System.Globalization;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace Membership.Util;

public class EmptyDateTimeConverter : JsonConverter<DateTime?>
{
    private readonly CultureInfo Culture = CultureInfo.InvariantCulture;
    private const string DateFormat = "yyyy-MM-ddTHH:mm:ss";

    public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
        {
            return null;
        }

        var dateString = reader.GetString();

        if (string.IsNullOrEmpty(dateString))
        {
            return null;
        }

        if (DateTime.TryParse(dateString, Culture, DateTimeStyles.None, out var result))
        {
            return result;
        }

        throw new JsonException($"Invalid date format. Expected format: {DateFormat}, but got: {dateString}.");
    }

    public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
    {
        if (value.HasValue)
        {
            writer.WriteStringValue(value.Value.ToString(DateFormat, Culture));
        }
        else
        {
            writer.WriteNullValue();
        }
    }
}
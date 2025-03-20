using System.Text.Json;

namespace Shared.Extensions;

public static class DeserializeExtensions
{
    private static readonly JsonSerializerOptions DefaultSerializerOptions = new() {PropertyNameCaseInsensitive = true};

    public static T? Deserialize<T>(this string json) =>
        string.IsNullOrWhiteSpace(json) ? default : JsonSerializer.Deserialize<T>(json, DefaultSerializerOptions);
}
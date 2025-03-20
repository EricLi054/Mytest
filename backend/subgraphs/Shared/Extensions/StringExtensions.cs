namespace Shared.Extensions;

public static class StringExtensions
{
    /// <summary>
    /// Throws an <see cref="ArgumentException"/> if the string is null or empty.
    /// </summary>
    /// <param name="value"></param>
    /// <param name="paramName"></param>
    /// <exception cref="ArgumentException"></exception>
    public static void ThrowIfNullOrWhiteSpace(this string value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException($"{paramName} cannot be null or empty.", paramName);
        }
    }

    /// <summary>
    /// Remove whitespace from a string
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
    public static string RemoveWhitespace(this string str)
    {
        if (string.IsNullOrEmpty(str)) return str;
        return new string(str.Where(c => !char.IsWhiteSpace(c)).ToArray());
    }
}

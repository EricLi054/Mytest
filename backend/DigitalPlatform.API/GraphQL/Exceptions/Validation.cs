namespace DigitalPlatform.API.GraphQL.Exceptions;

public class ValidationError(string message, IEnumerable<string> fieldName)
    : Exception(message)
{
    public IEnumerable<string> FieldName { get; set; } = fieldName;
}

using System.Net;

namespace DigitalPlatform.API.GraphQL.Exceptions;

public class HttpError(string message, string errorCode)
    : Exception(message)
{
    public string ErrorCode { get; set; } = errorCode;
}

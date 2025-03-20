namespace Shared.Exceptions;
public class TooManyRequestsException(string message) : Exception(message);

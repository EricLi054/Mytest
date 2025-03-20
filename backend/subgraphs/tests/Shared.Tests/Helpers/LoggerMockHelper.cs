using Microsoft.Extensions.Logging;
using Moq;

namespace Shared.Tests.Helpers;

public static class LoggerMockHelper
{
    public static void VerifyLog<T>(
        this Mock<ILogger<T>> loggerMock,
        LogLevel logLevel,
        string message,
        Func<Times> times,
        Func<Exception, bool>? exceptionPredicate = null
        )
    {
        loggerMock.Verify(
            x => x.Log(
                logLevel,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) =>
                    v.ToString() == message),
                It.Is<Exception>(e =>
                    exceptionPredicate == null || exceptionPredicate(e)
                ),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)
            ),
            times
        );
    }
}
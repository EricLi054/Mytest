using Shared.Exceptions;

namespace Shared.Tests.Exceptions;

public class TooManyRequestsExceptionTests
{
    private const string ExpectedMessage = "Too many requests";

    [Test]
    public void TooManyRequestsException_ShouldSetMessageCorrectly()
    {
        var exception = new TooManyRequestsException(ExpectedMessage);

        Assert.That(exception.Message, Is.EqualTo(ExpectedMessage));
    }

    [Test]
    public void TooManyRequestsException_ShouldBeOfTypeNotFoundException()
    {
        var exception = new TooManyRequestsException(ExpectedMessage);

        Assert.That(exception, Is.TypeOf<TooManyRequestsException>());
    }

    [Test]
    public void Throwing_TooManyRequestsException_ShouldThrowCorrectly()
    {
        var ex = Assert.Throws<TooManyRequestsException>(() => throw new TooManyRequestsException(ExpectedMessage));
        Assert.That(ex.Message, Is.EqualTo(ExpectedMessage));
    }
}
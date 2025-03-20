using Shared.Exceptions;

namespace Shared.Tests.Exceptions;

public class NoMatchExceptionTests
{
    private const string ExpectedMessage = "No match found";

    [Test]
    public void NoMatchException_ShouldSetMessageCorrectly()
    {
        var exception = new NoMatchException(ExpectedMessage);

        Assert.That(exception.Message, Is.EqualTo(ExpectedMessage));
    }

    [Test]
    public void NoMatchException_ShouldBeOfTypeNoMatchException()
    {
        var exception = new NoMatchException(ExpectedMessage);

        Assert.That(exception, Is.TypeOf<NoMatchException>());
    }

    [Test]
    public void Throwing_NoMatchException_ShouldThrowCorrectly()
    {
        var ex = Assert.Throws<NoMatchException>(() => throw new NoMatchException(ExpectedMessage));
        Assert.That(ex.Message, Is.EqualTo(ExpectedMessage));
    }
}
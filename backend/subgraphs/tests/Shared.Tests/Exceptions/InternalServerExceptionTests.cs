using Shared.Exceptions;

namespace Shared.Tests.Exceptions;

public class InternalServerExceptionTests
{
    private const string ExpectedMessage = "Internal server error";

    [Test]
    public void InternalServerException_ShouldSetMessageCorrectly()
    {
        var exception = new InternalServerException(ExpectedMessage);

        Assert.That(exception.Message, Is.EqualTo(ExpectedMessage));
    }

    [Test]
    public void InternalServerException_ShouldBeOfTypeInternalServerException()
    {
        var exception = new InternalServerException(ExpectedMessage);

        Assert.That(exception, Is.TypeOf<InternalServerException>());
    }

    [Test]
    public void Throwing_InternalServerException_ShouldThrowCorrectly()
    {
        var ex = Assert.Throws<InternalServerException>(() => throw new InternalServerException(ExpectedMessage));
        Assert.That(ex.Message, Is.EqualTo(ExpectedMessage));
    }
}
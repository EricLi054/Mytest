using Shared.Exceptions;

namespace Shared.Tests.Exceptions;

public class NotFoundExceptionTests
{
    private const string ExpectedMessage = "Resource not found";

    [Test]
    public void NotFoundException_ShouldSetMessageCorrectly()
    {
        var exception = new NotFoundException(ExpectedMessage);

        Assert.That(exception.Message, Is.EqualTo(ExpectedMessage));
    }

    [Test]
    public void NotFoundException_ShouldBeOfTypeNotFoundException()
    {
        var exception = new NotFoundException(ExpectedMessage);

        Assert.That(exception, Is.TypeOf<NotFoundException>());
    }

    [Test]
    public void Throwing_NotFoundException_ShouldThrowCorrectly()
    {
        var ex = Assert.Throws<NotFoundException>(() => throw new NotFoundException(ExpectedMessage));
        Assert.That(ex.Message, Is.EqualTo(ExpectedMessage));
    }
}
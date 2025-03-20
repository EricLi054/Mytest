using Shared.Exceptions;

namespace Shared.Tests.Exceptions;

public class BadRequestExceptionTests
{
    private const string ExpectedMessage = "Bad request";

    [Test]
    public void BadRequestException_ShouldSetMessageCorrectly()
    {
        var exception = new BadRequestException(ExpectedMessage);

        Assert.That(exception.Message, Is.EqualTo(ExpectedMessage));
    }

    [Test]
    public void BadRequestException_ShouldBeOfTypeNotFoundException()
    {
        var exception = new BadRequestException(ExpectedMessage);

        Assert.That(exception, Is.TypeOf<BadRequestException>());
    }

    [Test]
    public void Throwing_BadRequestException_ShouldThrowCorrectly()
    {
        var ex = Assert.Throws<BadRequestException>(() => throw new BadRequestException(ExpectedMessage));
        Assert.That(ex.Message, Is.EqualTo(ExpectedMessage));
    }
}
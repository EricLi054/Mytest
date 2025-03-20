using Shared.Exceptions;

namespace Shared.Tests.Exceptions;

public class DuplicateMatchExceptionTests
{
    private const string ExpectedMessage = "Duplicate match found";

    [Test]
    public void DuplicateMatchException_ShouldSetMessageCorrectly()
    {
        var exception = new DuplicateMatchException(ExpectedMessage);

        Assert.That(exception.Message, Is.EqualTo(ExpectedMessage));
    }

    [Test]
    public void DuplicateMatchException_ShouldBeOfTypeDuplicateMatchException()
    {
        var exception = new DuplicateMatchException(ExpectedMessage);

        Assert.That(exception, Is.TypeOf<DuplicateMatchException>());
    }

    [Test]
    public void Throwing_DuplicateMatchException_ShouldThrowCorrectly()
    {
        var ex = Assert.Throws<DuplicateMatchException>(() => throw new DuplicateMatchException(ExpectedMessage));
        Assert.That(ex.Message, Is.EqualTo(ExpectedMessage));
    }
}
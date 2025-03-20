using Shared.Extensions;

namespace Shared.Tests.Extensions;

public class StringExtensionsTests
{
    private const string ValidParamName = "testParam";
    private const string ValidValue = "testValue";

    [Test]
    public void ThrowIfNullOrWhiteSpace_ShouldNotThrow_WhenStringIsValid()
    {
        Assert.DoesNotThrow(() => ValidValue.ThrowIfNullOrWhiteSpace(ValidParamName));
    }

    [Test]
    public void ThrowIfNullOrWhiteSpace_ShouldThrowArgumentException_WhenStringIsEmpty()
    {
        const string value = "";

        var ex = Assert.Throws<ArgumentException>(() => value.ThrowIfNullOrWhiteSpace(ValidParamName));
        Assert.Multiple(() =>
        {
            Assert.That(ex!.ParamName, Is.EqualTo(ValidParamName));
            Assert.That(ex.Message, Does.Contain($"{ValidParamName} cannot be null or empty."));
        });
    }

    [Test]
    public void ThrowIfNullOrWhiteSpace_ShouldThrowArgumentException_WhenStringIsWhitespace()
    {
        const string value = "   ";

        var ex = Assert.Throws<ArgumentException>(() => value.ThrowIfNullOrWhiteSpace(ValidParamName));
        Assert.Multiple(() =>
        {
            Assert.That(ex!.ParamName, Is.EqualTo(ValidParamName));
            Assert.That(ex.Message, Does.Contain($"{ValidParamName} cannot be null or empty."));
        });
    }

    [Test]
    public void RemoveWhitespace_ShouldReturnsEmptyString_WhenEmptyString_()
    {
        var output = string.Empty.RemoveWhitespace();

        Assert.That(output, Is.EqualTo(string.Empty));
    }

    [Test]
    public void RemoveWhitespace_ShouldReturnsNull_WhenNullString()
    {
        string nullString = null!;

        var output = nullString.RemoveWhitespace();

        Assert.That(output, Is.Null);
    }

    [Test]
    public void RemoveWhitespace_ShouldReturnsSameString_WhenValidNoSpacesString()
    {
        string input = "testString";
        string expectedOutput = "testString";

        var output = input.RemoveWhitespace();

        Assert.That(output, Is.EqualTo(expectedOutput));
    }

    [Test]
    public void RemoveWhitespace_ShouldReturnsNoWhitespace_WhenValidSpacesString()
    {
        string input = " test string ";
        string expectedOutput = "teststring";

        var output = input.RemoveWhitespace();

        Assert.That(output, Is.EqualTo(expectedOutput));
    }

    [Test]
    public void RemoveWhitespace_ShouldReturnsNoWhitespace_WhenValidTabbedString()
    {
        string input = "test   string";
        string expectedOutput = "teststring";

        var output = input.RemoveWhitespace();

        Assert.That(output, Is.EqualTo(expectedOutput));
    }
}
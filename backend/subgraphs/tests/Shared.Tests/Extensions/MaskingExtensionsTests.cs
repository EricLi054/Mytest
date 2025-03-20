using Shared.Extensions;

namespace Shared.Tests.Extensions;

public class MaskingExtensionsTests
{
    [Test]
    public void MaskString_ValidBsb_ReturnsMaskedValue()
    {
        // Arrange
        const string validBsb = "123456";
        const string maskedBsb = "***456";

        // Act & Assert
        Assert.That(validBsb.MaskString(3), Is.EqualTo(maskedBsb));
    }

    [Test]
    public void MaskString_ValidBsb_NumToMaskTooLong_ReturnsMaskedLength()
    {
        // Arrange
        const string validBsb = "123456";
        const string maskedBsb = "******";

        // Act & Assert
        Assert.That(validBsb.MaskString(7), Is.EqualTo(maskedBsb));
    }

    [Test]
    public void MaskString_ValidAcc_ReturnsMaskedValue()
    {
        // Arrange
        const string validAcc = "123456789";
        const string maskedAcc = "****56789";

        // Act & Assert
        Assert.That(validAcc.MaskString(4), Is.EqualTo(maskedAcc));
    }

    [Test]
    public void MaskString_ValidAcc_NegativeLength_ThrowsError()
    {
        // Arrange
        const string validAcc = "123456789";

        // Act & Assert
        Assert.Throws<ArgumentOutOfRangeException>(() => validAcc.MaskString(-1));
    }

    [Test]
    public void MaskEmail_Should_Return_Masked_Email_When_Valid_Email_Provided()
    {
        // Arrange
        const string email = "test@example.com";
        const string expectedMaskedEmail = "t***t@example.com";

        // Act
        string maskedEmail = email.MaskEmail();

        // Assert
        Assert.That(maskedEmail, Is.EqualTo(expectedMaskedEmail));
    }

    [Test]
    public void MaskEmail_Should_Return_Masked_When_Email_Length_Is_Long()
    {
        // Arrange
        const string email = "verylongemailaddressverylongemailaddressverylongemailaddressverylongemailaddress@example.com";
        const string expectedEmail = "v***s@example.com";

        // Act
        string maskedEmail = email.MaskEmail();

        // Assert
        Assert.That(maskedEmail, Is.EqualTo(expectedEmail));
    }

    [Test]
    public void MaskEmail_Should_Return_Original_String_When_InvalidEmail_Provided()
    {
        // Arrange
        const string email = 
            "loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum";

        // Act
        string maskedEmail = email.MaskEmail();

        // Assert
        Assert.That(maskedEmail, Is.EqualTo(email));
    }

    [Test]
    public void MaskEmail_Should_Return_Original_Email_When_Email_Does_Not_Contain_At_Symbol()
    {
        // Arrange
        const string email = "testexample.com";

        // Act
        string maskedEmail = email.MaskEmail();

        // Assert
        Assert.That(maskedEmail, Is.EqualTo(email));
    }

    [Test]
    public void MaskEmail_Should_Still_Return_Masked_Email_When_Email_Local_Part_Length_Is_Less_Than_Or_Equal_To_2()
    {
        // Arrange
        const string email = "a@example.com";
        const string expectedEmail = "***@example.com";

        // Act
        string maskedEmail = email.MaskEmail();

        // Assert
        Assert.That(maskedEmail, Is.EqualTo(expectedEmail));
    }

    [Test]
    public void MaskEmail_Should_Return_Masked_Email_When_Email_Local_Part_Length_Is_Greater_Than_2()
    {
        // Arrange
        const string email = "abc@example.com";
        const string expectedMaskedEmail = "a***c@example.com";

        // Act
        string maskedEmail = email.MaskEmail();

        // Assert
        Assert.That(maskedEmail, Is.EqualTo(expectedMaskedEmail));
    }

    [TestCase("0412345678", "0412 345 678")]
    [TestCase("04*****123", "04** *** 123")]
    [TestCase("", "")]
    [TestCase("12345", "12345")]
    [TestCase("123456789", "123456789")]
    public void PadMobileNumber_Should_Return_Padded_Mobile_Num(string mobileNumber, string expectedMobileNumber)
    {
        // Act
        string maskedMobile = mobileNumber.PadMobileNumber();

        // Assert
        Assert.That(maskedMobile, Is.EqualTo(expectedMobileNumber));
    }

    [TestCase("**** *123", "**** *123")]
    [TestCase("08*****123", "08 **** *123")]
    [TestCase("", "")]
    [TestCase("12345", "12345")]
    [TestCase("123456789", "123456789")]
    [TestCase("0823456789", "08 2345 6789")]
    public void PadLandlineNumber_Should_Return_Padded_Landline_Num(string landlineNumber, string expectedLandlineNumber)
    {
        // Act
        string maskedLandline = landlineNumber.PadLandlineNumber();

        // Assert
        Assert.That(maskedLandline, Is.EqualTo(expectedLandlineNumber));
    }
}

using DigitalPlatform.API.Extensions;
using NUnit.Framework;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace DigitalPlatform.API.Tests.Extensions
{
    [TestFixture]
    public class StringExtensionsTests
    {
        [Test]
        public void IsValidGuid_ValidGuid_ReturnsTrue()
        {
            // Arrange
            var guidString = Guid.NewGuid().ToString();

            // Act
            var isValid = guidString.IsValidGuid();

            // Assert
            Assert.That(isValid, Is.True);
        }

        [Test]
        public void IsValidGuid_InvalidGuid_ReturnsFalse()
        {
            // Arrange
            var invalidGuidString = "invalid-guid";

            // Act
            var isValid = invalidGuidString.IsValidGuid();

            // Assert
            Assert.That(isValid, Is.False);
        }

        [Test]
        public void RemoveWhitespace_EmptyString_ReturnsEmptyString()
        {
            // Arrange & Act
            var output = string.Empty.RemoveWhitespace();

            // Assert
            Assert.That(output, Is.EqualTo(string.Empty));
        }

        [Test]
        public void RemoveWhitespace_NullString_ReturnsNull()
        {
            // Arrange
            string nullString = null!;

            // Act
            var output = nullString.RemoveWhitespace();

            // Assert
            Assert.That(output, Is.Null);
        }

        [Test]
        public void RemoveWhitespace_ValidNoSpacesString_ReturnsSameString()
        {
            // Arrange
            string input = "testString";
            string expectedOutput = "testString";

            // Act
            var output = input.RemoveWhitespace();

            // Assert
            Assert.That(output, Is.EqualTo(expectedOutput));
        }

        [Test]
        public void RemoveWhitespace_ValidSpacesString_ReturnsNoWhitespace()
        {
            // Arrange
            string input = " test string ";
            string expectedOutput = "teststring";

            // Act
            var output = input.RemoveWhitespace();

            // Assert
            Assert.That(output, Is.EqualTo(expectedOutput));
        }

        [Test]
        public void RemoveWhitespace_ValidTabbedString_ReturnsNoWhitespace()
        {
            // Arrange
            string input = "test   string";
            string expectedOutput = "teststring";

            // Act
            var output = input.RemoveWhitespace();

            // Assert
            Assert.That(output, Is.EqualTo(expectedOutput));
        }

        [Test]
        public void GetStringContent_ReturnsStringContentWithJsonContent()
        {
            // Arrange
            var query = "sample query";
            var expectedJsonContent = JsonSerializer.Serialize(new { query });
            var expectedStringContent = new StringContent(expectedJsonContent, Encoding.UTF8, "application/json");

            // Act
            var stringContent = query.GetStringContent();

            // Assert
            Assert.That(stringContent.Headers?.ContentType?.MediaType, Is.EqualTo(expectedStringContent.Headers?.ContentType?.MediaType));
            Assert.That(stringContent.ReadAsStringAsync().Result, Is.EqualTo(expectedStringContent.ReadAsStringAsync().Result));
        }

        [Test]
        public void MaskString_ValidBsb_ReturnsMaskedValue()
        {
            // Arrange
            var validBsb = "123456";
            var maskedBsb = "***456";

            // Act & Assert
            Assert.That(validBsb.MaskString(3), Is.EqualTo(maskedBsb));
        }

        [Test]
        public void MaskString_ValidBsb_NumToMaskTooLong_ReturnsMaskedLength()
        {
            // Arrange
            var validBsb = "123456";
            var maskedBsb = "******";

            // Act & Assert
            Assert.That(validBsb.MaskString(7), Is.EqualTo(maskedBsb));
        }

        [Test]
        public void MaskString_ValidAcc_ReturnsMaskedValue()
        {
            // Arrange
            var validAcc = "123456789";
            var maskedAcc = "****56789";

            // Act & Assert
            Assert.That(validAcc.MaskString(4), Is.EqualTo(maskedAcc));
        }

        [Test]
        public void MaskString_ValidAcc_NegativeLength_ThrowsError()
        {
            // Arrange
            var validAcc = "123456789";

            // Act & Assert
            Assert.Throws<ArgumentOutOfRangeException>(() => validAcc.MaskString(-1));
        }

        [Test]
        public void MaskEmail_Should_Return_Masked_Email_When_Valid_Email_Provided()
        {
            // Arrange
            string email = "test@example.com";
            string expectedMaskedEmail = "t***t@example.com";

            // Act
            string maskedEmail = email.MaskEmail();

            // Assert
            Assert.That(maskedEmail, Is.EqualTo(expectedMaskedEmail));
        }

        [Test]
        public void MaskEmail_Should_Return_Masked_When_Email_Length_Is_Long()
        {
            // Arrange
            string email = "verylongemailaddressverylongemailaddressverylongemailaddressverylongemailaddress@example.com";
            string expectedEmail = "v***s@example.com";

            // Act
            string maskedEmail = email.MaskEmail();

            // Assert
            Assert.That(maskedEmail, Is.EqualTo(expectedEmail));
        }
        [Test]
        public void MaskEmail_Should_Return_Original_String_When_InvalidEmail_Provided()
        {
            // Arrange
            string email = "loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum";

            // Act
            string maskedEmail = email.MaskEmail();

            // Assert
            Assert.That(maskedEmail, Is.EqualTo(email));
        }
        [Test]
        public void MaskEmail_Should_Return_Original_Email_When_Email_Does_Not_Contain_At_Symbol()
        {
            // Arrange
            string email = "testexample.com";

            // Act
            string maskedEmail = email.MaskEmail();

            // Assert
            Assert.That(maskedEmail, Is.EqualTo(email));
        }

        [Test]
        public void MaskEmail_Should_Still_Return_Masked_Email_When_Email_Local_Part_Length_Is_Less_Than_Or_Equal_To_2()
        {
            // Arrange
            string email = "a@example.com";
            string expectedEmail = "***@example.com";

            // Act
            string maskedEmail = email.MaskEmail();

            // Assert
            Assert.That(maskedEmail, Is.EqualTo(expectedEmail));
        }

        [Test]
        public void MaskEmail_Should_Return_Masked_Email_When_Email_Local_Part_Length_Is_Greater_Than_2()
        {
            // Arrange
            string email = "abc@example.com";
            string expectedMaskedEmail = "a***c@example.com";

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
}
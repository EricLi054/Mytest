using DigitalPlatform.API.Services;
using Microsoft.Extensions.Configuration;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Models.Data.Person;
using System.Text.Json;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class CryptographyServiceTests
{
    [Test]
    public void Constructor_ValidateSaltGeneration()
    {
        // Arrange
        var expectedKey = "mySecretKey";
        var configuration = Substitute.For<IConfiguration>();
        configuration[SecretDescriptors.AES_KEY].Returns(expectedKey);
        var cryptographyService = new CryptographyService(configuration);

        // Act
        var saltGen1 = cryptographyService.GenerateSalt();
        var saltGen2 = cryptographyService.GenerateSalt();

        // Assert
        Assert.That(saltGen1, Is.Not.EqualTo(saltGen2));
    }

    [Test]
    public void Constructor_CanDecryptEncryptedContent()
    {
        // Arrange
        var expectedKey = "mySecretKey";
        var configuration = Substitute.For<IConfiguration>();
        configuration[SecretDescriptors.AES_KEY].Returns(expectedKey);
        var cryptographyService = new CryptographyService(configuration);
        var dataToEncrypt = new Person {PersonId = Guid.NewGuid(),FirstName = "John"};
        
        // Act
        var encryptedData = cryptographyService.Encrypt(dataToEncrypt);

        // Assert        
        var decrypteDataString = JsonSerializer.Serialize(cryptographyService.Decrypt<Person>(encryptedData));
        var dataToEncryptString = JsonSerializer.Serialize(dataToEncrypt);
        Assert.That(decrypteDataString, Is.EqualTo(dataToEncryptString));
    }
}
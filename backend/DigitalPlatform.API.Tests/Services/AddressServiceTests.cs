using System.Net;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.Address;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Tests.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute.ExceptionExtensions;
using NUnit.Framework.Internal;

namespace DigitalPlatform.API.Tests.Services;
[TestFixture]
public class AddressServiceTests
{
    private readonly IDaprService _daprService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AddressService> _logger;
    private readonly AddressService _addressService;

    public AddressServiceTests()
    {
        _daprService = Substitute.For<IDaprService>();
        _configuration = Substitute.For<IConfiguration>();
        _logger = Substitute.For<ILogger<AddressService>>();
        _addressService = new AddressService(_daprService, _configuration, _logger);
    }

    [Test]
    public async Task GetGnafAddressList_ValidConfiguration_ReturnsAddressLookup()
    {
        // Arrange
        _configuration[ConfigDescriptors.ADDRESS_MANAGEMENT_API_SEARCH_GNAF_URL].Returns("api/getGnafAddresses");
        _configuration[ConfigDescriptors.API_BASE_URL].Returns("https://example.com");

        var addressLookup = new AddressLookup(); 
        _daprService.InvokeDaprGetMethodAsync<AddressLookup>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(addressLookup));

        // Act
        var result = await _addressService.GetGnafAddressListAsync("");

        // Assert
        Assert.That(result, Is.EqualTo(addressLookup));
    }

        [Test]
    public void GetGnafAddressList_HttpRequestException_LogsErrorAndReturnsEmptyResponse()
    {
        // Arrange
        HttpRequestException httpRequestException = new("Simulated HTTP error");

        _daprService.InvokeDaprGetMethodAsync<AddressLookup>(Arg.Any<string>(), Arg.Any<string>())
            .Throws(httpRequestException);

        // Act
        Assert.ThrowsAsync<HttpRequestException>(async() => await _addressService.GetGnafAddressListAsync(""));

        // Assert
        _logger.Received().LogError(httpRequestException, httpRequestException.Message);
    }

    [Test]
    public async Task GetPafAddressList_ValidConfiguration_ReturnsAddressLookup()
    {
        // Arrange
        _configuration[ConfigDescriptors.ADDRESS_MANAGEMENT_API_SEARCH_PAF_URL].Returns("api/getPafAddresses");
        _configuration[ConfigDescriptors.API_BASE_URL].Returns("https://example.com");

        _daprService.InvokeDaprGetMethodAsync<AddressLookup>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(AddressTestData.ValidAddressLookupResponse));

        // Act
        var result = await _addressService.GetPafAddressListAsync("");

        // Assert
        Assert.That(result, Is.EqualTo(AddressTestData.ValidAddressLookupResponse));
    }

        [Test]
    public void GetPafAddressList_HttpRequestException_LogsErrorAndReturnsEmptyResponse()
    {
        // Arrange
        HttpRequestException httpRequestException = new("Simulated HTTP error");

        _daprService.InvokeDaprGetMethodAsync<AddressLookup>(Arg.Any<string>(), Arg.Any<string>())
            .Throws(httpRequestException);

        // Act
        Assert.ThrowsAsync<HttpRequestException>(async() => await _addressService.GetPafAddressListAsync(""));

        // Assert
        _logger.Received().LogError(httpRequestException, httpRequestException.Message);
    }

    [Test]
    public async Task GetPafAddress_ValidConfiguration_ReturnsPAFVerification()
    {
        // Arrange
        _configuration[ConfigDescriptors.ADDRESS_MANAGEMENT_API_GET_PAF_URL].Returns("api/getPafAddress");
        _configuration[ConfigDescriptors.API_BASE_URL].Returns("https://example.com");

        _daprService.InvokeDaprGetMethodAsync<PAFVerification>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<Dictionary<string,string>>(), Arg.Any<HttpStatusCode[]>())
            .Returns(Task.FromResult(AddressTestData.ValidPAFVerificationResponse));

        // Act
        var result = await _addressService.GetPafAddressAsync("");

        // Assert
        Assert.That(result, Is.EqualTo(AddressTestData.ValidPAFVerificationResponse));
    }

    [Test]
    public async Task GetPafAddress_ValidConfiguration_ReturnsPAFVerificationWith404()
    {
        // Arrange
        _configuration[ConfigDescriptors.ADDRESS_MANAGEMENT_API_GET_PAF_URL].Returns("api/getPafAddress");
        _configuration[ConfigDescriptors.API_BASE_URL].Returns("https://example.com");

        _daprService.InvokeDaprGetMethodAsync<PAFVerification>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<Dictionary<string,string>>(), Arg.Any<HttpStatusCode[]>())
            .Returns(Task.FromResult(AddressTestData.NotFoundPAFVerificationResponse));

        // Act
        var result = await _addressService.GetPafAddressAsync("");

        // Assert
        Assert.That(result, Is.EqualTo(AddressTestData.NotFoundPAFVerificationResponse));
    }

        [Test]
    public void GetPafAddress_HttpRequestException_LogsErrorAndReturnsEmptyResponse()
    {
        // Arrange
        HttpRequestException httpRequestException = new("Simulated HTTP error");

        _daprService.InvokeDaprGetMethodAsync<PAFVerification>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<Dictionary<string,string>>(), Arg.Any<HttpStatusCode[]>())
            .Throws(httpRequestException);

        // Act
        Assert.ThrowsAsync<HttpRequestException>(async() => await _addressService.GetPafAddressAsync(""));

        // Assert
        _logger.Received().LogError(httpRequestException, httpRequestException.Message);
    }
}
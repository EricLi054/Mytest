using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Extensions;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.SourceSystem.FinOps;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Tests.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute.Extensions;
using NUnit.Framework.Internal;

namespace DigitalPlatform.API.Tests.Services;
[TestFixture]
public class FinOpsServiceTests
{
    private readonly IDaprService _daprService;
    private readonly IConfiguration _configuration;
    private readonly FinOpsService _finOpsService;
    private readonly List<string> _validFinopsProducts;

    public FinOpsServiceTests()
    {
        _daprService = Substitute.For<IDaprService>();
        _configuration = Substitute.For<IConfiguration>();
        ILogger<FinOpsService> _logger = Substitute.For<ILogger<FinOpsService>>();
        _finOpsService = new FinOpsService(_daprService, _configuration, _logger);
        _validFinopsProducts = [.. "REWARDS,CCULT,CLAS,F2GCLAS,F2GSTD,F2GULT,F2GULTP,FORRNCO,FREWDSR,FSTDCMO,FSTDDSR,GLCLAS,GLRWDS,GLSTD,GLULPL,GLULTI,GLW2G,HLCL,HLSTD,HONSTULT,MSTDCMO,MSTDDSR,RSAFAIR,RSAJOR,SSTDCMO,SSTDMY,STD,STIVES,STULT,ULPL,ULTI,W2G,COUNC".Split(',')];
    }

    [Test]
    public async Task GetProductList_ValidConfiguration_ReturnsProductList()
    {
        // Arrange
        _configuration[ConfigDescriptors.FINOPS_API_GET_PRODUCT_LIST_URL].Returns("api/getProductList");
        _configuration[ConfigDescriptors.API_BASE_URL].Returns("https://example.com");

        var productList = new List<Product>(); // Set your expected product list here
        _daprService.InvokeDaprGetMethodAsync<List<Product>>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(productList));

        // Act
        var result = await _finOpsService.GetProductList();

        // Assert
        Assert.That(result, Is.EqualTo(productList));
    }

    [Test]
    public async Task GetProductDetail_ValidProductId_ReturnsProductDetail()
    {
        // Arrange
        var productId = "123";
        _configuration[ConfigDescriptors.FINOPS_API_GET_PRODUCT_DETAIL_URL].Returns("api/getProductDetail/{0}");
        _configuration[ConfigDescriptors.API_BASE_URL].Returns("https://example.com");

        var productDetail = new Product(); // Set your expected product detail here
        _daprService.InvokeDaprGetMethodAsync<Product>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(productDetail));

        // Act
        var result = await _finOpsService.GetProductDetail(productId);

        // Assert
        Assert.That(result, Is.EqualTo(productDetail));
    }

    [Test]
    public async Task GetProductHoldingList_ValidParameters_ReturnsProductHoldingList()
    {
        // Arrange
        string customerAccount = "123";
        string companyId = "456";
        string fromDate = "2023-01-01";
        string upn = "12345678";

        string baseUrl = "https://example.com";
        string endpoint = "api/getProductHoldingList";
        string query = $"?CustAccount={customerAccount}&CompanyId={companyId}&FromDate={fromDate}&UPN={upn}";

        _configuration[ConfigDescriptors.API_BASE_URL].Returns(baseUrl);
        _configuration[ConfigDescriptors.FINOPS_API_GET_PRODUCT_HOLDING_LIST_URL].Returns(endpoint);

        // Invoke Dapr with empty product holding list
        _daprService.InvokeDaprGetMethodAsync<List<FinOpsProductHolding>>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(FinOpsTestData.EmptyProductHoldingList));

        var validProductHoldingList = FinOpsTestData.ValidProductHoldingList;
        // Invoke Dapr with valid product holding list
        _daprService.Configure().InvokeDaprGetMethodAsync<List<FinOpsProductHolding>>(baseUrl, $"{endpoint}{query}")
            .Returns(Task.FromResult(validProductHoldingList));

        // Act
        List<FinOpsProductHolding> result = await _finOpsService.GetProductHoldingList(customerAccount, companyId, fromDate, upn);

        // Assert
        Assert.That(result, Is.EqualTo(validProductHoldingList));

        // Additional assertion to check the customer account in the result
        Assert.That(result.TrueForAll(ph => ph.CustAccount == customerAccount), Is.True, "Customer account in the result does not match the expected value.");
    }

    [Test]
    public async Task GetProductHolding_ValidProductHoldingHeaderId_ReturnsProductHolding()
    {
        // Arrange
        var productHoldingHeaderId = "PH12345678";

        _configuration[ConfigDescriptors.FINOPS_API_GET_PRODUCT_HOLDING_URL].Returns("api/getProductHolding/{0}");
        _configuration[ConfigDescriptors.API_BASE_URL].Returns("https://example.com");

        var productHolding = new FinOpsProductHolding(); // Set your expected product holding here
        _daprService.InvokeDaprGetMethodAsync<FinOpsProductHolding>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(productHolding));

        // Act
        var result = await _finOpsService.GetProductHolding(productHoldingHeaderId);

        // Assert
        Assert.That(result, Is.EqualTo(productHolding));
    }

    [Test]
    public async Task GetProductList_NullConfiguration_ReturnsEmptyProductList()
    {
        // Arrange
        _configuration[ConfigDescriptors.FINOPS_API_GET_PRODUCT_LIST_URL].Returns((string)null!);
        _configuration[ConfigDescriptors.API_BASE_URL].Returns((string)null!);

        // Act
        var result = await _finOpsService.GetProductList();

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetProductDetail_NullProductId_ReturnsEmptyProductDetail()
    {
        // Arrange
        string productId = null!;

        // Act
        var result = await _finOpsService.GetProductDetail(productId);

        // Assert
        Assert.That(result, Is.Null);
        Assert.That(result, Is.EqualTo(null));
    }

    [Test]
    public async Task GetProductHoldingList_NullParameters_ReturnsEmptyProductHoldingList()
    {
        // Arrange
        string customerAccount = null!;
        string companyId = null!;
        string fromDate = null!;
        string upn = null!;

        // Act
        var result = await _finOpsService.GetProductHoldingList(customerAccount, companyId, fromDate, upn);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetProductHolding_NullProductHoldingHeaderId_ReturnsEmptyProductHolding()
    {
        // Arrange
        string productHoldingHeaderId = null!;

        // Act
        var result = await _finOpsService.GetProductHolding(productHoldingHeaderId);

        // Assert
        Assert.That(result, Is.Null);
        Assert.That(result, Is.EqualTo(null));
    }

    [Test]
    public void ProcessProductHoldings_EmptyList_ReturnsEmptyList()
    {
        // Arrange
        var emptyList = new List<FinOpsProductHolding>();

        // Act
        emptyList.ProcessProductHoldings(_validFinopsProducts);

        // Assert
        Assert.That(emptyList, Is.Empty);
    }


    [Test]
    public void ProcessProductHoldings_WithUnsupportedProduct_RemovesProductFromList()
    {
        // Arrange
        var unsupportedProduct = new FinOpsProductHolding
        {
            ProductHoldingLines = new List<ProductHoldingLine>
                {
                    new ProductHoldingLine { CompanyId = "E098", ProductId = "UNKNOWN" }
                }
        };

        var productList = new List<FinOpsProductHolding> { unsupportedProduct };

        // Act
        productList.ProcessProductHoldings(_validFinopsProducts);

        // Assert
        Assert.That(productList, Is.Empty);
    }

    [Test]
    public void ProcessProductHoldings_WithWriteOffAndCreditRefundsProducts_RemovesProductsFromList()
    {
        // Arrange
        var writeOffProduct = new FinOpsProductHolding
        {
            ProductHoldingLines = new List<ProductHoldingLine>
                {
                    new ProductHoldingLine { CompanyId = "E098", ProductId = "WRITEOFF" },
                    new ProductHoldingLine { CompanyId = "E098", ProductId = "CREDITREFUNDS" },
                }
        };

        var productList = new List<FinOpsProductHolding> { writeOffProduct };

        // Act
        productList.ProcessProductHoldings(_validFinopsProducts);

        // Assert
        Assert.That(productList, Is.Empty);
    }
}
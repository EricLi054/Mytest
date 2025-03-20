using Membership.Services;
using Membership.Types.FinOps;
using Shared.Exceptions;
using Shared.Tests.Helpers;

namespace Membership.Tests.Services;

[TestFixture]
public class FinOpsServiceTests : BaseServiceTests<FinOpsService>
{
    private FinOpsService _finOpsService = null!;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.ProductHoldingsApiEndpointKey, "/productholdings");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "EXAMPLEAPIKEY");

        _finOpsService = new FinOpsService(HttpClient, ConfigurationMock.Object, HttpContextAccessorMock.Object,
            LoggerMock.Object);
    }

    [Test]
    public async Task GetProductHoldingListAsync_ValidParameters_ReturnsProductHoldingList()
    {
        // Arrange
        string customerAccount = "123";

        var expectedProductHoldingList = new List<ProductHolding>();

        var productHoldingHeaderResponse = new FinOpsResponse<List<ProductHolding>>
        {
            IsSuccess = true,
            Value = expectedProductHoldingList
        };

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage(productHoldingHeaderResponse);
        MockHttpResponse(responseMessage);

        // Act
        List<ProductHolding> result = await _finOpsService.GetProductHoldingListAsync(customerAccount);

        // Assert
        Assert.That(result, Is.EqualTo(expectedProductHoldingList));

        // Additional assertion to check the customer account in the result
        Assert.That(result.TrueForAll(ph => ph.CustAccount == customerAccount), Is.True, "Customer account in the result does not match the expected value.");
    }

    [Test]
    public void GetProductHoldingListAsync_ShouldThrowNotFoundException_WhenProductsNotFound()
    {
        var crmId = "1234";

        var responseMessage = HttpResponseHelper.CreateHttpResponseMessage<FinOpsResponse<List<ProductHolding>>?>(null);
        MockHttpResponse(responseMessage);

        Assert.ThrowsAsync<NotFoundException>(async () =>
            await _finOpsService.GetProductHoldingListAsync(crmId));
    }
}
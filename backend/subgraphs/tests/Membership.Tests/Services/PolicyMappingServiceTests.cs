using Membership.PolicyMappers;
using Membership.Services;
using Membership.Types.Products.AnnuityProducts;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Tests.Helpers;

namespace Membership.Tests.Services;

[TestFixture]
public class PolicyMappingServiceTests
{
    protected Mock<ILogger<PolicyMappingService>> LoggerMock = new();
    private PolicyMappingService _policyMappingService = null!;

    [SetUp]
    public void SetUp()
    {
        IEnumerable<IPolicyMapper> mappers =
        [
            new FinanceMapper(new Mock<ILogger<FinanceMapper>>().Object),
            new FinOpsMapper(new Mock<ILogger<FinOpsMapper>>().Object),
            new InsuranceMapper(new Mock<ILogger<InsuranceMapper>>().Object)

        ];

        _policyMappingService = new PolicyMappingService(mappers, LoggerMock.Object);
    }

    [Test]
    public void Map_ShouldReturnEmptyList_WhenMemberProductsHasNoAnnuityProducts()
    {
        // Arrange
        IEnumerable<AnnuityProduct> memberProducts = [];

        // Act
        var result = _policyMappingService.Map(memberProducts);

        // Assert
        Assert.That(result, Is.Empty);
    }

    [Test]
    public void Map_ShouldLogError_WhenNoMapperIsFoundForProductType()
    {
        // Arrange
        IEnumerable<AnnuityProduct> memberProducts =
        [
            new AnnuityProduct { BusinessType = "UnknownType" }
        ];

        // Act
        var result = _policyMappingService.Map(memberProducts);

        // Assert
        Assert.That(result, Is.Empty);
        LoggerMock.VerifyLog(LogLevel.Error, "No product mapper defined for UnknownType", Times.Once);
    }

    [Test]
    public void Map_ShouldAddPolicyDetails_WhenMapperIsAvailable()
    {
        // Arrange  
        IEnumerable<AnnuityProduct> memberProducts =
        [
            new FinanceProductHolding { BusinessType = "Finance" }
        ];

        // Act
        var result = _policyMappingService.Map(memberProducts);

        // Assert
        Assert.That(result.Count, Is.EqualTo(1));
        Assert.That(result[0].Type, Is.EqualTo(memberProducts.First().Type));
    }

    [Test]
    public void Map_ShouldContinueProcessing_WhenSomeProductsHaveNoMapper()
    {
        // Arrange
        IEnumerable<AnnuityProduct> memberProducts =
        [
            new FinanceProductHolding { BusinessType = "Finance" },
            new AnnuityProduct { BusinessType = "NotFinance" }
        ];

        // Act
        var result = _policyMappingService.Map(memberProducts);

        // Assert
        Assert.That(result.Count, Is.EqualTo(1));
        Assert.That(result[0].Type, Is.EqualTo(memberProducts.First().Type));
        LoggerMock.VerifyLog(LogLevel.Error, "No product mapper defined for NotFinance", Times.Once);
    }
}
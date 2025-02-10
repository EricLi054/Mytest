using DigitalPlatform.API.Helpers.ProductMapping;
using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using DigitalPlatform.API.Models.Products;
using Microsoft.Extensions.Logging;
using DigitalPlatform.API.Models.Products.AnnuityProducts;

namespace DigitalPlatform.Tests.Helpers.ProductMapping
{
    [TestFixture]
    public class MemberProductsMapperTests
    {
        private IProductMapperRepository _productMapperRepository;
        private ILogger<MemberProductsMapper> _logger;
        private MemberProductsMapper _mapper;

        [SetUp]
        public void SetUp()
        {
            _productMapperRepository = Substitute.For<IProductMapperRepository>();
            _logger = Substitute.For<ILogger<MemberProductsMapper>>();
            _mapper = new MemberProductsMapper(_productMapperRepository, _logger);
        }

        [Test]
        public void Map_ShouldReturnEmptyList_WhenMemberProductsHasNoAnnuityProducts()
        {
            // Arrange
            var memberProducts = new MemberProducts
            {
                AnnuityProducts = []
            };

            // Act
            var result = _mapper.Map(memberProducts);

            // Assert
            Assert.That(result, Is.Empty);
        }

        [Test]
        public void Map_ShouldLogError_WhenNoMapperIsFoundForProductType()
        {
            // Arrange
            var memberProducts = new MemberProducts
            {
                AnnuityProducts = new List<AnnuityProduct>
                {
                    new AnnuityProduct { BusinessType = "UnknownType" }
                }
            };

            _productMapperRepository.Get("UnknownType").Returns(null as IProductMapper);

            // Act
            var result = _mapper.Map(memberProducts);

            // Assert
            Assert.That(result, Is.Empty);
            _logger.Received(1).LogError("No product mapper defined for UnknownType");
        }

        [Test]
        public void Map_ShouldAddPolicyDetails_WhenMapperIsAvailable()
        {
            // Arrange
            var product = new AnnuityProduct { BusinessType = "Insurance" };
            var policyDetail = CreatePolicyDetails();

            var memberProducts = new MemberProducts
            {
                AnnuityProducts = new List<AnnuityProduct> { product }
            };

            var mockMapper = Substitute.For<IProductMapper>();
            mockMapper.Map(product).Returns(policyDetail);

            _productMapperRepository.Get("Insurance").Returns(mockMapper);

            // Act
            var result = _mapper.Map(memberProducts);

            // Assert
            Assert.That(result.Count, Is.EqualTo(1));
            Assert.That(result[0], Is.EqualTo(policyDetail));
        }

        [Test]
        public void Map_ShouldContinueProcessing_WhenSomeProductsHaveNoMapper()
        {
            // Arrange
            var productWithMapper = new AnnuityProduct { BusinessType = "Finance" };
            var productWithoutMapper = new AnnuityProduct { BusinessType = "UnknownType" };

            var policyDetail = CreatePolicyDetails();

            var memberProducts = new MemberProducts
            {
                AnnuityProducts = new List<AnnuityProduct> { productWithMapper, productWithoutMapper }
            };

            var mockMapper = Substitute.For<IProductMapper>();
            mockMapper.Map(productWithMapper).Returns(policyDetail);

            _productMapperRepository.Get("Finance").Returns(mockMapper);
            _productMapperRepository.Get("UnknownType").Returns(null as IProductMapper);

            // Act
            var result = _mapper.Map(memberProducts);

            // Assert
            Assert.That(result.Count, Is.EqualTo(1));
            Assert.That(result[0], Is.EqualTo(policyDetail));
            _logger.Received(1).LogError("No product mapper defined for UnknownType");
        }

        private PolicyDetail CreatePolicyDetails()
        {
            var policyDetail = new PolicyDetail
            {
                Type = "TypeA",
                Title = "Policy Title",
                Subtitle = "Policy Subtitle",
                PolicyItems =
                [
                    new PolicyItem { Label = "Item1", Value = "Value1" },
                    new PolicyItem { Label = "Item2", Value = "Value2" }
                ],
                Actions =
                [
                    new() {
                        Label = "Label",
                        Analytics = new Analytics{
                            Description = "Analytics"
                        }
                    }
                ]
            };

            return policyDetail;
        }
    }
}

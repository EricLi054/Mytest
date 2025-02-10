using DigitalPlatform.API.Models.Products.AnnuityProducts;
using DigitalPlatform.API.Helpers.ProductMapping;
using DigitalPlatform.API.Models;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.Tests.Helpers.ProductMapping
{
    [TestFixture]
    public class InsuranceMapperTests
    {
        private InsuranceMapper _mapper;

        private ILogger<InsuranceMapper> _mockLogger;

        [SetUp]
        public void Setup()
        {
            _mockLogger = Substitute.For<ILogger<InsuranceMapper>>();
            _mapper = new InsuranceMapper(_mockLogger);
        }

        [Test]
        public void Map_ShouldThrowNotSupportedException_WhenBusinessTypeIsNotInsurance()
        {
            // Arrange
            var product = new AnnuityProduct
            {
                BusinessType = "NotInsurance"
            };

            // Act & Assert
            var result = _mapper.Map(product);

            Assert.That(result, Is.Null);
            _mockLogger.Received(1).LogError("Not supported product type NotInsurance");
        }

        [Test]
        public void Map_ShouldThrowInvalidOperationException_WhenProductIsNotInsuranceProductHolding()
        {
            // Arrange
            var product = new AnnuityProduct
            {
                BusinessType = "Insurance"
            };

            // Act & Assert
            var result = _mapper.Map(product);

            Assert.That(result, Is.Null);
            _mockLogger.Received(1).LogError("Unexpected product type AnnuityProduct");
        }

        [Test]
        public void Map_ShouldMapFieldsCorrectly_WhenProductIsInsuranceProductHolding()
        {
            // Arrange
            InsuranceProductHolding insuranceProduct = CreateProduct();

            // Act
            var mappedPolicy = _mapper.Map(insuranceProduct);

            // Assert
            Assert.That(mappedPolicy?.Subtitle, Is.EqualTo(insuranceProduct.Asset));
            Assert.That(mappedPolicy?.SubtitleSecondary, Is.EqualTo(insuranceProduct.AssetDescription));

            var policyNumberItem = mappedPolicy?.PolicyItems.SingleOrDefault(x => x.Label.Equals("Policy no."));
            Assert.That(policyNumberItem?.Value, Is.EqualTo(insuranceProduct.PolicyNumber));
        }

        [Test]
        public void Map_ShouldMapActionsCorrectly_WhenActionsExist()
        {
            // Arrange
            var insuranceProduct = CreateProduct();
            insuranceProduct.Actions =
            [
                new CTALink
                {
                    Label = "Make a claim",
                    Colour = "secondary",
                    Link = "/claim"
                }
            ];

            // Act
            var mappedPolicy = _mapper.Map(insuranceProduct);

            // Assert
            Assert.That(mappedPolicy?.Actions.Count, Is.EqualTo(1));
            Assert.That(mappedPolicy?.Actions[0].Label, Is.EqualTo("Make a claim"));
            Assert.That(mappedPolicy?.Actions[0].Link, Is.EqualTo("/claim"));
            Assert.That(mappedPolicy?.Actions[0].Type, Is.EqualTo("secondary"));
        }

        [Test]
        public void Map_ShouldHandleHasClaimsInProgressFlagCorrectly()
        {
            // Arrange
            var insuranceProduct = CreateProduct();
            insuranceProduct.HasClaimsInProgress = true;
            insuranceProduct.Actions =
            [
                new CTALink
                {
                    Label = "Track your claim",
                    Link = "/track-claim"
                }
            ];

            // Act
            var mappedPolicy = _mapper.Map(insuranceProduct);

            // Assert
            Assert.That(mappedPolicy?.Actions.Count, Is.EqualTo(1));
            Assert.That(mappedPolicy?.Actions[0].Label, Is.EqualTo("Track your claim"));
            Assert.That(mappedPolicy?.Actions[0].Link, Is.EqualTo("/track-claim"));
        }

        [Test]
        public void Map_ShouldHandlePaymentMethodCorrectly_WhenPaymentMethodIsBankAccount()
        {
            // Arrange
            var insuranceProduct = new InsuranceProductHolding
            {
                BusinessType = "Insurance",
                NextPayment = "01 Jan 2025",
                NextPaymentAmount = "$200",
                PaymentMethodType = "Bank Account",
                BSB = "123-456",
                AccountNumber = "987654321"
            };

            // Act
            var mappedPolicy = _mapper.Map(insuranceProduct);

            // Assert
            Assert.That(mappedPolicy?.PolicyItems.Count, Is.EqualTo(4)); // Next payment, Policy no. Amount, Cover
            Assert.That(mappedPolicy?.PolicyItems[0].Label, Is.EqualTo("Next payment"));
            Assert.That(mappedPolicy?.PolicyItems[0].Value, Is.EqualTo("01 Jan 2025"));
            Assert.That(mappedPolicy?.PolicyItems[0].PaymentMethod?.Title, Is.EqualTo("Payment method"));
            Assert.That(mappedPolicy?.PolicyItems[0].PaymentMethod?.Type, Is.EqualTo("Bank Account"));
            Assert.That(mappedPolicy?.PolicyItems[0].PaymentMethod?.Bsb, Is.EqualTo("123-456"));
            Assert.That(mappedPolicy?.PolicyItems[0].PaymentMethod?.AccountNumber, Is.EqualTo("987654321"));
        }

        [Test]
        public void Map_ShouldHandleIsBundledFlagCorrectly()
        {
            // Arrange
            var insuranceProduct = new InsuranceProductHolding
            {
                BusinessType = "Insurance",
                Status = "Active",
                Asset = "Home Insurance",
                AssetDescription = "Home Coverage",
                RegistrationNumber = "REG12345",
                PolicyNumber = "POL12345",
                NextPayment = "01 Jan 2025",
                NextPaymentAmount = "$250",
                PaymentMethodType = "Bank Account",
                BSB = "123-456",
                AccountNumber = "987654321",
                Cover = "Building",
                HasClaimsInProgress = false
            };

            // Act
            var mappedPolicy = _mapper.Map(insuranceProduct);

            // Assert
            Assert.That(mappedPolicy?.PolicyItems.Count, Is.GreaterThan(0));
            Assert.That(mappedPolicy?.PolicyItems[2].Label, Is.EqualTo("Policy no."));
            Assert.That(mappedPolicy?.PolicyItems[2].Value, Is.EqualTo(insuranceProduct.PolicyNumber));
        }

        [Test]
        public void Map_ShouldPopulateSubActionsCorrectly_WhenSubActionsExist()
        {
            var insuranceProduct = CreateProduct();
            insuranceProduct.Actions =
            [
                new CTALink
                {
                    Label = "Make a claim",
                    Colour = "secondary",
                    Link = "/claim",
                    SubActions = new List<CTALink>
                    {
                        new CTALink
                        {
                            Label = "Track your claim",
                            Colour = "primary",
                            Link = "/track-claim"
                        },
                        new CTALink
                        {
                            Label = "Claim history",
                            Colour = "tertiary",
                            Link = "/claim-history"
                        }
                    }
                }
            ];

            var mappedPolicy = _mapper.Map(insuranceProduct);

            // Assert the main action
            Assert.That(mappedPolicy?.Actions.Count, Is.EqualTo(1));
            Assert.That(mappedPolicy?.Actions[0].Label, Is.EqualTo("Make a claim"));
            Assert.That(mappedPolicy?.Actions[0].Link, Is.EqualTo("/claim"));
            Assert.That(mappedPolicy?.Actions[0].Type, Is.EqualTo("secondary"));

            // Assert sub actions
            Assert.That(mappedPolicy?.Actions[0].SubActions.Count, Is.EqualTo(2));
            Assert.That(mappedPolicy?.Actions[0].SubActions[0].Label, Is.EqualTo("Track your claim"));
            Assert.That(mappedPolicy?.Actions[0].SubActions[0].Link, Is.EqualTo("/track-claim"));

            Assert.That(mappedPolicy?.Actions[0].SubActions[1].Label, Is.EqualTo("Claim history"));
            Assert.That(mappedPolicy?.Actions[0].SubActions[1].Link, Is.EqualTo("/claim-history"));
        }

        private static InsuranceProductHolding CreateProduct()
        {
            return new InsuranceProductHolding
            {
                BusinessType = "Insurance",
                Status = "Active",
                Asset = "Car",
                AssetDescription = "Car Description",
                RegistrationNumber = "ABC123",
                PolicyNumber = "POL12345",
                NextPayment = "01 Jan 2025",
                NextPaymentAmount = "$200",
                PaymentMethodType = "Bank Account",
                BSB = "123-456",
                AccountNumber = "987654321",
                Cover = "Comprehensive",
                HasClaimsInProgress = false
            };
        }
    }
}

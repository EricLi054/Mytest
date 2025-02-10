using DigitalPlatform.API.Helpers.ProductMapping;
using DigitalPlatform.API.Models;
using DigitalPlatform.API.Models.Products.AnnuityProducts;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.API.Tests.Helpers.ProductMapping
{
    [TestFixture]
    public class RSAMapperTests
    {
        private RSAMapper _mapper;

        private ILogger<RSAMapper> _mockLogger;

        [SetUp]
        public void SetUp()
        {
            _mockLogger = Substitute.For<ILogger<RSAMapper>>();
            _mapper = new RSAMapper(_mockLogger);
        }

        [Test]
        public void Map_ShouldReturnNullAndLogError_WhenBusinessTypeIsNotRSA()
        {
            // Arrange
            var product = new RoadsideProductHolding(new FinOpsProductFlags()) { BusinessType = "NonRSA" };

            // Act & Assert
            var result = _mapper.Map(product);

            Assert.That(result, Is.Null);
            _mockLogger.Received(1).LogError("Not supported product type NonRSA");
        }

        [Test]
        public void Map_ShouldReturnNullAndLogError_WhenProductIsNotRoadsideProductHolding()
        {
            // Arrange
            var product = new AnnuityProduct { BusinessType = "RSA" };

            // Act & Assert
            var result = _mapper.Map(product);

            Assert.That(result, Is.Null);
            _mockLogger.Received(1).LogError("Unexpected product type AnnuityProduct");
        }

        [Test]
        public void Map_ReturnsCorrectPolicyDetail_WhenValidRoadsideProduct()
        {
            // Arrange
            var roadsideProduct = new RoadsideProductHolding(new FinOpsProductFlags())
            {
                BusinessType = "RSA",
                Asset = new Vehicle { Year = "2022", Make = "Toyota", Model = "Corolla" },
                RegistrationNumber = "ABC123",
                NextPayment = "15 Dec 2023",
                NextPaymentAmount = "50.00",
                PaymentFrequency = "Monthly",
                PaymentMethodType = "Card",
                CardNumber = "XXXX-XXXX-XXXX-1234",
                CardExpiry = "12/25",
                TotalDueAmount = "200.00",
                ExpiryDate = "31 Dec 2023"
            };

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result?.Title, Is.EqualTo("Roadside Assistance"));
                Assert.That(result?.Subtitle, Is.EqualTo("2022 Toyota Corolla"));
                Assert.That(result?.RegistrationNumber, Is.EqualTo("ABC123"));
                Assert.That(result?.PolicyItems, Has.Count.EqualTo(4)); // Next payment, Amount, Expires, Cover
                Assert.That(result?.PolicyItems[0].Label, Is.EqualTo("Next payment"));
                Assert.That(result?.PolicyItems[0].PaymentMethod?.Type, Is.EqualTo("Card"));
                Assert.That(result?.PolicyItems[0].PaymentMethod?.CardNumber, Is.EqualTo("XXXX-XXXX-XXXX-1234"));
            });
        }

        [Test]
        public void MapPolicyItems_AddsBundledAmount_WhenProductIsBundled()
        {
            // Arrange
            var roadsideProduct = CreateRoadsideProduct();
            roadsideProduct.ProductFlags.IsBundled = true;
            roadsideProduct.BundledProducts = [
                new BundledProduct
                {
                    ProductName = "Product A",
                    Asset = new Vehicle { Year = "2021", Make = "Honda", Model = "Civic" },
                    RegistrationNumber = "XYZ789"
                }
            ];

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            var amountItem = result?.PolicyItems.FirstOrDefault(pi => pi.Label == "Amount");
            Assert.That(amountItem, Is.Not.Null);
            Assert.That(amountItem?.BundledAmount, Is.Not.Null);
            Assert.That(amountItem?.BundledAmount?.BundledProducts, Has.Count.EqualTo(1));
            Assert.That(amountItem?.BundledAmount?.BundledProducts[0].ProductName, Is.EqualTo("Product A"));
        }

        [Test]
        public void MapActions_AlwayReturnViewCoverAction()
        {
            // Arrange
            RoadsideProductHolding roadsideProduct = CreateRoadsideProduct();

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            Assert.That(result?.Actions, Has.Count.EqualTo(1));
            Assert.That(result?.Actions[0].Label, Is.EqualTo("View cover"));
        }

        [Test]
        public void MapAlerts_ReturnsExpectedAlerts()
        {
            // Arrange
            var roadsideProduct = CreateRoadsideProduct();

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            Assert.That(result?.Alerts, Has.Count.EqualTo(1));
            Assert.That(result?.Alerts?[0].Message, Does.Contain("To update your vehicle details"));
        }

        [Test]
        public void MapActions_ReturnsCorrectActions_WhenProductHasActions()
        {
            // Arrange
            var roadsideProduct = CreateRoadsideProduct(new FinOpsProductFlags
            {
                ShowPayNow = true,
                IsRewards = false,
                IsNotBundledOrFirstInBundle = true
            });
            roadsideProduct.UPN = "123456789";
            roadsideProduct.ViewMembershipOrCoverLink = "/membership-benefits/view-cover";

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result?.Actions, Is.Not.Empty, "Actions should not be empty.");
                var payNowAction = result?.Actions.FirstOrDefault(a => a.Label == "Pay Now");
                Assert.That(payNowAction, Is.Not.Null, "Pay Now action should exist.");
                Assert.That(payNowAction?.Link, Is.EqualTo("/membership-benefits/pay-a-bill?PaymentNumber=123456789"));
                Assert.That(payNowAction?.Type, Is.EqualTo("primary"));

                var viewCoverAction = result?.Actions.FirstOrDefault(a => a.Label == "View cover");
                Assert.That(viewCoverAction, Is.Not.Null, "View cover action should exist.");
                Assert.That(viewCoverAction?.Link, Is.EqualTo("/membership-benefits/view-cover"));
            });
        }

        [Test]
        public void MapActions_ReturnsManageActionWithSubActions_WhenProductHasSubActions()
        {
            // Arrange
            var roadsideProduct = CreateRoadsideProduct(new FinOpsProductFlags
            {
                IsDirectDebit = true,
                DirectDebitAllowed = true,
                ShowPayNow = false
            });
            roadsideProduct.HeaderId = "987654";
            roadsideProduct.Version = "1";

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            Assert.Multiple(() =>
            {
                var manageAction = result?.Actions.FirstOrDefault(a => a.Label == "Manage");
                Assert.That(manageAction, Is.Not.Null, "Manage action should exist.");
                Assert.That(manageAction?.SubActions, Is.Not.Empty, "Manage action should have subactions.");

                var changeDirectDebitAction = manageAction?.SubActions.FirstOrDefault(sa => sa.Label == "Change direct debit");
                Assert.That(changeDirectDebitAction, Is.Not.Null, "Change direct debit subaction should exist.");
                Assert.That(changeDirectDebitAction?.Link, Is.EqualTo("/myrac/change-direct-debit?phhid=987654"));

                var changeFrequencyAction = manageAction?.SubActions.FirstOrDefault(sa => sa.Label == "Change direct debit frequency");
                Assert.That(changeFrequencyAction, Is.Not.Null, "Change direct debit frequency subaction should exist.");
                Assert.That(changeFrequencyAction?.Link, Is.EqualTo("/myrac/change-frequency?phhid=987654"));
            });
        }

        [Test]
        public void MapActions_AddsYourSavingsAction_WhenProductIsRewards()
        {
            // Arrange
            var roadsideProduct = CreateRoadsideProduct(new FinOpsProductFlags
            {
                IsRewards = true,
                ShowPayNow = false
            });

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            Assert.Multiple(() =>
            {
                var yourSavingsAction = result?.Actions.FirstOrDefault(a => a.Label == "Your savings");
                Assert.That(yourSavingsAction, Is.Not.Null, "Your savings action should exist.");
                Assert.That(yourSavingsAction?.Link, Is.EqualTo("/myrac/savings"));
            });
        }

        [Test]
        public void MapActions_AddsPayNowAction_WhenShowPayNowIsTrue()
        {
            // Arrange
            var roadsideProduct = CreateRoadsideProduct(new FinOpsProductFlags
            {
                ShowPayNow = true,
                IsNotBundledOrFirstInBundle = true
            });
            roadsideProduct.NextPayment = string.Empty;
            roadsideProduct.ShowPayNow = true;
            roadsideProduct.UPN = "123456789";
            roadsideProduct.Title = "Roadside Assistance Classic";

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result?.Actions, Is.Not.Empty, "Actions should not be empty.");
                var payNowAction = result?.Actions.FirstOrDefault(a => a.Label == "Pay Now");
                Assert.That(payNowAction, Is.Not.Null, "Pay Now action should exist.");
                Assert.That(payNowAction?.Link, Is.EqualTo("/membership-benefits/pay-a-bill?PaymentNumber=123456789"), "Pay Now link should be correct.");
                Assert.That(payNowAction?.Type, Is.EqualTo("primary"), "Pay Now action should have the primary color.");

                // Assert Policy Items
                Assert.That(result?.PolicyItems, Is.Not.Empty, "PolicyItems should not be empty.");

                // Verify BPay Policy Item
                var bpayItem = result?.PolicyItems.FirstOrDefault(pi => pi.Label == "Bpay");
                Assert.That(bpayItem, Is.Not.Null, "Bpay policy item should exist.");
                Assert.That(bpayItem?.Value, Is.EqualTo("Biller code: 337097   Ref: 123456789"), "Bpay policy item value should be correct.");

                // Verify Amount Policy Item
                var amountItem = result?.PolicyItems.FirstOrDefault(pi => pi.Label == "Amount");
                Assert.That(amountItem, Is.Not.Null, "Amount policy item should exist.");
                Assert.That(amountItem?.Value, Is.EqualTo("$200.00"), "Amount policy item value should be correct.");

                // Verify Expiry Policy Item
                var expiryItem = result?.PolicyItems.FirstOrDefault(pi => pi.Label == "Expires");
                Assert.That(expiryItem, Is.Not.Null, "Expiry policy item should exist.");
                Assert.That(expiryItem?.Value, Is.EqualTo("31 Dec 2023"), "Expiry policy item value should be correct.");

                // Verify Cover Policy Item
                var coverItem = result?.PolicyItems.FirstOrDefault(pi => pi.Label == "Cover");
                Assert.That(coverItem, Is.Not.Null, "Cover policy item should exist.");
                Assert.That(coverItem?.Value, Is.EqualTo("Classic"), "Cover policy item value should be correct.");
            });
        }

        [Test]
        public void Map_AddsBundledPayNowPolicyItems_WhenShowPayNowAndIsBundledAreTrue()
        {
            // Arrange
            var roadsideProduct = CreateRoadsideProduct(new FinOpsProductFlags
            {
                ShowPayNow = true,
                IsBundled = true,
                IsNotBundledOrFirstInBundle = true
            });

            roadsideProduct.NextPayment = string.Empty;
            roadsideProduct.ShowPayNow = true;
            roadsideProduct.UPN = "987654321";
            roadsideProduct.Title = "Roadside Assistance Classic";
            roadsideProduct.BundledProducts =
            [
                new BundledProduct
                {
                    ProductName = "Additional Vehicle Cover",
                    Asset = new Vehicle { Year = "2023", Make = "Toyota", Model = "Camry" },
                    RegistrationNumber = "ABC123"
                },
                new BundledProduct
                {
                    ProductName = "Trailer Cover",
                    Asset = new Vehicle { Year = "2020", Make = "Honda", Model = "CR-V" },
                    RegistrationNumber = "XYZ789"
                }
            ];

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            Assert.Multiple(() =>
            {
                // Assert Actions
                Assert.That(result?.Actions, Is.Not.Empty, "Actions should not be empty.");
                var payNowAction = result?.Actions.FirstOrDefault(a => a.Label == "Pay Now");
                Assert.That(payNowAction, Is.Not.Null, "Pay Now action should exist.");
                Assert.That(payNowAction?.Link, Is.EqualTo("/membership-benefits/pay-a-bill?PaymentNumber=987654321"), "Pay Now link should be correct.");
                Assert.That(payNowAction?.Type, Is.EqualTo("primary"), "Pay Now action should have the primary color.");

                // Assert Policy Items
                Assert.That(result?.PolicyItems, Is.Not.Empty, "PolicyItems should not be empty.");

                // Verify BPay Policy Item
                var bpayItem = result?.PolicyItems.FirstOrDefault(pi => pi.Label == "Bpay");
                Assert.That(bpayItem, Is.Not.Null, "Bpay policy item should exist.");
                Assert.That(bpayItem?.Value, Is.EqualTo("Biller code: 337097   Ref: 987654321"), "Bpay policy item value should be correct.");

                // Verify Amount Policy Item
                var amountItem = result?.PolicyItems.FirstOrDefault(pi => pi.Label == "Amount");
                Assert.That(amountItem, Is.Not.Null, "Amount policy item should exist.");
                Assert.That(amountItem?.Value, Is.EqualTo("$200.00"), "Amount policy item value should be correct.");
                Assert.That(amountItem?.BundledAmount, Is.Not.Null, "Amount policy item should include bundled information.");
                Assert.That(amountItem?.BundledAmount?.Message, Is.EqualTo("The payments for the following products are bundled together in a payment of 200.00:"), "Bundled amount message should be correct.");
                Assert.That(amountItem?.BundledAmount?.BundledProducts, Has.Count.EqualTo(2), "Bundled products should include all related products.");

                // Verify Bundled Products
                var bundledProducts = amountItem?.BundledAmount?.BundledProducts;
                Assert.That(bundledProducts, Is.Not.Empty);
#pragma warning disable CS8604 // Possible null reference argument.

                Assert.That(bundledProducts.Any(bp => bp.ProductName == "Additional Vehicle Cover" &&
                                                        bp.Asset == "2023 Toyota Camry ABC123"), "Bundled product 'Additional Vehicle Cover' should be correct.");
#pragma warning restore CS8604 // Possible null reference argument.

                Assert.That(bundledProducts.Any(bp => bp.ProductName == "Trailer Cover" &&
                                                        bp.Asset == "2020 Honda CR-V XYZ789"), "Bundled product 'Trailer Cover' should be correct.");

                // Verify Expiry Policy Item
                var expiryItem = result?.PolicyItems.FirstOrDefault(pi => pi.Label == "Expires");
                Assert.That(expiryItem, Is.Not.Null, "Expiry policy item should exist.");
                Assert.That(expiryItem?.Value, Is.EqualTo("31 Dec 2023"), "Expiry policy item value should be correct.");

                // Verify Cover Policy Item
                var coverItem = result?.PolicyItems.FirstOrDefault(pi => pi.Label == "Cover");
                Assert.That(coverItem, Is.Not.Null, "Cover policy item should exist.");
                Assert.That(coverItem?.Value, Is.EqualTo("Classic"), "Cover policy item value should be correct.");
            });
        }

        [Test]
        public void Map_ShouldNotPopulateAlert_WhenProductTypeIsRewards()
        {
            // Arrange
            var roadsideProduct = CreateRoadsideProduct(new FinOpsProductFlags { IsRewards = true });
            roadsideProduct.Type = "REWARDS";
            roadsideProduct.Alert = "This should not be there"; // Default state

            // Act
            var result = _mapper.Map(roadsideProduct);

            // Assert
            Assert.That(result?.Alerts, Is.Null.Or.Empty, "Alert should not be populated for REWARDS product type.");
        }

        [Test]
        public void MapAlerts_ShouldPopulateAlert_WhenProductTypeIsNotRewards()
        {
            // Arrange
            var roadsideProduct = CreateRoadsideProduct();
            var expectedAlert = new API.Models.Data.Products.PolicyDetails.Alert
            {
                Severity = "info",
                Message = "To update your vehicle details, call us on {13 17 03|tel:13 17 03} or visit a {member service centre|/about-rac/contact-us/find-a-branch}"
            };

            // Act
            var result = _mapper.Map(roadsideProduct);
            var alerts = result?.Alerts;

            // Assert
            Assert.That(alerts, Is.Not.Null.Or.Empty);
            Assert.That(alerts?.Count, Is.EqualTo(1), "Expected exactly one alert.");
            Assert.That(alerts?[0]?.Severity, Is.EqualTo(expectedAlert.Severity), "Alert severity does not match.");
            Assert.That(alerts?[0].Message, Is.EqualTo(expectedAlert.Message), "Alert message does not match.");
        }

        private static RoadsideProductHolding CreateRoadsideProduct(FinOpsProductFlags? finOpsProductFlags = null)
        {
            finOpsProductFlags ??= new FinOpsProductFlags();

            return new RoadsideProductHolding(finOpsProductFlags)
            {
                BusinessType = "RSA",
                Asset = new Vehicle { Year = "2022", Make = "Toyota", Model = "Corolla" },
                RegistrationNumber = "ABC123",
                PaymentMethodType = "Card",
                CardNumber = "XXXX-XXXX-XXXX-1234",
                CardExpiry = "12/25",
                TotalDueAmount = "200.00",
                ExpiryDate = "31 Dec 2023",
                NextPayment = "15 Dec 2023",
                NextPaymentAmount = "75.00",
                PaymentFrequency = "Monthly"
            };
        }
    }
}
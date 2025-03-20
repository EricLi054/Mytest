using Membership.Types.FinOps;
using Membership.Types.Products;
using Membership.Types.Products.AnnuityProducts;

namespace Membership.Tests.Types.Products.AnnuityProducts;

[TestFixture]
public class RoadsideProductHoldingTests
{
    private ProductHolding _annualProductHeader = new()
    {
        CustAccount = "123",
        CompanyId = "456",
        ProductHoldingHeaderId = "PH12345678",
        ProductHoldingLines =
        [
            new()
            {
                CompanyId = "E098",
                ProductId = "CLAS",
                ProductName = "Classic Roadside Assistance"
            }
        ],
        TotalDueAmount = 0
    };

    private ProductHolding _directDebitProductHeader = new()
    {
        CustAccount = "123",
        CompanyId = "456",
        ProductHoldingHeaderId = "PH12345678",
        ProductHoldingLines =
        [
            new()
            {
                CompanyId = "E098",
                ProductId = "CLAS",
                ProductName = "Classic Roadside Assistance"
            }
        ],
        PaymentMode = "DDBA",
        ProductHoldingPaymSched =
        [
            new ProductHoldingPaymentSchedule
            {
                DueDate = DateTime.Today.AddDays(10000),
                Amount = 100,
                RemainingAmount = 100
            }
        ],
        PaymentScheduleId = "Monthly",
        PaymentDetail = new PaymentDetail
        {
            BankShortName = "Bank",
            BankBsb = "123456",
            BankAccountNum = "123456789"
        }
    };

    [Test]
    public void Actions_WhenRoadsideIsShowPayNow_ReturnsCorrectActions()
    {
        var flags = new FinOpsProductFlags
        {
            ShowPayNow = true,
            IsNotBundledOrFirstInBundle = true,
            IsUpgradeDowngradeEligible = true,
            DirectDebitAllowed = true,
            CanUpdateVehicle = true
        };
        var productHeader = _annualProductHeader;
        productHeader.TotalDueAmount = 100;
        var roadsideProductHolding = new RoadsideProductHolding(productHeader, productHeader.ProductHoldingLines.First(), flags);

        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "Pay Now"), Is.EqualTo(true));
        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "View cover"), Is.EqualTo(true));
        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(true));
        var manageActions = roadsideProductHolding?.Actions?.Find(action => action.Label == "Manage")?.SubActions;
        Assert.That(manageActions?.Exists(action => action.Label == "Update your vehicle"), Is.EqualTo(true));
    }

    [Test]
    public void Actions_WhenRoadsideIsAnnual_ReturnsCorrectActions()
    {
        var flags = new FinOpsProductFlags
        {
            IsNotBundledOrFirstInBundle = true,
            IsUpgradeDowngradeEligible = true,
            DirectDebitAllowed = true,
            CanUpdateVehicle = true
        };
        var roadsideProductHolding = new RoadsideProductHolding(_annualProductHeader, _annualProductHeader.ProductHoldingLines.First(), flags);

        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "View cover"), Is.EqualTo(true));
        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(true));
        var manageActions = roadsideProductHolding?.Actions?.Find(action => action.Label == "Manage")?.SubActions;
        Assert.That(manageActions?.Exists(action => action.Label == "Change cover level"), Is.EqualTo(true));
        Assert.That(manageActions?.Exists(action => action.Label == "Setup direct debit"), Is.EqualTo(true));
        Assert.That(manageActions?.Exists(action => action.Label == "Update your vehicle"), Is.EqualTo(true));
    }

    [Test]
    public void Actions_WhenRoadsideIsDirectDebit_ReturnsCorrectActions()
    {
        var flags = new FinOpsProductFlags
        {
            IsDirectDebit = true,
            IsNotBundledOrFirstInBundle = true,
            IsUpgradeDowngradeEligible = true,
            DirectDebitAllowed = true,
            CanUpdateVehicle = true
        };
        var roadsideProductHolding = new RoadsideProductHolding(_directDebitProductHeader, _directDebitProductHeader.ProductHoldingLines.First(), flags);

        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "View cover"), Is.EqualTo(true));
        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(true));
        var manageActions = roadsideProductHolding?.Actions?.Find(action => action.Label == "Manage")?.SubActions;
        Assert.That(manageActions?.Exists(action => action.Label == "Change cover level"), Is.EqualTo(true));
        Assert.That(manageActions?.Exists(action => action.Label == "Change direct debit"), Is.EqualTo(true));
        Assert.That(manageActions?.Exists(action => action.Label == "Change direct debit frequency"), Is.EqualTo(true));
        Assert.That(manageActions?.Exists(action => action.Label == "Update your vehicle"), Is.EqualTo(true));
    }

    [Test]
    public void Actions_WhenRoadsideIsDealershipMembership_ReturnsCorrectActions()
    {
        var flags = new FinOpsProductFlags
        {
            IsFordRoadside = true,
            IsUpgradeDowngradeEligible = false,
            DirectDebitAllowed = false,
            CanUpdateVehicle = false
        };
        var productHeader = _directDebitProductHeader;
        productHeader.ProductHoldingLines =
        [
            new()
            {
                CompanyId = "E098",
                ProductId = "FSTDCMO",
                ProductName = "Ford Roadside Assistance"
            }
        ];
        var roadsideProductHolding = new RoadsideProductHolding(productHeader, productHeader.ProductHoldingLines.First(), flags);

        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "View cover"), Is.EqualTo(true));
        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(false));
    }

    [Test]
    public void Actions_WhenRewards_ReturnsCorrectActions()
    {
        var flags = new FinOpsProductFlags
        {
            IsRewards = true,
            IsDirectDebit = true,
            IsUpgradeDowngradeEligible = false,
            DirectDebitAllowed = false,
            CanUpdateVehicle = false
        };

        var productHeader = _directDebitProductHeader;
        productHeader.ProductHoldingLines =
        [
            new()
            {
                CompanyId = "E098",
                ProductId = "REWARDS",
                ProductName = "Rewards"
            }
        ];

        var roadsideProductHolding = new RoadsideProductHolding(productHeader, productHeader.ProductHoldingLines.First(), flags);

        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "View membership"), Is.EqualTo(true));
        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(false));

        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "View membership"), Is.EqualTo(true));
        Assert.That(roadsideProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(false));
    }

    [Test]
    public void Actions_WhenBundledPayNow_BothReturnCorrectActions()
    {
        ProductHolding bundledProductHeader = _annualProductHeader;
        bundledProductHeader.ProductHoldingLines =
        [
            new()
            {
                CompanyId = "E098",
                ProductId = "STD",
                ProductName = "Standard Roadside Assistance",
                ProductHoldingId = "RSA000122143412",
            },
            new()
            {
                CompanyId = "E098",
                ProductId = "CLAS",
                ProductName = "Classic Roadside Assistance",
                ProductHoldingId = "RSA000122143413",
            }
        ];

        var firstProductHolding = new RoadsideProductHolding(bundledProductHeader, bundledProductHeader.ProductHoldingLines.ElementAt(0), new FinOpsProductFlags
        {
            ShowPayNow = true,
            IsNotBundledOrFirstInBundle = true,
            IsUpgradeDowngradeEligible = true,
            DirectDebitAllowed = true,
            CanUpdateVehicle = true
        });
        var secondProductHolding = new RoadsideProductHolding(bundledProductHeader, bundledProductHeader.ProductHoldingLines.ElementAt(1), new FinOpsProductFlags
        {
            ShowPayNow = true,
            IsNotBundledOrFirstInBundle = false,
            IsUpgradeDowngradeEligible = true,
            DirectDebitAllowed = true,
            CanUpdateVehicle = true
        });

        Assert.That(firstProductHolding?.Actions?.Exists(action => action.Label == "Pay Now"), Is.EqualTo(true));
        Assert.That(firstProductHolding?.Actions?.Exists(action => action.Label == "View cover"), Is.EqualTo(true));
        Assert.That(firstProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(true));
        var firstManageActions = firstProductHolding?.Actions?.Find(action => action.Label == "Manage")?.SubActions;
        Assert.That(firstManageActions?.Exists(action => action.Label == "Update your vehicle"), Is.EqualTo(true));
        Assert.That(secondProductHolding?.Actions?.Exists(action => action.Label == "View cover"), Is.EqualTo(true));
        Assert.That(secondProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(true));
        var secondManageActions = secondProductHolding?.Actions?.Find(action => action.Label == "Manage")?.SubActions;
        Assert.That(secondManageActions?.Exists(action => action.Label == "Update your vehicle"), Is.EqualTo(true));
    }

    [Test]
    public void Actions_WhenBundledDirectDebit_BothReturnCorrectActions()
    {
        ProductHolding bundledProductHeader = _directDebitProductHeader;
        bundledProductHeader.ProductHoldingLines =
        [
            new()
            {
                CompanyId = "E098",
                ProductId = "STD",
                ProductName = "Standard Roadside Assistance",
                ProductHoldingId = "RSA000122143412",
            },
            new()
            {
                CompanyId = "E098",
                ProductId = "CLAS",
                ProductName = "Classic Roadside Assistance",
                ProductHoldingId = "RSA000122143413",
            }
        ];

        var firstProductHolding = new RoadsideProductHolding(bundledProductHeader, bundledProductHeader.ProductHoldingLines.ElementAt(0), new FinOpsProductFlags
        {
            IsDirectDebit = true,
            IsNotBundledOrFirstInBundle = true,
            IsUpgradeDowngradeEligible = true,
            DirectDebitAllowed = true,
            CanUpdateVehicle = true
        });
        var secondProductHolding = new RoadsideProductHolding(bundledProductHeader, bundledProductHeader.ProductHoldingLines.ElementAt(1), new FinOpsProductFlags
        {
            IsDirectDebit = true,
            IsNotBundledOrFirstInBundle = false,
            IsUpgradeDowngradeEligible = true,
            DirectDebitAllowed = true,
            CanUpdateVehicle = true
        });

        Assert.That(firstProductHolding?.Actions?.Exists(action => action.Label == "View cover"), Is.EqualTo(true));
        Assert.That(firstProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(true));
        var firstManageActions = firstProductHolding?.Actions?.Find(action => action.Label == "Manage")?.SubActions;
        Assert.That(firstManageActions?.Exists(action => action.Label == "Change direct debit"), Is.EqualTo(true));
        Assert.That(firstManageActions?.Exists(action => action.Label == "Change direct debit frequency"), Is.EqualTo(true));
        Assert.That(firstManageActions?.Exists(action => action.Label == "Update your vehicle"), Is.EqualTo(true));
        Assert.That(secondProductHolding?.Actions?.Exists(action => action.Label == "View cover"), Is.EqualTo(true));
        Assert.That(secondProductHolding?.Actions?.Exists(action => action.Label == "Manage"), Is.EqualTo(true));
        var secondManageActions = secondProductHolding?.Actions?.Find(action => action.Label == "Manage")?.SubActions;
        Assert.That(secondManageActions?.Exists(action => action.Label == "Change direct debit"), Is.EqualTo(true));
        Assert.That(secondManageActions?.Exists(action => action.Label == "Change direct debit frequency"), Is.EqualTo(true));
        Assert.That(secondManageActions?.Exists(action => action.Label == "Update your vehicle"), Is.EqualTo(true));
    }

    [Test]
    public void BankDetails_WhenProductIsDDBA_ReturnsMaskedBankAccountDetails()
    {
        var flags = new FinOpsProductFlags
        {
            IsNotBundledOrFirstInBundle = true
        };
        var roadsideProductHolding = new RoadsideProductHolding(_directDebitProductHeader, _directDebitProductHeader.ProductHoldingLines.First(), flags);

        Assert.That(roadsideProductHolding.BSB, Is.EqualTo("***456"));
        Assert.That(roadsideProductHolding.AccountNumber, Is.EqualTo("****56789"));
    }

}
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models;
using DigitalPlatform.API.Models.Products;
using DigitalPlatform.API.Models.Products.AnnuityProducts;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;
using DigitalPlatform.API.Tests.Data;
using Microsoft.Extensions.Configuration;
using DigitalPlatform.API.Services;
using DigitalPlatform.API.Models.SourceSystem.Finance;
using DigitalPlatform.API.Models.SourceSystem.Insurance;
using DigitalPlatform.API.Descriptors;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class ProductServiceTests
{
    private readonly IPersonService _personService;
    private readonly IInsuranceService _insuranceService;
    private readonly IFinanceService _financeService;
    private readonly IFinOpsService _finOpsService;
    private readonly IProductService _productService;
    private readonly IConfiguration _configuration;
    private readonly IFeatureService _featureService;
    private readonly ILogger<ProductService> _logger;

    public ProductServiceTests()
    {
        _personService = Substitute.For<IPersonService>();
        _insuranceService = Substitute.For<IInsuranceService>();
        _financeService = Substitute.For<IFinanceService>();
        _finOpsService = Substitute.For<IFinOpsService>();
        _configuration = Substitute.For<IConfiguration>();
        _featureService = Substitute.For<IFeatureService>();
        _logger = Substitute.For<ILogger<ProductService>>();
        _configuration[ConfigDescriptors.FINOPS_PRODUCTS].Returns(FinOpsTestData.FinOpsProductsJson);
        _productService = new ProductService(_personService, _insuranceService, _financeService, _finOpsService, _configuration, _featureService, _logger);
    }

    [Test]
    public void GetProducts_PersonIsNull_ThrowsException()
    {
        // Arrange
        var crmId = "123";
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(Task.FromResult<Person>(null!));

        // Act & Assert
        Assert.ThrowsAsync<Exception>(async () => await _productService.GetProducts(crmId, sessionKey));
    }

    [Test]
    public async Task GetProducts_PersonIsNotNull_ProcessesFinOpsData()
    {
        // Arrange
        var crmId = "123";
        var person = new Person { RacId = "456" };
        var crmProducts = new PersonProducts
        {
            ProductHoldings = []
        };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(crmProducts);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.ValidProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(InsuranceTestData.EmptySummary);
        _financeService.GetProductList(Arg.Any<string>()).Returns(new FinanceProductResponse());

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        await _finOpsService.Received(1).GetProductHoldingList(person.RacId, Arg.Any<string>(), Arg.Any<string>());
        Assert.That(result.AnnuityProducts?.Count, Is.EqualTo(1));
    }

    private static object[] GetInsuranceCases = {
        new object[] { "BGP12345678", InsuranceTestData.ValidBoatInsuranceProductResponse, InsuranceTestData.ValidBoatInsuranceProductHolding, InsuranceTestData.ValidBoatPolicy },
        new object[] { "MGP12345678", InsuranceTestData.ValidMotorInsuranceProductResponse1, InsuranceTestData.ValidCarInsuranceProductHoldingWithNoClaims, InsuranceTestData.ValidMotorPolicy1 },
        new object[] { "MGP23456789", InsuranceTestData.ValidMotorInsuranceProductResponse2, InsuranceTestData.ValidCarInsuranceProductHoldingWithOneClaim, InsuranceTestData.ValidMotorPolicy2 },
        new object[] { "MGP34567890", InsuranceTestData.ValidMotorInsuranceProductResponse3, InsuranceTestData.ValidCarInsuranceProductHoldingWithClaims, InsuranceTestData.ValidMotorPolicy3 },
        new object[] { "MGV12345678", InsuranceTestData.ValidCaravanInsuranceProductResponse, InsuranceTestData.ValidCaravanInsuranceProductHolding, InsuranceTestData.ValidCaravanPolicy },
        new object[] { "MGE12345678", InsuranceTestData.ValidElectricMobilityScooterInsuranceProductResponse, InsuranceTestData.ValidElectricMobilityScooterInsuranceProductHolding, InsuranceTestData.ValidElectricMobilityScooterPolicy },
        new object[] { "HGP12345678", InsuranceTestData.ValidHomeInsuranceProductResponseWithInstallments, InsuranceTestData.ValidHomeInsuranceProductHolding, InsuranceTestData.ValidHomePolicy },
        new object[] { "MGC12345678", InsuranceTestData.ValidMotorcycleInsuranceProductResponse, InsuranceTestData.ValidMotorcycleInsuranceProductHolding, InsuranceTestData.ValidMotorcyclePolicy },
        new object[] { "PET12345678", InsuranceTestData.ValidPetInsuranceProductResponseWithNextPayableInstallment, InsuranceTestData.ValidPetInsuranceProductHolding, InsuranceTestData.ValidPetPolicy }
    };

    [Test, TestCaseSource(nameof(GetInsuranceCases))]
    public async Task GetProducts_PersonIsNotNull_ProcessesInsuranceData(string productNumber, InsuranceProductResponse product, InsuranceProductHolding productHolding, PolicyDetail policy)
    {
        // Arrange
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        string b2cUrl = InsuranceTestData.B2CUrl;
        var sessionKey = "otpSession";

        _configuration[ConfigDescriptors.INSURANCE_B2C_URL].Returns(b2cUrl);
        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(person.PersonSystemIds![0].SystemId).Returns(InsuranceTestData.SummaryWithSinglePolicy(policy));
        _insuranceService.GetContactByExternalShieldNumber(person.PersonSystemIds![0].SystemId).Returns(InsuranceTestData.ValidContact);
        _insuranceService.GetInsurancePolicies(productNumber).Returns(product);
        _financeService.GetProductList(Arg.Any<string>()).Returns(new FinanceProductResponse());

        var expectedResult = new MemberProducts
        {
            AnnuityProducts = [
                productHolding
            ]
        };

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result.AnnuityProducts, Is.Not.Null);
            Assert.That(result.AnnuityProducts.Count, Is.EqualTo(1));
            var resultJson = JsonSerializer.Serialize(result);
            var expectedResultJson = JsonSerializer.Serialize(expectedResult);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
        });
    }

    [Test]
    public async Task GetProducts_UnsupportedInsuranceProductType_DoesNotReturnInsuranceProducts()
    {
        // Arrange
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        string b2cUrl = InsuranceTestData.B2CUrl;
        var sessionKey = "otpSession";

        _configuration[ConfigDescriptors.INSURANCE_B2C_URL].Returns(b2cUrl);
        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(person.PersonSystemIds![0].SystemId).Returns(InsuranceTestData.SummaryWithInvalidPolicyList);
        _insuranceService.GetContactByExternalShieldNumber(person.PersonSystemIds![0].SystemId).Returns(InsuranceTestData.ValidContact);
        _insuranceService.GetInsurancePolicies("MGP12345678").Returns(InsuranceTestData.InvalidInsuranceProductResponse);
        _financeService.GetProductList(Arg.Any<string>()).Returns(new FinanceProductResponse());

        var result = await _productService.GetProducts(crmId, sessionKey);

        //assert that none of the annuity products in result are of type InsuranceProductHolding
        Assert.Multiple(() =>
        {
            var insuranceProducts = result.AnnuityProducts?.FindAll(product => product.Type == BusinessType.Insurance.ToString());
            Assert.That(insuranceProducts?.Count, Is.EqualTo(0));
        });
    }

    [Test]
    public async Task GetProducts_PersonIsNotNull_ProcessesFinanceData()
    {
        // Arrange
        var crmId = "123";
        var person = new Person { PersonSystemIds = [] };
        var crmProducts = new PersonProducts
        {
            ProductHoldings = [
                new PersonProductHolding
                {
                    ProductId = Guid.NewGuid(),
                    ProductBusinessType = "Finance",
                    ProductStatus = "active",
                    SourceId = "123",
                    EndDate = DateTime.Now.AddDays(30),
                    StartDate = DateTime.Now.AddDays(-30),
                    ProductStatusReason = "Active",
                    Product = "Finance Product",
                    ProductNumber = "123456"
                }
            ]
        };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(crmProducts);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns([]);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetProductList(Arg.Any<string>()).Returns(FinanceTestData.ValidFinanceProductResponse);

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        await _financeService.Received(1).GetProductList(Arg.Any<string>());
        Assert.Multiple(() =>
        {
            Assert.That(result.AnnuityProducts[0].BusinessType, Is.EqualTo("Finance"));
        });
    }

    [TestCase(true, true, Category = "MemberActionsVisibility")]
    [TestCase(false, false, Category = "MemberActionsVisibility")]
    public async Task GivenProductsThatCanShowPayNow_WhenCheckingPayNowAction_ShowsCorrectAction(bool showPayNow, bool expectedPayNowAction)
    {
        // Arrange
        var productFlags = new FinOpsProductFlags
        {
            ShowPayNow = showPayNow,
            IsNotBundledOrFirstInBundle = true,
            IsUpgradeDowngradeEligible = true,
            DirectDebitAllowed = true
        };

        var sessionKey = "otpSession";

        SetupTestEnvironment(productFlags, out string crmId, out Person person, out List<CTALink> expectedActions, out MemberProducts expectedResult);

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        await AssertProductHoldingListAndResults(person, expectedResult, result);
        var product = result.AnnuityProducts[0] as RoadsideProductHolding;
        Assert.Multiple(() =>
        {
            ConvertToJsonAndAssert(expectedActions, product);
            Assert.That(product?.Actions?.Exists(action => action.Label == "Pay Now"), Is.EqualTo(expectedPayNowAction));
        });
    }

    [TestCase(true, true, Category = "MemberActionsVisibility")]
    [TestCase(false, false, Category = "MemberActionsVisibility")]
    public async Task GivenProduct_WhenCheckingViewMembershipAction_ShowsCorrectAction(bool isRewards, bool expectedViewMembershipAction)
    {
        // Arrange
        var productFlags = new FinOpsProductFlags
        {
            IsRewards = isRewards,
            IsUpgradeDowngradeEligible = !isRewards,
            IsDirectDebit = true,
            DirectDebitAllowed = !isRewards
        };

        var sessionKey = "otpSession";

        SetupTestEnvironment(productFlags, out string crmId, out Person person, out List<CTALink> expectedActions, out MemberProducts expectedResult);

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        await AssertProductHoldingListAndResults(person, expectedResult, result);
        var product = result.AnnuityProducts[0] as RoadsideProductHolding;
        Assert.Multiple(() =>
        {
            var manageActions = product?.Actions?.Find(action => action.Label == "Manage")?.SubActions;

            ConvertToJsonAndAssert(expectedActions, product);
            Assert.That((manageActions?.Exists(action => action.Label == "View membership")).GetValueOrDefault() || (product?.Actions?.Exists(action => action.Label == "View membership")).GetValueOrDefault(), Is.EqualTo(expectedViewMembershipAction));
        });
    }

    [TestCase(true, true, Category = "MemberActionsVisibility")]
    [TestCase(false, false, Category = "MemberActionsVisibility")]
    public async Task GivenProduct_WhenCheckingChangeCoverAction_ShowsCorrectAction(bool isUpgradeDowngradeEligible, bool expectedChangeCoverAction)
    {
        // Arrange
        var productFlags = new FinOpsProductFlags
        {
            IsRewards = !isUpgradeDowngradeEligible,
            IsUpgradeDowngradeEligible = isUpgradeDowngradeEligible,
            IsDirectDebit = isUpgradeDowngradeEligible,
            DirectDebitAllowed = isUpgradeDowngradeEligible
        };

        var sessionKey = "otpSession";

        SetupTestEnvironment(productFlags, out string crmId, out Person person, out List<CTALink> expectedActions, out MemberProducts expectedResult);

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        await AssertProductHoldingListAndResults(person, expectedResult, result);
        var product = result.AnnuityProducts[0] as RoadsideProductHolding;
        Assert.Multiple(() =>
        {
            var manageActions = product?.Actions?.Find(action => action.Label == "Manage")?.SubActions;
            ConvertToJsonAndAssert(expectedActions, product);
            Assert.That((manageActions?.Exists(action => action.Label == "Change cover level")).GetValueOrDefault() || (product?.Actions?.Exists(action => action.Label == "Change cover level")).GetValueOrDefault(), Is.EqualTo(expectedChangeCoverAction));
        });
    }

    private static void ConvertToJsonAndAssert(List<CTALink> expectedActions, RoadsideProductHolding? product)
    {
        var resultJson = JsonSerializer.Serialize(product?.Actions);
        var expectedJson = JsonSerializer.Serialize(expectedActions);
        Assert.That(resultJson, Is.EqualTo(expectedJson));
    }

    [TestCase(false, false, false, false, Category = "MemberActionsVisibility")]
    [TestCase(true, false, false, false, Category = "MemberActionsVisibility")]
    public async Task GivenProduct_WhenCheckingDirectDebitActionsFoRewards_ShowsCorrectActions(bool isDirectDebit, bool expectedSetUpDirectDebitAction, bool expectedChangeDirectDebitAction, bool expectedChangeDirectDebitFrequencyAction)
    {
        // Arrange
        var productFlags = new FinOpsProductFlags
        {
            IsRewards = true,
            IsDirectDebit = isDirectDebit,
            DirectDebitAllowed = false
        };

        var sessionKey = "otpSession";

        SetupTestEnvironment(productFlags, out string crmId, out Person person, out List<CTALink> expectedActions, out MemberProducts expectedResult);

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        await AssertProductHoldingListAndResults(person, expectedResult, result);
        var product = result.AnnuityProducts[0] as RoadsideProductHolding;
        Assert.Multiple(() =>
        {
            var manageActions = product?.Actions?.Find(action => action.Label == "Manage")?.SubActions;

            ConvertToJsonAndAssert(expectedActions, product);
            Assert.That((manageActions?.Exists(action => action.Label == "Setup direct debit")).GetValueOrDefault() || (product?.Actions?.Exists(action => action.Label == "Set up direct debit")).GetValueOrDefault(), Is.EqualTo(expectedSetUpDirectDebitAction));
            Assert.That((manageActions?.Exists(action => action.Label == "Change direct debit")).GetValueOrDefault() || (product?.Actions?.Exists(action => action.Label == "Change direct debit")).GetValueOrDefault(), Is.EqualTo(expectedChangeDirectDebitAction));
            Assert.That((manageActions?.Exists(action => action.Label == "Change direct debit frequency")).GetValueOrDefault() || (product?.Actions?.Exists(action => action.Label == "Change direct debit frequency")).GetValueOrDefault(), Is.EqualTo(expectedChangeDirectDebitFrequencyAction));
        });
    }

    [TestCase(false, false, true, false, false, Category = "MemberActionsVisibility")] // Annual not in renewal
    [TestCase(false, true, false, true, true, Category = "MemberActionsVisibility")] // Direct debit
    [TestCase(true, false, false, false, false, Category = "MemberActionsVisibility")] // Annual in renewal
    public async Task GivenBundledProduct_WhenCheckingActions_ShowsCorrectActions(bool showPayNow, bool isDirectDebit, bool expectedSetUpDirectDebitAction, bool expectedChangeDirectDebitAction, bool expectedChangeDirectDebitFrequencyAction)
    {
        // Arrange
        var productFlags = new FinOpsProductFlags
        {
            ShowPayNow = showPayNow,
            IsDirectDebit = isDirectDebit,
            DirectDebitAllowed = true,
            IsUpgradeDowngradeEligible = true
        };

        _finOpsService.ClearReceivedCalls();

        var crmId = "123";
        var person = new Person { RacId = "456" };
        var crmProducts = new PersonProducts
        {
            ProductHoldings = []
        };

        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(crmProducts);

        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.GenerateBundledProductHoldingList(productFlags));
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(InsuranceTestData.EmptySummary);
        _financeService.GetProductList(Arg.Any<string>()).Returns(new FinanceProductResponse());

        var expectedActions = GenerateExpectedBundleActions(productFlags);
        var expectedResult = GenerateExpectedBundleResult(productFlags);

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        await AssertProductHoldingListAndResults(person, expectedResult, result);

        foreach (RoadsideProductHolding product in result.AnnuityProducts)
        {
            Assert.That(product, Is.Not.Null);
            Assert.Multiple(() =>
            {
                var manageActions = product?.Actions?.Find(action => action.Label == "Manage")?.SubActions;

                ConvertToJsonAndAssert(expectedActions[result.AnnuityProducts.IndexOf(product)], product);
                Assert.That((manageActions?.Exists(action => action.Label == "Setup direct debit")).GetValueOrDefault() || (product?.Actions?.Exists(action => action.Label == "Set up direct debit")).GetValueOrDefault(), Is.EqualTo(expectedSetUpDirectDebitAction));
                Assert.That((manageActions?.Exists(action => action.Label == "Change direct debit")).GetValueOrDefault() || (product?.Actions?.Exists(action => action.Label == "Change direct debit")).GetValueOrDefault(), Is.EqualTo(expectedChangeDirectDebitAction));
                Assert.That((manageActions?.Exists(action => action.Label == "Change direct debit frequency")).GetValueOrDefault() || (product?.Actions?.Exists(action => action.Label == "Change direct debit frequency")).GetValueOrDefault(), Is.EqualTo(expectedChangeDirectDebitFrequencyAction));
            });
        }
    }

    [TestCase(true, false, false, false, false, "/myrac/product-details/ford", Category = "MemberActionsVisibility")]
    [TestCase(false, true, false, false, false, "/myrac/product-details/free2go", Category = "MemberActionsVisibility")]
    [TestCase(false, false, true, false, false, "/myrac/product-details/mitsubishi", Category = "MemberActionsVisibility")]
    [TestCase(false, false, false, true, false, "/myrac/product-details/subaru", Category = "MemberActionsVisibility")]
    // Test case removed as Wheels2Go has been temporarily toggled off. See ticket DPD-1961
    // [TestCase(false, false, false, false, true, "/car-motoring/roadside-assistance/wheels2go", Category = "MemberActionsVisibility")]
    public async Task GivenProduct_WhenOfAParticularTypeOfCMO_ContainsOnlyViewCoverLink(bool isFordRoadside, bool isFree2GoRoadside, bool isMitsubishiRoadside, bool isSubaruRoadside, bool isWheels2Go, string expectedLink)
    {
        // Arrange
        var productFlags = new FinOpsProductFlags
        {
            IsFordRoadside = isFordRoadside,
            IsFree2GoRoadside = isFree2GoRoadside,
            IsMitsubishiRoadside = isMitsubishiRoadside,
            IsSubaruRoadside = isSubaruRoadside,
            IsWheels2Go = isWheels2Go,
            IsUpgradeDowngradeEligible = isFree2GoRoadside,
            DirectDebitAllowed = isFree2GoRoadside || isWheels2Go
        };

        var sessionKey = "otpSession";

        SetupTestEnvironment(productFlags, out string crmId, out Person person, out List<CTALink> expectedActions, out MemberProducts expectedResult);

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        await AssertProductHoldingListAndResults(person, expectedResult, result);
        var product = result.AnnuityProducts[0] as RoadsideProductHolding;
        Assert.Multiple(() =>
        {
            ConvertToJsonAndAssert(expectedActions, product);
            Assert.That(product?.Actions?.Find(action => action.Label == "View cover")?.Link, Is.EqualTo(expectedLink));
        });
    }

    [Test]
    public async Task GivenProducts_WhenRoadsideShowsPayNow_ShowsRoadsideFirst()
    {
        // Arrange
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        string b2cUrl = InsuranceTestData.B2CUrl;

        var productFlags = new FinOpsProductFlags
        {
            ShowPayNow = true,
            IsUpgradeDowngradeEligible = true,
            DirectDebitAllowed = true
        };

        var sessionKey = "otpSession";

        _configuration[ConfigDescriptors.INSURANCE_B2C_URL].Returns(b2cUrl);
        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.GenerateProductHoldingList(productFlags));
        _insuranceService.GetPortfolioSummary(person.PersonSystemIds![0].SystemId).Returns(InsuranceTestData.SummaryWithValidPolicyList);
        _insuranceService.GetContactByExternalShieldNumber(person.PersonSystemIds![0].SystemId).Returns(InsuranceTestData.ValidContact);
        _insuranceService.GetInsurancePolicies("BGP12345678").Returns(InsuranceTestData.ValidBoatInsuranceProductResponse);
        _insuranceService.GetInsurancePolicies("MGP12345678").Returns(InsuranceTestData.ValidMotorInsuranceProductResponse1);
        _financeService.GetProductList(Arg.Any<string>()).Returns(new FinanceProductResponse());

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        Assert.That(result.AnnuityProducts[0].Title, Is.EqualTo("Classic Roadside Assistance"));
    }

    [Test]
    public async Task GivenProducts_WhenNoneShowPayNow_ShowsInsuranceFirst()
    {
        // Arrange
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        string b2cUrl = InsuranceTestData.B2CUrl;
        var sessionKey = "otpSession";

        _configuration[ConfigDescriptors.INSURANCE_B2C_URL].Returns(b2cUrl);
        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.ValidProductHoldingWithNextActionInFuture);
        _insuranceService.GetPortfolioSummary(person.PersonSystemIds![0].SystemId).Returns(InsuranceTestData.SummaryWithValidPolicyList);
        _insuranceService.GetContactByExternalShieldNumber(person.PersonSystemIds![0].SystemId).Returns(InsuranceTestData.ValidContact);
        _insuranceService.GetInsurancePolicies("BGP12345678").Returns(InsuranceTestData.ValidBoatInsuranceProductResponse);
        _insuranceService.GetInsurancePolicies("MGP12345678").Returns(InsuranceTestData.ValidMotorInsuranceProductResponse1);
        _financeService.GetProductList(Arg.Any<string>()).Returns(new FinanceProductResponse());

        // Act
        var result = await _productService.GetProducts(crmId, sessionKey);

        // Assert
        Assert.That(result.AnnuityProducts[0].Title, Is.Not.EqualTo("Classic Roadside Assistance"));
    }

    [Test]
    public async Task GetProducts_ProcessesFinanceData_CorrectlyMappedPersonalLoanSecured()
    {
        // Arrange
        var rimId = "1";
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        var responseFromMC = new PersonProducts
        {
            ProductHoldings =
                [
                    new() {
                        SourceId = rimId,
                        ProductId = Guid.NewGuid(),
                        ProductBusinessType = "Finance",
                        ProductStatus = "Active",
                        EndDate = DateTime.Now.AddDays(30),
                        StartDate = DateTime.Now.AddDays(-30),
                        ProductStatusReason = "Active",
                        Product = "Finance Product",
                        ProductNumber = "123456"
                    }
                ]
        };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(responseFromMC);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetProductList(rimId).Returns(FinanceTestData.PersonalLoanSecured);

        // Act
        var products = await _productService.GetProducts(crmId, sessionKey);
        var result = products.AnnuityProducts.FirstOrDefault() as FinanceProductHolding;
        var expectedResultJson = FinanceTestData.ValidPersonLoanSecured;
        // Assert

        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
            Assert.That(result?.Title, Is.EqualTo("Personal Loan"));
            Assert.That(result?.Subtitle, Is.EqualTo("Secured"));
        });
    }

    [Test]
    public async Task GetProducts_ProcessesFinanceData_CorrectlyMappedPersonalLoanUnsecured()
    {
        // Arrange
        var rimId = "1";
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        var responseFromMC = new PersonProducts
        {
            ProductHoldings =
                [
                    new() {
                        SourceId = rimId,
                        ProductId = Guid.NewGuid(),
                        ProductBusinessType = "Finance",
                        ProductStatus = "Active",
                        EndDate = DateTime.Now.AddDays(30),
                        StartDate = DateTime.Now.AddDays(-30),
                        ProductStatusReason = "Active",
                        Product = "Finance Product",
                        ProductNumber = "123456"
                    }
                ]
        };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(responseFromMC);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetProductList(rimId).Returns(FinanceTestData.PersonalLoanUnsecured);

        // Act
        var products = await _productService.GetProducts(crmId, sessionKey);
        var result = products.AnnuityProducts.FirstOrDefault() as FinanceProductHolding;
        var expectedResultJson = FinanceTestData.ValidPersonLoanUnSecured;
        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
            Assert.That(result?.Title, Is.EqualTo("Personal Loan"));
            Assert.That(result?.Subtitle, Is.EqualTo("Unsecured"));
        });
    }
    [Test]
    public async Task GetProducts_ProcessesFinanceData_CorrectlyMappedSecuredInvestmentTwoYearAnnual()
    {
        // Arrange
        var rimId = "1";
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        var responseFromMC = new PersonProducts
        {
            ProductHoldings =
                [
                    new() {
                        SourceId = rimId,
                        ProductId = Guid.NewGuid(),
                        ProductBusinessType = "Finance",
                        ProductStatus = "Active",
                        EndDate = DateTime.Now.AddDays(30),
                        StartDate = DateTime.Now.AddDays(-30),
                        ProductStatusReason = "Active",
                        Product = "Finance Product",
                        ProductNumber = "123456"
                    }
                ]
        };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(responseFromMC);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetProductList(rimId).Returns(FinanceTestData.SecuredInvestmentTwoYearAnnual);

        // Act
        var products = await _productService.GetProducts(crmId, sessionKey);
        var result = products.AnnuityProducts.FirstOrDefault() as FinanceProductHolding;
        var expectedResultJson = FinanceTestData.ValidSecuredInvestmentTwoYearAnnual;
        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
            Assert.That(result?.Title, Is.EqualTo("Secured Investment"));
            Assert.That(result?.Subtitle, Is.EqualTo("24 month(s)"));
        });
    }
    [Test]
    public async Task GetProducts_ProcessesFinanceData_CorrectlyMappedSecuredInvestmentSixMonthly()
    {
        // Arrange
        var rimId = "1";
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        var responseFromMC = new PersonProducts
        {
            ProductHoldings =
                [
                    new() {
                        SourceId = rimId,
                        ProductId = Guid.NewGuid(),
                        ProductBusinessType = "Finance",
                        ProductStatus = "Active",
                        EndDate = DateTime.Now.AddDays(30),
                        StartDate = DateTime.Now.AddDays(-30),
                        ProductStatusReason = "Active",
                        Product = "Finance Product",
                        ProductNumber = "123456"
                    }
                ]
        };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(responseFromMC);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetProductList(rimId).Returns(FinanceTestData.SecuredInvestmentSixMonthly);

        // Act
        var products = await _productService.GetProducts(crmId, sessionKey);
        var result = products.AnnuityProducts.FirstOrDefault() as FinanceProductHolding;
        var expectedResultJson = FinanceTestData.ValidSecuredInvestmentSixMonthly;
        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
            Assert.That(result?.Title, Is.EqualTo("Secured Investment"));
            Assert.That(result?.Subtitle, Is.EqualTo("12 month(s)"));
            Assert.That(result?.InterestFrequency, Does.Contain("paid 6 monthly"));
        });
    }
    [Test]
    public async Task GetProducts_ProcessesFinanceData_CorrectlyMappedBusinessLoan()
    {
        // Arrange
        var rimId = "1";
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        var responseFromMC = new PersonProducts
        {
            ProductHoldings =
            [
                new() {
                    SourceId = rimId,
                    ProductId = Guid.NewGuid(),
                    ProductBusinessType = "Finance",
                    ProductStatus = "Active",
                    EndDate = DateTime.Now.AddDays(30),
                    StartDate = DateTime.Now.AddDays(-30),
                    ProductStatusReason = "Active",
                    Product = "Finance Product",
                    ProductNumber = "123456"
                }
            ]
        };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(responseFromMC);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetProductList(rimId).Returns(FinanceTestData.BusinessLoan);

        // Act
        var products = await _productService.GetProducts(crmId, sessionKey);
        var result = products.AnnuityProducts.FirstOrDefault() as FinanceProductHolding;
        var expectedResultJson = FinanceTestData.ValidBusinessLoan;
        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
            Assert.That(result?.Title, Is.EqualTo("Car Loan"));
            Assert.That(result?.Subtitle, Is.EqualTo("Business use"));
        });
    }

    [Test]
    public async Task GetProducts_ProcessesFinanceData_CorrectlyMappedPropertyLoan()
    {
        // Arrange
        var rimId = "1";
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.FullPersonEntity;
        var responseFromMC = new PersonProducts
        {
            ProductHoldings =
                [
                    new() {
                        SourceId = rimId,
                        ProductId = Guid.NewGuid(),
                        ProductBusinessType = "Finance",
                        ProductStatus = "Active",
                        EndDate = DateTime.Now.AddDays(30),
                        StartDate = DateTime.Now.AddDays(-30),
                        ProductStatusReason = "Active",
                        Product = "Finance Product",
                        ProductNumber = "123456"
                    }
                ]
        };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(responseFromMC);
        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetProductList(rimId).Returns(FinanceTestData.PropertyLoan);

        // Act
        var products = await _productService.GetProducts(crmId, sessionKey);
        var result = products.AnnuityProducts.FirstOrDefault() as FinanceProductHolding;
        var expectedResultJson = FinanceTestData.ValidPropertyLoan;
        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
            Assert.That(result?.Title, Is.EqualTo("Property Finance Loan"));
            Assert.That(result?.Subtitle, Is.EqualTo("Cinnamon Meander, Two Rocks"));
        });
    }

    [Test]
    public async Task GetProducts_ProcessesFinanceData_CorrectlyMappedFinanceQuote()
    {
        // Arrange
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.ValidPersonForQuotes;

        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetFinanceQuotes(crmId).Returns(FinanceTestData.FinanceLoanQuote);
        var sessionKey = "otpSession";

        // Act
        var products = await _productService.GetProducts(crmId, sessionKey);
        var result = products.AnnuityProducts[1] as FinanceProductHolding;
        var expectedResultJson = FinanceTestData.ValidFinanceLoanQuote;
        // Assert

        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
            Assert.That(result?.Title, Is.EqualTo("Loan Quote"));
            Assert.That(result?.Subtitle, Is.EqualTo("Secured"));
        });
    }

    [Test]
    public async Task GetProducts_ProcessesFinanceData_CorrectlyMappedUnsecuredFinanceQuote()
    {
        // Arrange
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.ValidPersonForQuotes;

        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetFinanceQuotes(crmId).Returns(FinanceTestData.FinanceLoanQuoteUnsecured);
        var sessionKey = "otpSession";

        // Act
        var products = await _productService.GetProducts(crmId, sessionKey);
        var result = products.AnnuityProducts[1] as FinanceProductHolding;
        var expectedResultJson = FinanceTestData.ValidFinanceLoanQuoteUnsecured;
        // Assert

        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
            Assert.That(result?.Title, Is.EqualTo("Loan Quote"));
            Assert.That(result?.Subtitle, Is.EqualTo("Unsecured"));
        });
    }

    [Test]
    public async Task GetProducts_ProcessesFinanceData_CorrectlyMappedVehicleFinanceQuote()
    {
        // Arrange
        var crmId = PersonTestData.PersonId.ToString();
        var person = PersonTestData.ValidPersonForQuotes;

        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.EmptyProductHoldingList);
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(new InsurancePortfolioSummary());
        _financeService.GetFinanceQuotes(crmId).Returns(FinanceTestData.FinanceLoanQuoteVehicle);
        var sessionKey = "otpSession";

        // Act
        var products = await _productService.GetProducts(crmId, sessionKey);
        var result = products.AnnuityProducts[1] as FinanceProductHolding;
        var expectedResultJson = FinanceTestData.ValidFinanceLoanQuoteVehicle;
        // Assert

        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
            Assert.That(result?.Title, Is.EqualTo("Loan Quote"));
            Assert.That(result?.Subtitle, Is.EqualTo("Secured"));
            Assert.That(result?.QuoteType, Is.EqualTo("Vehicle"));
        });
    }


    private void SetupTestEnvironment(FinOpsProductFlags productFlags, out string crmId, out Person person, out List<CTALink> expectedActions, out MemberProducts expectedResult)
    {
        _finOpsService.ClearReceivedCalls();

        crmId = "123";
        person = new Person { RacId = "456" };
        var crmProducts = new PersonProducts
        {
            ProductHoldings = []
        };
        var sessionKey = "otpSession";

        _personService.GetPerson(crmId, sessionKey).Returns(person);
        _personService.GetProducts(crmId).Returns(crmProducts);

        _finOpsService.GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(FinOpsTestData.GenerateProductHoldingList(productFlags));
        _insuranceService.GetPortfolioSummary(Arg.Any<string>()).Returns(InsuranceTestData.EmptySummary);
        _financeService.GetProductList(Arg.Any<string>()).Returns(new FinanceProductResponse());

        expectedActions = GenerateExpectedActions(productFlags);
        expectedResult = GenerateExpectedResult(productFlags);
    }

    private async Task AssertProductHoldingListAndResults(Person person, MemberProducts expectedResult, MemberProducts result)
    {
        await _finOpsService.Received(1).GetProductHoldingList(person.RacId, Arg.Any<string>(), Arg.Any<string>());
        Assert.Multiple(() =>
        {
            var resultJson = JsonSerializer.Serialize(result);
            var expectedResultJson = JsonSerializer.Serialize(expectedResult);

            Assert.That(result.AnnuityProducts?.Count, Is.EqualTo(expectedResult.AnnuityProducts?.Count));
            Assert.That(resultJson, Is.EqualTo(expectedResultJson));
        });
    }

    private static MemberProducts GenerateExpectedResult(FinOpsProductFlags productFlags)
    {
        var cleanProductName = productFlags.IsRewards ? "Rewards" : "Roadside Assistance";
        var productIds = new Dictionary<Func<bool>, string>
        {
            { () => productFlags.IsFordRoadside, "FSTDCMO" },
            { () => productFlags.IsFree2GoRoadside, "F2GCLAS" },
            { () => productFlags.IsMitsubishiRoadside, "MSTDCMO" },
            { () => productFlags.IsSubaruRoadside, "SSTDCMO" },
            { () => productFlags.IsWheels2Go, "W2G" },
            { () => productFlags.IsRewards, "REWARDS" },
        };

        // If none of the above flags are true, default to the generic view cover or membership link
        string productId;
        if (productIds.FirstOrDefault(x => x.Key()).Value != null)
        {
            // set product id to the relevant product id from above if set
            productId = productIds.FirstOrDefault(x => x.Key()).Value;
        }
        else if (productFlags.ShowPayNow)
        {
            productId = "STD";
        }
        else if (productFlags.DirectDebitAllowed)
        {
            productId = "HLSTD";
        }
        else
        {
            productId = "GLSTD";
        }

        var productFlagUrls = new Dictionary<Func<bool>, string>
        {
            { () => productFlags.IsFordRoadside,        "/myrac/product-details/ford" },
            { () => productFlags.IsFree2GoRoadside,     "/myrac/product-details/free2go" },
            { () => productFlags.IsMitsubishiRoadside,  "/myrac/product-details/mitsubishi" },
            { () => productFlags.IsSubaruRoadside,      "/myrac/product-details/subaru" },
            { () => productFlags.IsWheels2Go,           "/car-motoring/roadside-assistance/wheels2go" },
            { () => productFlags.IsRewards,             "/membership-benefits/become-a-member/rewards-membership" },
        };

        // If none of the above flags are true, default to the generic view cover or membership link
        var viewMembershipOrCoverLink = productFlagUrls.FirstOrDefault(x => x.Key()).Value ?? $"/myrac/product-details?highlightedProduct={cleanProductName}";

        return new MemberProducts
        {
            AnnuityProducts = new List<AnnuityProduct>{
                    new RoadsideProductHolding(productFlags) {
                        ProductId = productId,
                        Id = productFlags.ShowPayNow ? "1234568347885" : "RSA000122143412",
                        BusinessType = BusinessType.RSA.ToString(),
                        Title = productFlags.IsFree2GoRoadside ? "Free2Go" : "Classic Roadside Assistance",
                        Subtitle = "Roadside Assistance",
                        Asset = new Vehicle{ Year = "1992", Make = "Ford", Model = "F150"},
                        RegistrationNumber = "ABC123",
                        ExpiryDate = productFlags.ShowPayNow ? DateTime.Today.AddDays(1).ToString("dd/MM/yyyy") : DateTime.Today.AddDays(100).ToString("dd/MM/yyyy"),
                        Type = productFlags.IsRewards ? "REWARDS": "RSA",
                        Version = "1",
                        HeaderId = "PH12345678",
                        RenewalPaymentMode = productFlags.IsDirectDebit ? "DDBA" :"CC",
                        ViewMembershipOrCoverLink = viewMembershipOrCoverLink,
                        NextPaymentActionDate = productFlags.ShowPayNow ? DateTime.Today.AddDays(1): DateTime.MaxValue,
                        ShowPayNow = productFlags.ShowPayNow
                    },
                }
        };
    }

    private static MemberProducts GenerateExpectedBundleResult(FinOpsProductFlags productFlags)
    {
        var cleanProductName = productFlags.IsRewards ? "Rewards" : "Roadside Assistance";
        var productId1 = "STD";
        var productName1 = "Standard Roadside Assistance";
        var productId2 = "CLAS";
        var productName2 = "Classic Roadside Assistance";

        var productFlagUrls = new Dictionary<Func<bool>, string>
        {
            { () => productFlags.IsFordRoadside,        "/myrac/product-details/ford" },
            { () => productFlags.IsFree2GoRoadside,     "/myrac/product-details/free2go" },
            { () => productFlags.IsMitsubishiRoadside,  "/myrac/product-details/mitsubishi" },
            { () => productFlags.IsSubaruRoadside,      "/myrac/product-details/subaru" },
            { () => productFlags.IsWheels2Go,           "/car-motoring/roadside-assistance/wheels2go" },
            { () => productFlags.IsRewards,             "/membership-benefits/become-a-member/rewards-membership" },
        };

        // If none of the above flags are true, default to the generic view cover or membership link
        var viewMembershipOrCoverLink = productFlagUrls.FirstOrDefault(x => x.Key()).Value ?? $"/myrac/product-details?highlightedProduct={cleanProductName}";

        return new MemberProducts
        {
            AnnuityProducts = new List<AnnuityProduct>{
                    new RoadsideProductHolding(productFlags) {
                        ProductId = productId1,
                        Id = "RSA000122143412",
                        BusinessType = BusinessType.RSA.ToString(),
                        Title = productName1,
                        Subtitle = "Roadside Assistance",
                        Asset = new Vehicle{ Year = "1992", Make = "Ford", Model = "F150"},
                        RegistrationNumber = "ABC123",
                        ExpiryDate = productFlags.ShowPayNow ? DateTime.Today.AddDays(1).ToString("dd/MM/yyyy") : DateTime.Today.AddDays(100).ToString("dd/MM/yyyy"),
                        Type = productFlags.IsRewards ? "REWARDS": "RSA",
                        Version = "1",
                        HeaderId = "PH12345678",
                        RenewalPaymentMode = productFlags.IsDirectDebit ? "DDBA" :"CC",
                        ViewMembershipOrCoverLink = viewMembershipOrCoverLink,
                        NextPaymentActionDate = productFlags.ShowPayNow ? DateTime.Today.AddDays(1): DateTime.MaxValue,
                        ShowPayNow = productFlags.ShowPayNow
                    },
                    new RoadsideProductHolding(productFlags) {
                        ProductId = productId2,
                        Id = "RSA000122143413",
                        BusinessType = BusinessType.RSA.ToString(),
                        Title = productName2,
                        Subtitle = "Roadside Assistance",
                        Asset = new Vehicle{ Year = "2010", Make = "Toyota", Model = "Camry"},
                        RegistrationNumber = "123ABC",
                        ExpiryDate = productFlags.ShowPayNow ? DateTime.Today.AddDays(1).ToString("dd/MM/yyyy") : DateTime.Today.AddDays(100).ToString("dd/MM/yyyy"),
                        Type = productFlags.IsRewards ? "REWARDS": "RSA",
                        Version = "1",
                        HeaderId = "PH12345678",
                        RenewalPaymentMode = productFlags.IsDirectDebit ? "DDBA" :"CC",
                        ViewMembershipOrCoverLink = viewMembershipOrCoverLink,
                        NextPaymentActionDate = DateTime.MaxValue,
                        ShowPayNow = productFlags.ShowPayNow
                    },
                }
        };
    }

    private List<CTALink> GenerateExpectedActions(FinOpsProductFlags productFlags)
    {
        return GenerateExpectedActions(productFlags, "Classic", "ABC123", "RSA000122143412");
    }

    private List<CTALink> GenerateExpectedActions(FinOpsProductFlags productFlags, string productLevel, string regoNo, string holdingId)
    {
        List<CTALink> ctaLinks = new List<CTALink>();
        List<CTALink> subActions = new List<CTALink>();
        var productFlagUrls = new Dictionary<Func<bool>, string>
        {
            { () => productFlags.IsFordRoadside, "/myrac/product-details/ford" },
            { () => productFlags.IsFree2GoRoadside, "/myrac/product-details/free2go" },
            { () => productFlags.IsMitsubishiRoadside, "/myrac/product-details/mitsubishi" },
            { () => productFlags.IsSubaruRoadside, "/myrac/product-details/subaru" },
            { () => productFlags.IsWheels2Go, "/car-motoring/roadside-assistance/wheels2go" },
            { () => productFlags.IsRewards, "/membership-benefits/become-a-member/rewards-membership" },
        };
        // If none of the above flags are true, default to the generic view cover or membership link
        var viewMembershipOrCoverLink = productFlagUrls.FirstOrDefault(x => x.Key()).Value ?? $"/myrac/product-details?highlightedProduct={productLevel}";

        if (productFlags.ShowPayNow && productFlags.IsNotBundledOrFirstInBundle)
        {
            ctaLinks.Add(
                new CTALink
                {
                    Label = "Pay Now",
                    Link = $"/membership-benefits/pay-a-bill?PaymentNumber=123456789",
                    IsDefaultAction = true,
                    Colour = "primary"
                });
        }
        if (!productFlags.ShouldNeverShowViewCover)
        {
            ((productFlags.ShowPayNow && productFlags.IsRewards) ? subActions : ctaLinks).Add(
                new CTALink
                {
                    Label = productFlags.IsRewards ? "View membership" : "View cover",
                    Link = viewMembershipOrCoverLink,
                    IsDefaultAction = true,
                    Colour = (productFlags.ShowPayNow && productFlags.IsNotBundledOrFirstInBundle) ? "" : "secondary"
                });
        }
        if (productFlags.IsRewards)
        {
            // Add your savings option
            (productFlags.ShowPayNow ? subActions : ctaLinks).Add(new CTALink
            {
                Label = "Your savings",
                Link = "/myrac/savings"
            });
        }
        if (productFlags.IsUpgradeDowngradeEligible && !productFlags.ShowPayNow)
        {
            subActions.Add(
            new CTALink
            {
                Label = "Change cover level",
                Link = $"/myrac/change-rsa-cover-level?referenceNo=PH12345678&regoNo={regoNo}&productHoldingId={holdingId}&productHoldingVersion=1"
            });
        }

        if (productFlags.IsDirectDebit && productFlags.DirectDebitAllowed)
        {
            subActions.Add(new CTALink
            {
                Label = "Change direct debit",
                Link = $"/myrac/change-direct-debit?phhid=PH12345678"
            });
            subActions.Add(new CTALink
            {
                Label = "Change direct debit frequency",
                Link = $"/myrac/change-frequency?phhid=PH12345678"
            });
        }
        if (!productFlags.IsDirectDebit && productFlags.DirectDebitAllowed && !productFlags.ShowPayNow)
        {
            subActions.Add(new CTALink
            {
                Label = "Setup direct debit",
                Link = $"/myrac/set-up-direct-debit?phhid=PH12345678"
            });
        }

        if (subActions.Count > 0)
        {
            ctaLinks.Add(new CTALink
            {
                Label = "Manage",
                SubActions = subActions
            });
        }

        return ctaLinks;
    }

    private List<List<CTALink>> GenerateExpectedBundleActions(FinOpsProductFlags productFlags)
    {
        List<List<CTALink>> bundleActions = new List<List<CTALink>>();
        productFlags.IsNotBundledOrFirstInBundle = true;
        bundleActions.Add(GenerateExpectedActions(productFlags, "Standard", "ABC123", "RSA000122143412"));
        productFlags.IsNotBundledOrFirstInBundle = false;
        bundleActions.Add(GenerateExpectedActions(productFlags, "Classic", "123ABC", "RSA000122143413"));
        return bundleActions;
    }

}
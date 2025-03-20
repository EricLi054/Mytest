using Membership.Interfaces;
using Membership.Services;
using Membership.Types.Finance;
using Membership.Types.FinOps;
using Membership.Types.Person;
using Membership.GraphQL.Types;
using Membership.Types.Products;
using Moq;
using Shared.Tests.Helpers;
using Membership.Tests.Data;
using Membership.Types.Insurance;
using Membership.Types.Products.AnnuityProducts;
using System.Text.Json;
using Shared.Interfaces;

namespace Membership.Tests.Services;

[TestFixture]
public class ProductServiceTests : BaseServiceTests<ProductService>
{
    private Mock<IPersonService> _personService = null!;
    private Mock<IFinanceService> _financeService = null!;
    private Mock<IFinOpsService> _finOpsService = null!;
    private Mock<IInsuranceService> _insuranceService = null!;
    private Mock<IFeatureService> _featureService = null!;
    private ProductService _productService = null!;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        _personService = new Mock<IPersonService>();
        _financeService = new Mock<IFinanceService>();
        _finOpsService = new Mock<IFinOpsService>();
        _insuranceService = new Mock<IInsuranceService>();
        _featureService = new Mock<IFeatureService>();
        _productService = new ProductService(_personService.Object, _financeService.Object, _finOpsService.Object, _insuranceService.Object, ConfigurationMock.Object, _featureService.Object, LoggerMock.Object);
    }

    [Test]
    public async Task GetProductsAsync_PersonIsNotNull_ProcessesFinOpsData()
    {
        // Arrange
        var crmId = "123";
        var person = new Person { PersonId = new Guid().ToString(), RacId = "456" };
        var personProductHoldings = new List<PersonProductHolding>();
        var sessionKey = "otpSession";

        List<ProductHolding> productHoldings = new()
        {
            new ProductHolding
            {
                CustAccount = "123",
                CompanyId = "456",
                ProductHoldingHeaderId = "PH12345678",
                Status = ProductHoldingStatus.Active,
                ProductHoldingLines =
                [
                    new()
                    {
                        CompanyId = "E098",
                        ProductId = "CLAS",
                        ProductName = "Classic Roadside Assistance",
                        ProductHoldingId = "1234568347885",
                        ProductHoldingVersion = 1,
                        VehicleDetail = new VehicleDetail
                        {
                            Year = "1992",
                            Make = "Ford",
                            Model = "F150",
                            RegistrationNumber = "ABC123",
                        },
                        EndDate = DateTime.Today.AddDays(1)
                    }
                ]
            }
        };

        _personService.Setup(p => p.GetPersonAsync(crmId)).Returns(Task.FromResult(person));
        _personService.Setup(p => p.GetPersonProductsAsync(crmId)).Returns(Task.FromResult<List<PersonProductHolding>?>(personProductHoldings));
        _finOpsService.Setup(f => f.GetProductHoldingListAsync("456")).Returns(Task.FromResult(productHoldings));

        // Act
        var result = await _productService.GetProductsAsync(crmId, sessionKey);

        // Assert
        Assert.That(result.AnnuityProducts.Count, Is.EqualTo(1));
        Assert.That(result.AnnuityProducts.First().BusinessType, Is.EqualTo(BusinessType.RSA.ToString()));
        Assert.That(result.AnnuityProducts.First().Id, Is.EqualTo("1234568347885"));
    }

    [Test]
    public async Task GetProducts_PersonIsNotNull_ProcessesFinanceData()
    {
        // Arrange
        var crmId = "123";
        var person = new Person { PersonId = new Guid().ToString(), RacId = "456" };

        List<PersonProductHolding> personProductHoldings =
        [
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
        ];

        FinanceProductResponse financeProductResponse = new()
        {
            Success = "true",
            PartyProductList =
            [
                new()
                {
                    ProductType = "Personal Loan",
                    FinanceProduct = new()
                    {
                        FinanceLoan = new()
                        {
                            AccountType = "IL",
                            AccountTitle1 = "A P Kitson",
                            AccountTitle2 = "",
                            AccountNumber = 412345678,
                            CurrentLimit = 12657.0,
                            CurrentBalance = 7603.93,
                            FinanceOverdueAmount = 0.0,
                            FinanceProductType = "Personal Loan",
                            FinanceProductSubType = "Personal Loan - Secured",
                            NextInstalmentDate = DateTime.Today.AddDays(30),
                            InterestRate = 7.75,
                            InterestFrequency = string.Empty,
                            LoanTerm = string.Empty,
                            ExpiryDate = DateTime.Today.AddDays(365),
                            LoanAmount = 12657.0,
                            NextInstalmentAmount = 182.1,
                            ProjectAddress = "",
                            ProjectAddress2 = "301 - Personal Loan - Secured",
                            NextPayment = DateTime.Today.AddDays(30),
                            Amount = 182.1,
                            MaturityDate = DateTime.Today.AddDays(365),
                        }
                    }
                }
            ]
        };

        var sessionKey = "otpSession";

        _personService.Setup(p => p.GetPersonAsync(crmId)).Returns(Task.FromResult(person));
        _personService.Setup(p => p.GetPersonProductsAsync(crmId)).Returns(Task.FromResult<List<PersonProductHolding>?>(personProductHoldings));
        _financeService.Setup(f => f.GetProductListAsync("123")).Returns(Task.FromResult<FinanceProductResponse?>(financeProductResponse));

        // Act
        var result = await _productService.GetProductsAsync(crmId, sessionKey);

        // Assert
        Assert.That(result.AnnuityProducts.Count, Is.EqualTo(1));
        Assert.That(result.AnnuityProducts.First().BusinessType, Is.EqualTo(BusinessType.Finance.ToString()));
        Assert.That(result.AnnuityProducts.First().Id, Is.EqualTo("412345678"));
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
        var crmId = "123";
        string b2cUrl = InsuranceTestData.B2CUrl;
        var sessionKey = "otpSession";
        var systemId = "some-system-id";
        var personSystemIds = new List<PersonSystemId>
        {
            new() { System = "Shield", SystemId = systemId }
        };
        var person = new Person
        {
            PersonId = Guid.NewGuid().ToString(),
            RacId = "456",
            PersonSystemIds = personSystemIds
        };

        MockConfigurationValue(Constants.ConfigurationKeys.InsuranceB2CUrl, b2cUrl);
        _personService.Setup(p => p.GetPersonAsync(crmId)).Returns(Task.FromResult(person));
        _finOpsService.Setup(p => p.GetProductHoldingListAsync("456")).Returns(Task.FromResult(new List<ProductHolding>()));
        _insuranceService.Setup(p => p.GetPortfolioSummaryAsync(systemId)).Returns(Task.FromResult(InsuranceTestData.SummaryWithSinglePolicy(policy)));
        _insuranceService.Setup(p => p.GetContactByExternalShieldNumberAsync("123")).Returns(Task.FromResult(InsuranceTestData.ValidContact));
        _insuranceService.Setup(p => p.GetInsurancePoliciesAsync(productNumber)).Returns(Task.FromResult(product));
        _financeService.Setup(f => f.GetProductListAsync("123")).Returns(Task.FromResult<FinanceProductResponse?>(new FinanceProductResponse()));

        var expectedResult = new List<AnnuityProduct>() { productHolding };

        // Act
        var result = await _productService.GetProductsAsync(crmId, sessionKey);

        // Assert
        Assert.That(result.AnnuityProducts.Count, Is.EqualTo(1));
        Assert.That(result.AnnuityProducts.First().BusinessType, Is.EqualTo(BusinessType.Insurance.ToString()));

        var expectedResultJson = JsonSerializer.Serialize(expectedResult);
        var resultJson = JsonSerializer.Serialize(result.AnnuityProducts);
        Assert.That(resultJson, Is.EqualTo(expectedResultJson));
    }

    [Test]
    public async Task GivenNoExceptions_GetProducts_Returns_AllProducts_Result()
    {
        // Arrange
        var crmId = "123";
        SetupPartialErrorTestData();

        // Act
        var result = await _productService.GetProductsAsync(crmId, "otpSession");

        // Assert
        Assert.That(result.AnnuityProducts[0].BusinessType, Is.EqualTo("Insurance"));
        Assert.That(result.AnnuityProducts[1].BusinessType, Is.EqualTo("RSA"));
        Assert.That(result.AnnuityProducts[2].BusinessType, Is.EqualTo("Finance"));
        Assert.That(result.AnnuityProducts?.Count, Is.EqualTo(3));
    }

    [Test]
    public async Task GivenFinOpsException_GetProducts_Returns_Partial_Result()
    {
        // Arrange
        var crmId = "123";
        var sessionKey = "session-key";

        var expectedError = new SystemError
        {
            SystemKey = SystemKey.FinOps,
            Message = "Simulated FinOps Exception"
        };
        SetupPartialErrorTestData();
        _finOpsService.Setup(p => p.GetProductHoldingListAsync("456")).Throws(new Exception(expectedError.Message));

        // Act
        var result = await _productService.GetProductsAsync(crmId, sessionKey);

        // Assert
        Assert.That(result.SystemErrors.Count, Is.EqualTo(1));
        Assert.That(result.SystemErrors[0].SystemKey, Is.EqualTo(expectedError.SystemKey));
        Assert.That(result.SystemErrors[0].Message, Is.EqualTo(expectedError.Message));
        Assert.That(result.AnnuityProducts[0].BusinessType, Is.EqualTo("Insurance"));
        Assert.That(result.AnnuityProducts[1].BusinessType, Is.EqualTo("Finance"));
        Assert.That(result.AnnuityProducts?.Count, Is.EqualTo(2));
    }

    [Test]
    public async Task GivenShield_GetPortfolioSummaryException_GetProducts_Returns_Partial_Result()
    {
        // Arrange
        var crmId = "123";
        var sessionKey = "session-key";

        var expectedError = new SystemError
        {
            SystemKey = SystemKey.Shield,
            Message = "Simulated Shield Exception"
        };
        SetupPartialErrorTestData();
        _insuranceService.Setup(p => p.GetPortfolioSummaryAsync(It.IsAny<string>())).Throws(new Exception(expectedError.Message));

        // Act
        var result = await _productService.GetProductsAsync(crmId, sessionKey);

        // Assert
        Assert.That(result.SystemErrors.Count, Is.EqualTo(1));
        Assert.That(result.SystemErrors[0].SystemKey, Is.EqualTo(expectedError.SystemKey));
        Assert.That(result.SystemErrors[0].Message, Is.EqualTo(expectedError.Message));
        Assert.That(result.AnnuityProducts[0].BusinessType, Is.EqualTo("RSA"));
        Assert.That(result.AnnuityProducts[1].BusinessType, Is.EqualTo("Finance"));
        Assert.That(result.AnnuityProducts?.Count, Is.EqualTo(2));
    }

    [Test]
    public async Task GivenShield_GetContactException_GetProducts_Returns_Partial_Result()
    {
        // Arrange
        var crmId = "123";
        var sessionKey = "session-key";

        var expectedError = new SystemError
        {
            SystemKey = SystemKey.Shield,
            Message = "Simulated Shield Exception"
        };
        SetupPartialErrorTestData();
        _insuranceService.Setup(p => p.GetContactByExternalShieldNumberAsync(It.IsAny<string>())).Throws(new Exception(expectedError.Message));

        // Act
        var result = await _productService.GetProductsAsync(crmId, sessionKey);

        // Assert
        Assert.That(result.SystemErrors.Count, Is.EqualTo(1));
        Assert.That(result.SystemErrors[0].SystemKey, Is.EqualTo(expectedError.SystemKey));
        Assert.That(result.SystemErrors[0].Message, Is.EqualTo(expectedError.Message));
        Assert.That(result.AnnuityProducts[0].BusinessType, Is.EqualTo("RSA"));
        Assert.That(result.AnnuityProducts[1].BusinessType, Is.EqualTo("Finance"));
        Assert.That(result.AnnuityProducts?.Count, Is.EqualTo(2));
    }

    [Test]
    public async Task GivenShield_GetInsurancePolicies_Exception_GetProducts_Returns_Partial_Result()
    {
        // Arrange
        var crmId = "123";
        var sessionKey = "session-key";

        var expectedError = new SystemError
        {
            SystemKey = SystemKey.Shield,
            Message = "Simulated Shield Exception"
        };
        SetupPartialErrorTestData();
        _insuranceService.Setup(p => p.GetInsurancePoliciesAsync(It.IsAny<string>())).Throws(new Exception(expectedError.Message));

        // Act
        var result = await _productService.GetProductsAsync(crmId, sessionKey);

        // Assert
        Assert.That(result.SystemErrors.Count, Is.EqualTo(1));
        Assert.That(result.SystemErrors[0].SystemKey, Is.EqualTo(expectedError.SystemKey));
        Assert.That(result.SystemErrors[0].Message, Is.EqualTo(expectedError.Message));
        Assert.That(result.AnnuityProducts[0].BusinessType, Is.EqualTo("RSA"));
        Assert.That(result.AnnuityProducts[1].BusinessType, Is.EqualTo("Finance"));
        Assert.That(result.AnnuityProducts?.Count, Is.EqualTo(2));
    }

    [Test]
    public async Task GivenFinanceProductsException_GetProducts_Returns_Partial_Result()
    {
        // Arrange
        var crmId = "123";
        var sessionKey = "session-key";

        var expectedError = new SystemError
        {
            SystemKey = SystemKey.Finance,
            Message = "Simulated Finance Product Exception"
        };
        SetupPartialErrorTestData();
        _financeService.Setup(p => p.GetProductListAsync(It.IsAny<string>())).Throws(new Exception(expectedError.Message));

        // Act
        var result = await _productService.GetProductsAsync(crmId, sessionKey);

        // Assert
        Assert.That(result.SystemErrors.Count, Is.EqualTo(1));
        Assert.That(result.SystemErrors[0].SystemKey, Is.EqualTo(expectedError.SystemKey));
        Assert.That(result.SystemErrors[0].Message, Is.EqualTo(expectedError.Message));
        Assert.That(result.AnnuityProducts[0].BusinessType, Is.EqualTo("Insurance"));
        Assert.That(result.AnnuityProducts[1].BusinessType, Is.EqualTo("RSA"));
        Assert.That(result.AnnuityProducts?.Count, Is.EqualTo(2));
    }

    private void SetupPartialErrorTestData()
    {
        // Arrange
        var systemId = "some-system-id";
        var personSystemIds = new List<PersonSystemId>
        {
            new() { System = "Shield", SystemId = systemId }
        };
        var person = new Person
        {
            PersonId = Guid.NewGuid().ToString(),
            RacId = "456",
            PersonSystemIds = personSystemIds
        };

        var personProductHoldings = new List<PersonProductHolding>()
        {
            new PersonProductHolding {
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
        };

        List<ProductHolding> finOpsProductHoldings = new()
        {
            new ProductHolding
            {
                CustAccount = "123",
                CompanyId = "456",
                ProductHoldingHeaderId = "PH12345678",
                Status = ProductHoldingStatus.Active,
                ProductHoldingLines =
                [
                    new()
                    {
                        CompanyId = "E098",
                        ProductId = "CLAS",
                        ProductName = "Classic Roadside Assistance",
                        ProductHoldingId = "1234568347885",
                        ProductHoldingVersion = 1,
                        VehicleDetail = new VehicleDetail
                        {
                            Year = "1992",
                            Make = "Ford",
                            Model = "F150",
                            RegistrationNumber = "ABC123",
                        },
                        EndDate = DateTime.Today.AddDays(1)
                    }
                ]
            }
        };

        FinanceProductResponse financeProductResponse = new()
        {
            Success = "true",
            PartyProductList =
           [
               new()
                {
                    ProductType = "Personal Loan",
                    FinanceProduct = new()
                    {
                        FinanceLoan = new()
                        {
                            AccountType = "IL",
                            AccountTitle1 = "A P Kitson",
                            AccountTitle2 = "",
                            AccountNumber = 412345678,
                            CurrentLimit = 12657.0,
                            CurrentBalance = 7603.93,
                            FinanceOverdueAmount = 0.0,
                            FinanceProductType = "Personal Loan",
                            FinanceProductSubType = "Personal Loan - Secured",
                            NextInstalmentDate = DateTime.Today.AddDays(30),
                            InterestRate = 7.75,
                            InterestFrequency = string.Empty,
                            LoanTerm = string.Empty,
                            ExpiryDate = DateTime.Today.AddDays(365),
                            LoanAmount = 12657.0,
                            NextInstalmentAmount = 182.1,
                            ProjectAddress = "",
                            ProjectAddress2 = "301 - Personal Loan - Secured",
                            NextPayment = DateTime.Today.AddDays(30),
                            Amount = 182.1,
                            MaturityDate = DateTime.Today.AddDays(365),
                        }
                    }
                }
           ]
        };

        MockConfigurationValue(Constants.ConfigurationKeys.InsuranceB2CUrl, InsuranceTestData.B2CUrl);
        _personService.Setup(p => p.GetPersonAsync("123")).Returns(Task.FromResult(person));
        _personService.Setup(p => p.GetPersonProductsAsync("123")).Returns(Task.FromResult<List<PersonProductHolding>?>(personProductHoldings));
        _finOpsService.Setup(p => p.GetProductHoldingListAsync("456")).Returns(Task.FromResult(finOpsProductHoldings));
        _financeService.Setup(f => f.GetProductListAsync("123")).Returns(Task.FromResult<FinanceProductResponse?>(financeProductResponse));

        _insuranceService.Setup(p => p.GetPortfolioSummaryAsync(systemId)).Returns(Task.FromResult(InsuranceTestData.SummaryWithSinglePolicy(InsuranceTestData.ValidMotorPolicy1)));
        _insuranceService.Setup(p => p.GetContactByExternalShieldNumberAsync("123")).Returns(Task.FromResult(InsuranceTestData.ValidContact));
        _insuranceService.Setup(p => p.GetInsurancePoliciesAsync("MGP12345678")).Returns(Task.FromResult(InsuranceTestData.ValidMotorInsuranceProductResponse1));
    }

}
using System.Net;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Services;
using DigitalPlatform.API.Models.SourceSystem.Finance;
using DigitalPlatform.API.Models.SourceSystem.FinOps;
using DigitalPlatform.API.Models.SourceSystem.Insurance;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;
using DigitalPlatform.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using NSubstitute.ExceptionExtensions;

namespace DigitalPlatform.API.Tests.Services;

[TestFixture]
public class StatusServiceTests
{
    private IContentService _contentService;
    private IPersonService _personService;
    private IMemberCardsService _memberCardsService;
    private IFinanceService _financeService;
    private IFinOpsService _finOpsService;
    private IOtpService _otpService;
    private IInsuranceService _insuranceService;
    private IConfiguration _configuration;
    private IHttpContextAccessor _httpContextAccessor;
    private IDaprService _daprService;
    private IStatusService _statusService;

    public StatusServiceTests()
    {
        _contentService = Substitute.For<IContentService>();
        _personService = Substitute.For<IPersonService>();
        _memberCardsService = Substitute.For<IMemberCardsService>();
        _financeService = Substitute.For<IFinanceService>();
        _finOpsService = Substitute.For<IFinOpsService>();
        _otpService = Substitute.For<IOtpService>();
        _insuranceService = Substitute.For<IInsuranceService>();
        _configuration = Substitute.For<IConfiguration>();
        _httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        _daprService = Substitute.For<IDaprService>();
        _statusService = new StatusService(
            _contentService,
            _personService,
            _memberCardsService,
            _financeService,
            _finOpsService,
            _otpService,
            _insuranceService,
            _configuration,
            _httpContextAccessor,
            _daprService
            );
    }

    [SetUp]
    public void Init()
    {
        // Resets the mocks to prevent issues
        _contentService = Substitute.For<IContentService>();
        _personService = Substitute.For<IPersonService>();
        _memberCardsService = Substitute.For<IMemberCardsService>();
        _financeService = Substitute.For<IFinanceService>();
        _finOpsService = Substitute.For<IFinOpsService>();
        _otpService = Substitute.For<IOtpService>();
        _insuranceService = Substitute.For<IInsuranceService>();
        _configuration = Substitute.For<IConfiguration>();
        _httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        _daprService = Substitute.For<IDaprService>();
        _statusService = new StatusService(
            _contentService,
            _personService,
            _memberCardsService,
            _financeService,
            _finOpsService,
            _otpService,
            _insuranceService,
            _configuration,
            _httpContextAccessor,
            _daprService
            );
    }

    [Test]
    public void GetSystemStatus_NoCrmId_ThrowsException()
    {
        // Arrange
        var crmId = string.Empty;

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await _statusService.GetSystemStatus(crmId));
    }

    [Test]
    public async Task GetSystemStatus_NoPersonAPIData_KeepsWorking()
    {
        // Arrange
        var crmId = "12345678";

        // Setup Person Call
        _daprService
            .InvokeDaprGetMethodAsync<PersonV2Response>(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult<PersonV2Response>(null!));

        // Setup Person Products Call
        _personService
            .GetProducts(crmId)
            .Returns(Task.FromResult(new PersonProducts { ProductHoldings = null! }));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var personPersonAPI = systemStatus.FirstOrDefault(status => status.Name == "Person v2 Person");
        var personProductsAPI = systemStatus.FirstOrDefault(status => status.Name == "Person v2 Products");

        // Assert
        Assert.That(personPersonAPI?.Status, Is.EqualTo(SystemStatus.Down));
        Assert.That(personProductsAPI?.Status, Is.EqualTo(SystemStatus.Down));
        Assert.That(systemStatus.Count, Is.GreaterThan(2));
    }

    [Test]
    public async Task GetSystemStatus_PersonAPIDown_KeepsWorking()
    {
        // Arrange
        var crmId = "12345678";

        // Setup Person Call
        _daprService
            .InvokeDaprGetMethodAsync<PersonV2Response>(Arg.Any<string>(), Arg.Any<string>())
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        // Setup Person Products Call
        _personService
            .GetProducts(crmId)
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var personPersonAPI = systemStatus.FirstOrDefault(status => status.Name == "Person v2 Person");
        var personProductsAPI = systemStatus.FirstOrDefault(status => status.Name == "Person v2 Products");

        // Assert
        Assert.That(personPersonAPI?.Status, Is.EqualTo(SystemStatus.Down));
        Assert.That(personProductsAPI?.Status, Is.EqualTo(SystemStatus.Down));
        Assert.That(systemStatus.Count, Is.GreaterThan(2));
    }

    [Test]
    public async Task GetSystemStatus_GetsContentfulData_Successful()
    {
        // Arrange
        var crmId = "12345678";

        _contentService
            .GetContentAsync(Arg.Any<string>())
            .Returns(Task.FromResult("successful query"));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var contentful = systemStatus.FirstOrDefault(status => status.Name == "Contentful");

        // Assert
        Assert.That(contentful?.Status, Is.EqualTo(SystemStatus.Healthy));
    }

    [Test]
    public async Task GetSystemStatus_GetsContentfulData_ThrowsException()
    {
        // Arrange
        var crmId = "12345678";

        _contentService
            .GetContentAsync(Arg.Any<string>())
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var contentful = systemStatus.FirstOrDefault(status => status.Name == "Contentful");

        // Assert
        Assert.That(contentful?.Status, Is.EqualTo(SystemStatus.Down));
    }

    [Test]
    public async Task GetSystemStatus_GetsFinOpsData_Successful()
    {
        // Arrange
        var crmId = "12345678";

        SetupPersonCall();

        // Setup finops call
        _finOpsService
            .GetProductHoldingList(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult(new List<FinOpsProductHolding>() { new FinOpsProductHolding() }));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var finOps = systemStatus.FirstOrDefault(status => status.Name == "FinOps Product List");

        // Assert
        Assert.That(finOps?.Status, Is.EqualTo(SystemStatus.Healthy));
    }

    [Test]
    public async Task GetSystemStatus_GetsPersonQuotes_Successful()
    {
        // Arrange
        var crmId = "12345678";

        // Setup finance call
        _financeService
            .GetFinanceQuotes(crmId)
            .Returns(Task.FromResult(new List<FinanceQuote>() { new FinanceQuote() }));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var quotes = systemStatus.FirstOrDefault(status => status.Name == "Person v1 Quotes");

        // Assert
        Assert.That(quotes?.Status, Is.EqualTo(SystemStatus.Healthy));
    }

    [Test]
    public async Task GetSystemStatus_GetsInsuranceData_AllSuccessful()
    {
        // Arrange
        var crmId = "12345678";

        SetupPersonCall();

        // Setup policy summary
        _insuranceService
            .GetPortfolioSummary("1234")
            .Returns(Task.FromResult(
                new InsurancePortfolioSummary()
                {
                    Contacts = new List<PortfolioSummaryContact>() {
                        new PortfolioSummaryContact()
                        {
                            ContactExternalNumber = "1234",
                            PolicyDetails = new List<PolicyDetail>()
                            {
                                new PolicyDetail()
                                {
                                    PolicyNumber = "1234"
                                }
                            }
                        }
                    }
                }
            ));

        // Setup policy contacts
        _insuranceService
            .GetContactByExternalShieldNumber("1234")
            .Returns(Task.FromResult(new Contact()));

        // Setup policy payment info
        _insuranceService
            .GetInsurancePolicies("1234")
            .Returns(Task.FromResult(new InsuranceProductResponse()));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldReferenceData = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Reference Data");
        var shieldContacts = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Contacts");
        var shieldPolicy = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Policy");

        // Assert
        Assert.That(shieldReferenceData?.Status, Is.EqualTo(SystemStatus.Healthy));
        Assert.That(shieldContacts?.Status, Is.EqualTo(SystemStatus.Healthy));
        Assert.That(shieldPolicy?.Status, Is.EqualTo(SystemStatus.Healthy));
    }

    [Test]
    public async Task GetSystemStatus_GetPortfolioSummary_Responding()
    {
        // Arrange
        var crmId = "12345678";

        // Setup policy summary
        _insuranceService
            .GetPortfolioSummary(Arg.Any<string>())
            .Throws(new HttpRequestException("Unprocessable Entity", null, HttpStatusCode.NotFound));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldReferenceData = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Reference Data");

        // Assert
        Assert.That(shieldReferenceData?.Status, Is.EqualTo(SystemStatus.Responding));
    }

    [Test]
    public async Task GetSystemStatus_GetPortfolioSummary_ThrowsError()
    {
        // Arrange
        var crmId = "12345678";

        // Setup policy summary
        _insuranceService
            .GetPortfolioSummary(Arg.Any<string>())
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldReferenceData = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Reference Data");

        // Assert
        Assert.That(shieldReferenceData?.Status, Is.EqualTo(SystemStatus.Down));
    }

    [Test]
    public async Task GetSystemStatus_GetContacts_Responding()
    {
        // Arrange
        var crmId = "12345678";

        // Setup policy summary
        _insuranceService
            .GetContactByExternalShieldNumber(Arg.Any<string>())
            .Throws(new HttpRequestException("Not Found", null, HttpStatusCode.NotFound));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldContacts = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Contacts");

        // Assert
        Assert.That(shieldContacts?.Status, Is.EqualTo(SystemStatus.Responding));
    }

    [Test]
    public async Task GetSystemStatus_GetContacts_ThrowsError()
    {
        // Arrange
        var crmId = "12345678";

        // Setup policy summary
        _insuranceService
            .GetContactByExternalShieldNumber(Arg.Any<string>())
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldContacts = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Contacts");

        // Assert
        Assert.That(shieldContacts?.Status, Is.EqualTo(SystemStatus.Down));
    }

    [Test]
    public async Task GetSystemStatus_GetPolicies_Responding()
    {
        // Arrange
        var crmId = "12345678";

        // Setup policy summary
        _insuranceService
            .GetInsurancePolicies(Arg.Any<string>())
            .Throws(new HttpRequestException("Not Found", null, HttpStatusCode.NotFound));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldPolicy = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Policy");

        // Assert
        Assert.That(shieldPolicy?.Status, Is.EqualTo(SystemStatus.Responding));
    }

    [Test]
    public async Task GetSystemStatus_GetPolicies_ThrowsError()
    {
        // Arrange
        var crmId = "12345678";

        // Setup policy summary
        _insuranceService
            .GetInsurancePolicies(Arg.Any<string>())
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldPolicy = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Policy");

        // Assert
        Assert.That(shieldPolicy?.Status, Is.EqualTo(SystemStatus.Down));
    }

    [Test]
    public async Task GetSystemStatus_GetsFinanceProducts_Successful()
    {
        // Arrange
        var crmId = "12345678";

        // Setup Person Products Call
        _personService
            .GetProducts(crmId)
            .Returns(Task.FromResult(
                new PersonProducts
                {
                    ProductHoldings = new List<PersonProductHolding>()
                    {
                        new PersonProductHolding()
                        {
                            Product = "Loan",
                            ProductId = Guid.NewGuid(),
                            ProductBusinessType = "Finance",
                            ProductStatus = "Active",
                            StartDate = DateTime.MinValue,
                            EndDate = DateTime.MaxValue,
                            SourceId = "1234"
                        }
                    }
                }
            ));

        // Setup finance call
        _financeService
            .GetProductList("1234")
            .Returns(Task.FromResult(new FinanceProductResponse()));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var finance = systemStatus.FirstOrDefault(status => status.Name == "Finance");

        // Assert
        Assert.That(finance?.Status, Is.EqualTo(SystemStatus.Healthy));
    }

    [Test]
    public async Task GetSystemStatus_GetsFinanceProducts_ThrowsNotFoundError()
    {
        // Arrange
        var crmId = "12345678";

        // Setup Person Products Call
        _personService
            .GetProducts(crmId)
            .Returns(Task.FromResult(
                new PersonProducts
                {
                    ProductHoldings = new List<PersonProductHolding>()
                    {
                        new PersonProductHolding()
                        {
                            Product = "Loan",
                            ProductId = Guid.NewGuid(),
                            ProductBusinessType = "Finance",
                            ProductStatus = "Active",
                            StartDate = DateTime.MinValue,
                            EndDate = DateTime.MaxValue,
                            SourceId = "1234"
                        }
                    }
                }
            ));

        // Setup finance call
        _financeService
            .GetProductList("1234")
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.BadRequest));

        // Act
        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var finance = systemStatus.FirstOrDefault(status => status.Name == "Finance");

        // Assert
        Assert.That(finance?.Status, Is.EqualTo(SystemStatus.Responding));
    }

    private void SetupPersonCall(PersonV2Response? personV2Response = null)
    {
        _daprService
            .InvokeDaprGetMethodAsync<PersonV2Response>(
                Arg.Any<string>(),
                Arg.Any<string>()
            ).Returns(
                Task.FromResult(
                    personV2Response ??
                    new PersonV2Response()
                    {
                        RacId = "1234",
                        PersonSystemIds = new List<PersonV2SystemId>() {
                            new PersonV2SystemId { System = "Shield", SystemId = "1234" }
                        }
                    }
                )
            );
    }
}
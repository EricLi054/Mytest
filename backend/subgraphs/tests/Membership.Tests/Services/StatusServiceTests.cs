using System.Net;
using Membership.GraphQL.Types;
using Membership.Interfaces;
using Membership.Services;
using Membership.Types.Finance;
using Membership.Types.FinOps;
using Membership.Types.Insurance;
using Membership.Types.Person;
using Membership.Types.Status;
using Microsoft.AspNetCore.Http;
using Moq;
using Shared.Tests.Helpers;
using Shouldly;

namespace Membership.Tests.Services;

[TestFixture]
public class StatusServiceTests : BaseServiceTests<StatusService>
{
    private Mock<IPersonService> _personService;
    private Mock<IMemberCardService> _memberCardService;
    private Mock<IFinanceService> _financeService;
    private Mock<IFinOpsService> _finOpsService;
    private Mock<IInsuranceService> _insuranceService;
    private IStatusService _statusService;

    [SetUp]
    public override void SetUp()
    {
        base.SetUp();

        _personService = new Mock<IPersonService>();
        _memberCardService = new Mock<IMemberCardService>();
        _financeService = new Mock<IFinanceService>();
        _finOpsService = new Mock<IFinOpsService>();
        _insuranceService = new Mock<IInsuranceService>();
        _statusService = new StatusService(
            _personService.Object,
            _memberCardService.Object,
            _financeService.Object,
            _finOpsService.Object,
            _insuranceService.Object
        );
    }

    [Test]
    public void GetSystemStatus_NoCrmId_ThrowsException()
    {
        var crmId = string.Empty;

        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await _statusService.GetSystemStatus(crmId));
    }

    [Test]
    public async Task GetSystemStatus_NoPersonAPIData_KeepsWorking()
    {
        var crmId = "12345678";

        _personService
            .Setup(p => p.GetPersonProductsAsync(crmId))
            .Returns(Task.FromResult<List<PersonProductHolding>?>(null));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var personPersonAPI = systemStatus.FirstOrDefault(status => status.Name == "Person v2 Person");
        var personProductsAPI = systemStatus.FirstOrDefault(status => status.Name == "Person v2 Products");

        personPersonAPI?.Status.ShouldBe(SystemStatus.Down);
        personProductsAPI?.Status.ShouldBe(SystemStatus.Down);
        systemStatus.Count.ShouldBeGreaterThan(2);
    }

    [Test]
    public async Task GetSystemStatus_PersonAPIDown_KeepsWorking()
    {
        var crmId = "12345678";

        _personService
            .Setup(p => p.GetPersonProductsAsync(crmId))
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var personPersonAPI = systemStatus.FirstOrDefault(status => status.Name == "Person v2 Person");
        var personProductsAPI = systemStatus.FirstOrDefault(status => status.Name == "Person v2 Products");

        personPersonAPI?.Status.ShouldBe(SystemStatus.Down);
        personProductsAPI?.Status.ShouldBe(SystemStatus.Down);
        systemStatus.Count.ShouldBeGreaterThan(2);
    }

    [Test]
    public async Task GetSystemStatus_GetsFinOpsData_Successful()
    {
        var crmId = "12345678";

        SetupPersonCall(crmId);

        _finOpsService
            .Setup(f => f.GetProductHoldingListAsync(crmId))
            .Returns(Task.FromResult(new List<ProductHolding>() { new ProductHolding() }));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var finOps = systemStatus.FirstOrDefault(status => status.Name == "FinOps Product List");

        finOps?.Status.ShouldBe(SystemStatus.Healthy);
    }

    [Test]
    public async Task GetSystemStatus_GetsPersonQuotes_Successful()
    {
        var crmId = "12345678";

        _financeService
            .Setup(f => f.GetFinanceQuotesAsync(crmId))
            .Returns(Task.FromResult<List<FinanceQuote>?>(new List<FinanceQuote>() { new FinanceQuote() }));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var quotes = systemStatus.FirstOrDefault(status => status.Name == "Person v1 Quotes");

        quotes?.Status.ShouldBe(SystemStatus.Healthy);
    }

    [Test]
    public async Task GetSystemStatus_GetsInsuranceData_AllSuccessful()
    {
        var crmId = "12345678";

        SetupPersonCall(crmId);

        _insuranceService
            .Setup(p => p.GetPortfolioSummaryAsync("1234"))
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

        _insuranceService
            .Setup(p => p.GetContactByExternalShieldNumberAsync("1234"))
            .Returns(Task.FromResult(new Contact()));

        _insuranceService
            .Setup(p => p.GetInsurancePoliciesAsync("1234"))
            .Returns(Task.FromResult(new InsuranceProductResponse()));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldReferenceData = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Reference Data");
        var shieldContacts = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Contacts");
        var shieldPolicy = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Policy");

        shieldReferenceData?.Status.ShouldBe(SystemStatus.Healthy);
        shieldContacts?.Status.ShouldBe(SystemStatus.Healthy);
        shieldPolicy?.Status.ShouldBe(SystemStatus.Healthy);
    }

    [Test]
    public async Task GetSystemStatus_GetPortfolioSummary_Responding()
    {
        MockConfigurationValue(ConfigurationKeys.BaseUrlKey, "https://api.example.com");
        MockConfigurationValue(ConfigurationKeys.PersonApiEndpointKey, "/person");
        MockConfigurationValue(ConfigurationKeys.ApiKeyKey, "EXAMPLEAPIKEY");

        var crmId = "12345678";

        _insuranceService
            .Setup(p => p.GetPortfolioSummaryAsync("1234"))
            .Throws(new HttpRequestException("Unprocessable Entity", null, HttpStatusCode.NotFound));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldReferenceData = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Reference Data");

        shieldReferenceData?.Status.ShouldBe(SystemStatus.Responding);
    }

    [Test]
    public async Task GetSystemStatus_GetPortfolioSummary_ThrowsError()
    {
        var crmId = "12345678";

        _insuranceService
            .Setup(p => p.GetPortfolioSummaryAsync("1234"))
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldReferenceData = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Reference Data");

        shieldReferenceData?.Status.ShouldBe(SystemStatus.Down);
    }

    [Test]
    public async Task GetSystemStatus_GetContacts_Responding()
    {
        var crmId = "12345678";

        _insuranceService
            .Setup(p => p.GetContactByExternalShieldNumberAsync("1234"))
            .Throws(new HttpRequestException("Not Found", null, HttpStatusCode.NotFound));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldContacts = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Contacts");

        shieldContacts?.Status.ShouldBe(SystemStatus.Responding);
    }

    [Test]
    public async Task GetSystemStatus_GetContacts_ThrowsError()
    {
        var crmId = "12345678";

        _insuranceService
        .Setup(p => p.GetContactByExternalShieldNumberAsync("1234"))
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldContacts = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Contacts");

        shieldContacts?.Status.ShouldBe(SystemStatus.Down);
    }

    [Test]
    public async Task GetSystemStatus_GetPolicies_Responding()
    {
        var crmId = "12345678";

        _insuranceService
            .Setup(p => p.GetInsurancePoliciesAsync("1234"))
            .Throws(new HttpRequestException("Not Found", null, HttpStatusCode.NotFound));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldPolicy = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Policy");

        shieldPolicy?.Status.ShouldBe(SystemStatus.Responding);
    }

    [Test]
    public async Task GetSystemStatus_GetPolicies_ThrowsError()
    {
        var crmId = "12345678";

        _insuranceService
            .Setup(p => p.GetInsurancePoliciesAsync("1234"))
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.InternalServerError));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var shieldPolicy = systemStatus.FirstOrDefault(status => status.Name == "SHIELD Policy");

        shieldPolicy?.Status.ShouldBe(SystemStatus.Down);
    }

    [Test]
    public async Task GetSystemStatus_GetsFinanceProducts_Successful()
    {
        var crmId = "12345678";

        _personService
            .Setup(p => p.GetPersonProductsAsync(crmId))
            .Returns(Task.FromResult<List<PersonProductHolding>?>(
                new List<PersonProductHolding>()
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
            ));

        _financeService
            .Setup(p => p.GetProductListAsync("1234"))
            .Returns(Task.FromResult<FinanceProductResponse?>(new FinanceProductResponse()));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var finance = systemStatus.FirstOrDefault(status => status.Name == "Finance");

        Assert.That(finance?.Status, Is.EqualTo(SystemStatus.Healthy));
        finance?.Status.ShouldBe(SystemStatus.Healthy);
    }

    [Test]
    public async Task GetSystemStatus_GetsFinanceProducts_ThrowsNotFoundError()
    {
        var crmId = "12345678";

        _personService
            .Setup(p => p.GetPersonProductsAsync(crmId))
            .Returns(Task.FromResult<List<PersonProductHolding>?>(
                new List<PersonProductHolding>()
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
            ));

        _financeService
            .Setup(p => p.GetProductListAsync("1234"))
            .Throws(new HttpRequestException("Internal Server Error", null, HttpStatusCode.BadRequest));

        var systemStatus = await _statusService.GetSystemStatus(crmId);

        var finance = systemStatus.FirstOrDefault(status => status.Name == "Finance");

        finance?.Status.ShouldBe(SystemStatus.Responding);
    }

    private void SetupPersonCall(string crmId)
    {
        var person = new Person
        {
            RacId = "12345678",
            PersonId = crmId,
            PersonSystemIds = new List<PersonSystemId>()
            {
                new PersonSystemId
                {
                    SystemId = "1234",
                    System = "Shield"
                }
            }
        };

        _personService.Setup(p => p.GetPersonAsync(crmId)).ReturnsAsync(person);
    }
}
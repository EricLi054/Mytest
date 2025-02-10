using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Products.AnnuityProducts;
using DigitalPlatform.API.Models.SourceSystem.Insurance;
using DigitalPlatform.API.Tests.Data;
using Microsoft.Extensions.Configuration;

namespace DigitalPlatform.API.Tests.Models.Products.AnnuityProducts
{

    [TestFixture]
    public class InsuranceProductHoldingTests
    {
        private IConfiguration _configuration;
        private IFeatureService _featureService;

        [SetUp]
        public void Setup()
        {
            _configuration = Substitute.For<IConfiguration>();
            _featureService = Substitute.For<IFeatureService>();
        }

        [Test]
        public void BankDetails_WhenProductIsDDBA_ReturnsMaskedBankAccountDetails()
        {
            // Arrange
            var insuranceProductHolding = new InsuranceProductHolding(
                new PortfolioSummaryContact(),
                InsuranceTestData.ValidContact,
                InsuranceTestData.ValidMotorPolicy1,
                InsuranceTestData.ValidMotorInsuranceProductResponse1,
                _configuration,
                _featureService
            );

            // Assert
            Assert.That(insuranceProductHolding.BSB, Is.EqualTo("***456"));
            Assert.That(insuranceProductHolding.AccountNumber, Is.EqualTo("****5678"));
        }

        private static object[] GetCarHomeCases =
        {
            new object[] { "Motor Annual Payment - Toggle On", true, InsuranceTestData.ValidMotorPolicy1, InsuranceTestData.ValidMotorInsuranceProductResponse1, false },
            new object[] { "Motor DD - Toggle On", true, InsuranceTestData.ValidMotorPolicy2, InsuranceTestData.ValidMotorInsuranceProductResponse2, true },
            new object[] { "Motor DD - Toggle Off", false, InsuranceTestData.ValidMotorPolicy2, InsuranceTestData.ValidMotorInsuranceProductResponse2, false },
            new object[] { "Home DD - Toggle On", true, InsuranceTestData.ValidHomePolicy, InsuranceTestData.ValidHomeInsuranceProductResponseWithInstallments, true },
            new object[] { "Home DD - Toggle Off", false, InsuranceTestData.ValidHomePolicy, InsuranceTestData.ValidHomeInsuranceProductResponseWithInstallments, false }
        };

        [Test, TestCaseSource(nameof(GetCarHomeCases))]
        public void Actions_CarHome_ShowUHYP(string description, bool uhypEnabled, PolicyDetail policyDetail, InsuranceProductResponse insuranceProductResponse, bool shouldSeeUHYP)
        {
            _featureService.IsFeatureEnabled(FeatureFlags.UHYP).Returns(uhypEnabled);

            // Arrange
            var insuranceProductHolding = new InsuranceProductHolding(
                new PortfolioSummaryContact(),
                InsuranceTestData.ValidContact,
                policyDetail,
                insuranceProductResponse,
                _configuration,
                _featureService
            );

            // Assert
            var hasUHYP = insuranceProductHolding.Actions.SelectMany(x => x.SubActions ?? []).Any(action => action.Label == "Update how you pay");
            Assert.That(hasUHYP, Is.EqualTo(shouldSeeUHYP));
        }

        private static object[] GetPetBoatMobilityCases =
        {
            new object[] { "Pet DD - Pet Toggle On, Feature toggle off", false, true, false, false, InsuranceTestData.ValidPetPolicy, InsuranceTestData.ValidPetInsuranceProductResponseWithNextPayableInstallment, false },
            new object[] { "Pet DD - Pet Toggle On", true, true, false, false, InsuranceTestData.ValidPetPolicy, InsuranceTestData.ValidPetInsuranceProductResponseWithNextPayableInstallment, true },
            new object[] { "Pet DD - Pet Toggle Off", true, false, false, false, InsuranceTestData.ValidPetPolicy, InsuranceTestData.ValidPetInsuranceProductResponseWithNextPayableInstallment, false },
            new object[] { "Boat DD - Boat Toggle On", true, false, true, false, InsuranceTestData.ValidBoatPolicy, InsuranceTestData.ValidBoatInsuranceProductResponse, true },
            new object[] { "Boat DD - Boat Toggle Off", true, false, false, false, InsuranceTestData.ValidBoatPolicy, InsuranceTestData.ValidBoatInsuranceProductResponse, false },
            new object[] { "Mobility DD - Mobility Toggle On", true, false, false, true, InsuranceTestData.ValidElectricMobilityScooterPolicy, InsuranceTestData.ValidElectricMobilityScooterInsuranceProductResponse, true },
            new object[] { "Mobility DD - Mobility Toggle Off", true, false, false, false, InsuranceTestData.ValidElectricMobilityScooterPolicy, InsuranceTestData.ValidElectricMobilityScooterInsuranceProductResponse, false }
        };

        [Test, TestCaseSource(nameof(GetPetBoatMobilityCases))]
        public void Actions_PetBoatMobility_ShowUHYP(string description, bool uhypEnabled, bool petEnabled, bool boatEnabled, bool mobilityEnabled, PolicyDetail policyDetail, InsuranceProductResponse insuranceProductResponse, bool shouldSeeUHYP)
        {
            _featureService.IsFeatureEnabled(FeatureFlags.UHYP).Returns(uhypEnabled);
            _featureService.IsFeatureEnabled(FeatureFlags.UHYP_Pet).Returns(petEnabled);
            _featureService.IsFeatureEnabled(FeatureFlags.UHYP_Boat).Returns(boatEnabled);
            _featureService.IsFeatureEnabled(FeatureFlags.UHYP_Mobility).Returns(mobilityEnabled);

            // Arrange
            var insuranceProductHolding = new InsuranceProductHolding(
                new PortfolioSummaryContact(),
                InsuranceTestData.ValidContact,
                policyDetail,
                insuranceProductResponse,
                _configuration,
                _featureService
            );

            // Assert
            var hasUHYP = insuranceProductHolding.Actions.SelectMany(x => x.SubActions ?? []).Any(action => action.Label == "Update how you pay");
            Assert.That(hasUHYP, Is.EqualTo(shouldSeeUHYP));
        }
    }
}
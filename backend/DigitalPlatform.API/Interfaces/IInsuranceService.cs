using DigitalPlatform.API.Models.SourceSystem.Insurance;

namespace DigitalPlatform.API.Interfaces
{
    public interface IInsuranceService
    {
        Task<InsurancePortfolioSummary> GetPortfolioSummary(string shieldContactNumber);
        Task<Contact> GetContactByExternalShieldNumber(string externalShieldNumber);
        Task<InsuranceProductResponse> GetInsurancePolicies(string policyNumber);
    }
}

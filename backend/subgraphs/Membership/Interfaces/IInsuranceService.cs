using Membership.Types.Finance;
using Membership.Types.Insurance;

namespace Membership.Interfaces;

public interface IInsuranceService
{
    Task<InsurancePortfolioSummary> GetPortfolioSummaryAsync(string shieldContactNumber);
    Task<Contact> GetContactByExternalShieldNumberAsync(string externalShieldNumber);
    Task<InsuranceProductResponse> GetInsurancePoliciesAsync(string policyNumber);
}
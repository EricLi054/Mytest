namespace Membership.Types.Insurance;

public class PortfolioSummaryContact
{
    public int ContactId { get; set; }
    public string ContactExternalNumber { get; set; } = string.Empty;
    public int Id { get; set; }
    public List<PolicyDetail> PolicyDetails { get; set; } = default!;
    public List<ClaimDetails> ClaimDetails { get; set; } = default!;

    public Dictionary<string, List<string>> GetPoliciesWithClaims(string insuranceProductType, string policyNumber)
    {
        if (ClaimDetails == null || !ClaimDetails.Any())
        {
            return new();
        }

        var policyWithClaims = new Dictionary<string, List<string>>();
        foreach (var claim in ClaimDetails)
        {
            if (claim.PolicyDetails == null || claim.PolicyDetails.PolicyType.ProductType != insuranceProductType)
            {
                continue;
            }

            if (policyNumber != null && claim.PolicyDetails.PolicyNumber != policyNumber)
            {
                continue;
            }

            if (policyWithClaims.ContainsKey(claim.PolicyDetails.PolicyNumber))
            {
                var claimsList = policyWithClaims[claim.PolicyDetails.PolicyNumber];
                claimsList.Add(claim.ClaimNumber);
                policyWithClaims[claim.PolicyDetails.PolicyNumber] = claimsList;
            }
            else
            {
                policyWithClaims.Add(claim.PolicyDetails.PolicyNumber, new List<string> { claim.ClaimNumber });
            }
        }

        return policyWithClaims;
    }
}

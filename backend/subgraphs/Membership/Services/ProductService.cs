using Membership.Constants;
using Membership.Extensions;
using Membership.GraphQL.Types;
using Membership.Interfaces;
using Membership.Types.Insurance;
using Membership.Types.Products;
using Membership.Types.Products.AnnuityProducts;
using Shared.Exceptions;
using Shared.Interfaces;

namespace Membership.Services;

/*
    TODO: This service will be refactored to move logic into the appropriate layers
    either down into the source system service, or up in the consuming application
*/
public class ProductService(
    IPersonService personService,
    IFinanceService financeService,
    IFinOpsService finOpsService,
    IInsuranceService insuranceService,
    IConfiguration configuration,
    IFeatureService featureService,
    ILogger<ProductService> logger
    ) : IProductService
{
    public async Task<MemberProducts> GetProductsAsync(string crmId, string sessionKey)
    {
        // TODO: Make person service check MFA session
        var person = await personService.GetPersonAsync(crmId);

        var products = new MemberProducts
        {
            AnnuityProducts = new List<AnnuityProduct>(),
            SystemErrors = new List<SystemError>()
        };

        try
        {
            await ProcessFinOpsDataAsync(person.RacId, products);
            if (person.PersonSystemIds != null && person.PersonSystemIds.Any())
            {
                await ProcessInsuranceData(person.PersonSystemIds, products);
            }
            await ProcessFinanceDataAsync(crmId, products);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while processing products for crmId: {CrmId}", crmId);
            throw;
        }

        products.AnnuityProducts = products.AnnuityProducts
            .OrderByDescending(x => x.ShowPayNow)
            .ThenBy(item => item.Type == FinOpsConstants.ProductCodes.Rewards ? 0 : ReturnItemOrder(item))
            .ThenBy(x => x.NextPaymentActionDate)
            .ToList();

        return products;
    }

    private async Task ProcessFinOpsDataAsync(string memberNumber, MemberProducts memberProducts)
    {
        try
        {
            var finOpsProductHoldingList = await finOpsService.GetProductHoldingListAsync(memberNumber);

            if (finOpsProductHoldingList == null || finOpsProductHoldingList.Count() == 0)
            {
                logger.LogWarning("No FinOps product holdings found for member number: {MemberNumber}", memberNumber);
                return;
            }

            finOpsProductHoldingList.ProcessProductHoldings(FinOpsConstants.Products.Valid);

            foreach (var productHeader in finOpsProductHoldingList.Where(ph => ph?.ProductHoldingLines != null))
            {
                var distinctProductIds = productHeader
                    .ProductHoldingLines
                    .Select(x => x.ProductHoldingId?.Split('-')[0])
                    ?.Distinct() ?? [];
                bool isBundle = distinctProductIds.Any();

                foreach (var lineItem in productHeader.ProductHoldingLines)
                {
                    FinOpsProductFlags productFlags = await lineItem.GenerateProductFlagsAsync(productHeader, distinctProductIds!, featureService, isBundle);

                    if (productFlags.ShowPayNow && productFlags.IsDirectDebit)
                    {
                        logger.LogWarning("Product cannot be in a Pay Now state and be Direct Debit at the same time");
                        continue;
                    }
                    if (productFlags.IsRewards && productFlags.IsUpgradeDowngradeEligible)
                    {
                        logger.LogWarning("Product cannot be both a rewards product and upgrade/downgrade eligible");
                        continue;
                    }

                    memberProducts.AnnuityProducts.Add(new RoadsideProductHolding(productHeader!, lineItem, productFlags));
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing FinOps data for member number: {MemberNumber}", memberNumber);
            memberProducts.SystemErrors.Add(new SystemError { Message = ex.Message, SystemKey = SystemKey.FinOps });
        }
    }

    private async Task ProcessFinanceDataAsync(string crmId, MemberProducts memberProducts)
    {
        // Finance Loans
        try
        {
            var mcProducts = await personService.GetPersonProductsAsync(crmId);

            var financeProductsFromMC = mcProducts?
                .Where(p => p?.ProductBusinessType?.ToLower() == "finance" &&
                            p?.ProductStatus?.ToLower() == "active" &&
                            p?.StartDate <= DateTime.Now)
                .GroupBy(p => (p.ProductNumber, p.Product))
                .Select(pr => pr.OrderByDescending(gr => gr.EndDate).FirstOrDefault())
                .ToList();

            var rimId = financeProductsFromMC?.Select(p => p?.SourceId).FirstOrDefault();

            if (!string.IsNullOrEmpty(rimId))
            {
                var financeProducts = await financeService.GetProductListAsync(rimId);

                if (financeProducts?.PartyProductList == null || financeProducts.PartyProductList.Count == 0)
                {
                    throw new NotFoundException($"No finance products found for RIM ID: {rimId}");
                }

                foreach (var product in financeProducts.PartyProductList)
                {
                    var loan = product?.FinanceProduct?.FinanceLoan;
                    if (loan != null)
                    {
                        memberProducts.AnnuityProducts.Add(new FinanceProductHolding(loan));
                    }
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing finance loans for crmId: {CrmId}", crmId);
            memberProducts.SystemErrors.Add(new SystemError { Message = ex.Message, SystemKey = SystemKey.Finance });
        }

        // Finance Quotes
        try
        {
            var financeQuotes = await financeService.GetFinanceQuotesAsync(crmId);

            if (financeQuotes != null)
            {
                foreach (var quote in financeQuotes)
                {
                    try
                    {
                        if (quote.IsExpired) continue;
                        memberProducts?.AnnuityProducts?.Add(new FinanceProductHolding(quote: quote));
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Error processing finance quote for CrmId: {CrmId}", crmId);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing finance quotes for crmId: {CrmId}", crmId);
            memberProducts.SystemErrors.Add(new SystemError { Message = ex.Message, SystemKey = SystemKey.Finance });
        }
    }

    private async Task ProcessInsuranceData(List<PersonSystemId> personSystemIds, MemberProducts memberProducts)
    {
        logger.LogInformation("Processing Insurance data for person with system IDs: {SystemIds}", string.Join(", ", personSystemIds.Select(value => value.SystemId)));

        try
        {
            var insuranceProductHoldings = new List<InsuranceProductHolding>();

            var insuranceSummaries = await GetInsuranceSummaries(personSystemIds, memberProducts);
            if (insuranceSummaries == null)
            {
                logger.LogWarning("No insurance summaries found for person system IDs");
                return;
            }

            var contacts = insuranceSummaries.Where(s => s?.Contacts != null).SelectMany(s => s.Contacts);

            foreach (var portfolioSummaryContact in contacts)
            {
                if (portfolioSummaryContact?.PolicyDetails == null || string.IsNullOrEmpty(portfolioSummaryContact.ContactExternalNumber))
                {
                    continue;
                }

                var insuranceContact = await insuranceService.GetContactByExternalShieldNumberAsync(portfolioSummaryContact.ContactExternalNumber);

                if (insuranceContact == null)
                {
                    continue;
                }

                foreach (var policy in portfolioSummaryContact.PolicyDetails.Where(p => !string.IsNullOrEmpty(p.PolicyNumber)))
                {
                    var policyPaymentInfo = await insuranceService.GetInsurancePoliciesAsync(policy.PolicyNumber);

                    if (policyPaymentInfo != null)
                    {
                        var featureFlags = await featureService.GetFeatureFlagsAsync();
                        insuranceProductHoldings.Add(new(portfolioSummaryContact, insuranceContact, policy, policyPaymentInfo, configuration, featureFlags ?? []));
                    }
                }
            }

            memberProducts.AnnuityProducts?.AddRange(insuranceProductHoldings.OrderBy(n => n.Title));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing insurance data for person system IDs");
            memberProducts.SystemErrors.Add(new SystemError { Message = ex.Message, SystemKey = SystemKey.Shield });
        }

    }

    private async Task<List<InsurancePortfolioSummary>> GetInsuranceSummaries(List<PersonSystemId>? shieldSystemIds, MemberProducts memberProducts)
    {
        var insuranceSummaries = new List<InsurancePortfolioSummary>();

        foreach (var shieldSystemId in shieldSystemIds ?? Enumerable.Empty<PersonSystemId>())
        {
            try
            {
                var insuranceSummary = await insuranceService.GetPortfolioSummaryAsync(shieldSystemId.SystemId ?? "");
                insuranceSummaries.Add(insuranceSummary);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error fetching insurance summary for system ID: {SystemId}", shieldSystemId.SystemId);
                memberProducts.SystemErrors.Add(new SystemError { Message = ex.Message, SystemKey = SystemKey.Shield });
            }
        }

        return insuranceSummaries;
    }

    private static BusinessType ReturnItemOrder(AnnuityProduct item)
    {
        return Enum.TryParse(item.BusinessType, true, out BusinessType orderValue) ? orderValue : BusinessType.Default;
    }
}
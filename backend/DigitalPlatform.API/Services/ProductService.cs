using System.Text.Json;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Extensions;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Models.Products;
using DigitalPlatform.API.Models.Products.AnnuityProducts;
using DigitalPlatform.API.Models.SourceSystem.FinOps;
using DigitalPlatform.API.Models.SourceSystem.Insurance;

namespace DigitalPlatform.API.Services;

public class ProductService(
    IPersonService personService, 
    IInsuranceService insuranceService, 
    IFinanceService financeService, 
    IFinOpsService finOpsService, 
    IConfiguration configuration, 
    IFeatureService featureService,
    ILogger<ProductService> logger) : IProductService
{
    public async Task<MemberProducts> GetProducts(string crmId, Person person)
    {
        if (person == null)
        {
            logger.LogError("Person not found for crmId: {CrmId}", crmId);
            throw new InvalidDataException("Person not found");
        }

        var products = new MemberProducts
        {
            AnnuityProducts = new List<AnnuityProduct>()
        };

        try
        {
            await ProcessFinOpsData(person.RacId, products);
            if (person.PersonSystemIds != null && person.PersonSystemIds.Any())
            {
                await ProcessInsuranceData(person.PersonSystemIds, products);
            }
            await ProcessFinanceData(crmId, products);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while processing products for crmId: {CrmId}", crmId);
            throw;
        }

        products.AnnuityProducts = products.AnnuityProducts
            .OrderByDescending(x => x.ShowPayNow)
            .ThenBy(item => item.Type == "REWARDS" ? 0 : ReturnItemOrder(item))
            .ThenBy(x => x.NextPaymentActionDate)
            .ToList();

        return products;
    }

    public async Task<MemberProducts> GetProducts(string crmId, string sessionKey)
    {
        var person = await personService.GetPerson(crmId, sessionKey);

        if (person == null)
        {
            logger.LogError("Person not found for crmId: {CrmId}", crmId);
            throw new Exception("Person not found");
        }

        var products = await GetProducts(crmId, person);

        return products;
    }

    private async Task ProcessFinOpsData(string memberNumber, MemberProducts products)
    {
        try
        {
            FinOpsProducts finOpsProducts = JsonSerializer.Deserialize<FinOpsProducts>(configuration[ConfigDescriptors.FINOPS_PRODUCTS] ?? "{}") ?? new FinOpsProducts();

            var finOpsProductHoldingList = await finOpsService.GetProductHoldingList(memberNumber ?? "", configuration[ConfigDescriptors.FINOPS_API_COMPANY_ID] ?? "", DateTime.Now.ToString("yyyy-MM-dd"));

            if (finOpsProductHoldingList == null)
            {
                logger.LogWarning("No FinOps product holdings found for member number: {MemberNumber}", memberNumber);
                return;
            }

            finOpsProductHoldingList.ProcessProductHoldings(finOpsProducts.Valid);

            foreach (var productHeader in finOpsProductHoldingList)
            {
                if (productHeader?.ProductHoldingLines == null)
                {
                    continue;
                }

                var distinctProductIds = productHeader.ProductHoldingLines.Select(x => x.ProductHoldingId?.Split('-')[0])?.Distinct();
                bool isBundle = distinctProductIds?.Count() > 1;

                foreach (var lineItem in productHeader.ProductHoldingLines)
                {
                    bool withinExpiryPeriod = finOpsProducts.ExpiryDateRange?.ExpiryPeriod != null &&
                                                DateTime.Now > lineItem.EndDate.AddDays(finOpsProducts.ExpiryDateRange.ExpiryPeriod.DaysBeforeEndDate) &&
                                                DateTime.Now < lineItem.EndDate.AddDays(finOpsProducts.ExpiryDateRange.ExpiryPeriod.DaysAfterEndDate);

                    bool isDirectDebit = productHeader != null && (productHeader.RenewalPaymentMode.Contains("DD") || productHeader.PaymentMode.Contains("DD"));
                    bool isNotBundledOrIsFirstInBundle = !isBundle || (isBundle && distinctProductIds?.First() == lineItem.ProductHoldingId?.Split('-')[0]);
                    bool productCanShowPayNow = finOpsProducts.AllowedToShowPayNow.Contains(lineItem.ProductId);
                    bool productShouldShowPayNow = productCanShowPayNow &&
                                                    (withinExpiryPeriod || productHeader?.TotalDueAmount > 0) &&
                                                    !isDirectDebit;
                    bool isRewardsProduct = finOpsProducts.Rewards.Contains(lineItem.ProductId);
                    bool isUpgradeDowngradeEligible = productHeader?.TotalDueAmount <= 0 &&
                                                        finOpsProducts.AllowedForUpgradeDowngrade.Contains(lineItem.ProductId) &&
                                                        lineItem.ProductChanges?.Any(x => x.CanChangeProductHolding) == true;
                    bool directDebitAllowedForProduct = finOpsProducts.AllowedForDirectDebit.Contains(lineItem.ProductId);
                    bool shouldNeverShowViewCover = finOpsProducts.NotAllowedToShowViewCover.Contains(lineItem.ProductId);

                    FinOpsProductFlags productFlags = new()
                    {
                        ShowPayNow = productShouldShowPayNow,
                        IsRewards = isRewardsProduct,
                        IsUpgradeDowngradeEligible = isUpgradeDowngradeEligible,
                        IsDirectDebit = isDirectDebit,
                        DirectDebitAllowed = directDebitAllowedForProduct,
                        ShouldNeverShowViewCover = shouldNeverShowViewCover,
                        IsFordRoadside = finOpsProducts.FordRoadside.Contains(lineItem.ProductId),
                        IsFree2GoRoadside = finOpsProducts.Free2GoRoadside.Contains(lineItem.ProductId),
                        IsMitsubishiRoadside = finOpsProducts.MitsubishiRoadside.Contains(lineItem.ProductId),
                        IsSubaruRoadside = finOpsProducts.SubaruRoadside.Contains(lineItem.ProductId),
                        IsWheels2Go = finOpsProducts.Wheels2GoRoadside.Contains(lineItem.ProductId),
                        IsBundled = isBundle,
                        IsNotBundledOrFirstInBundle = isNotBundledOrIsFirstInBundle,
                    };

                    if (productShouldShowPayNow && isDirectDebit)
                    {
                        throw new ArgumentException("Product cannot be in a Pay Now state and be Direct Debit at the same time");
                    }
                    if (isRewardsProduct && isUpgradeDowngradeEligible)
                    {
                        throw new ArgumentException("Product cannot be both a rewards product and upgrade/downgrade eligible");
                    }

                    products.AnnuityProducts?.Add(new RoadsideProductHolding(productHeader ?? new FinOpsProductHolding(), lineItem, productFlags));
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing FinOps data for member number: {MemberNumber}", memberNumber);
        }
    }

    private async Task ProcessInsuranceData(List<PersonSystemId> personSystemIds, MemberProducts productHoldings)
    {
        try
        {
            var insuranceProductHoldings = new List<InsuranceProductHolding>();

            var insuranceSummaries = await GetInsuranceSummaries(personSystemIds);

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

                var insuranceContact = await insuranceService.GetContactByExternalShieldNumber(portfolioSummaryContact.ContactExternalNumber);

                if (insuranceContact == null)
                {
                    continue;
                }

                foreach (var policy in portfolioSummaryContact.PolicyDetails.Where(p => !string.IsNullOrEmpty(p.PolicyNumber)))
                {
                    var policyPaymentInfo = await insuranceService.GetInsurancePolicies(policy.PolicyNumber);

                    if (policyPaymentInfo != null)
                    {
                        insuranceProductHoldings.Add(new(portfolioSummaryContact, insuranceContact, policy, policyPaymentInfo, configuration, featureService));
                    }
                }
            }

            productHoldings.AnnuityProducts?.AddRange(insuranceProductHoldings.OrderBy(n => n.Title));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing insurance data for person system IDs");
        }
    }

    private async Task<List<InsurancePortfolioSummary>> GetInsuranceSummaries(List<PersonSystemId>? shieldSystemIds)
    {
        var insuranceSummaries = new List<InsurancePortfolioSummary>();

        foreach (var shieldSystemId in shieldSystemIds ?? Enumerable.Empty<PersonSystemId>())
        {
            try
            {
                var insuranceSummary = await insuranceService.GetPortfolioSummary(shieldSystemId.SystemId ?? "");
                insuranceSummaries.Add(insuranceSummary);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error fetching insurance summary for system ID: {SystemId}", shieldSystemId.SystemId);
            }
        }

        return insuranceSummaries;
    }

    private async Task ProcessFinanceData(string crmId, MemberProducts productHoldings)
    {
        try
        {
            var mcProducts = await personService.GetProducts(crmId);

            var financeProductsFromMC = mcProducts?.ProductHoldings?
                .Where(p => p?.ProductBusinessType?.ToLower() == "finance" &&
                            p?.ProductStatus?.ToLower() == "active" &&
                            p?.StartDate <= DateTime.Now)
                .GroupBy(p => (p.ProductNumber, p.Product))
                .Select(pr => pr.OrderByDescending(gr => gr.EndDate).FirstOrDefault())
                .ToList();

            if (financeProductsFromMC != null && financeProductsFromMC.Count > 0)
            {
                var rimId = financeProductsFromMC[0]?.SourceId;
                var financeProducts = await financeService.GetProductList(rimId ?? "");

                if (financeProducts?.PartyProductList == null || financeProducts.PartyProductList.Count == 0)
                {
                    logger.LogWarning("No finance products found for RIM ID: {RimId}", rimId);
                    return;
                }

                foreach (var product in financeProducts.PartyProductList)
                {
                    var loan = product?.FinanceProduct?.FinanceLoan;
                    if (loan == null)
                    {
                        continue;
                    }
                    productHoldings.AnnuityProducts?.Add(new FinanceProductHolding(loan));
                }
            }
            #region Quotes

            // Fetch finance quotes
            var financeQuotes = await financeService.GetFinanceQuotes(crmId);
            {
                if (financeQuotes != null)
                {
                    // Iterate through each finance quote and add to ProductHoldings
                    foreach (var quote in financeQuotes)
                    {
                        try
                        {
                            if (quote.Expired < DateTime.Now) return;
                            productHoldings.AnnuityProducts?.Add(new FinanceProductHolding(quote: quote));
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex, "Error processing finance quote for CrmId: {CrmId}", crmId);
                        }
                    }
                }
                #endregion
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing finance data for crmId: {CrmId}", crmId);
        }
    }

    private static BusinessType ReturnItemOrder(AnnuityProduct item)
    {
        return Enum.TryParse(item.BusinessType, true, out BusinessType orderValue) ? orderValue : BusinessType.Default;
    }
}
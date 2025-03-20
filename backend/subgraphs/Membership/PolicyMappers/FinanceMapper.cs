using Membership.Types.PolicyDetails;
using Membership.Types.Products.AnnuityProducts;
using Action = Membership.Types.PolicyDetails.Action;

namespace Membership.PolicyMappers;

/*
    TODO: These mappers will be refactored into the UI layer
*/
public class FinanceMapper(ILogger<FinanceMapper> logger) : IPolicyMapper
{
    public string Type => "Finance";

    public PolicyDetail? Map(AnnuityProduct product)
    {
        if (!product.BusinessType.Equals(Type))
        {
            logger.LogError("Not supported product type {BusinessType}", product.BusinessType);
            return null;
        }

        if (product is not FinanceProductHolding financeProduct)
        {
            logger.LogError("Unexpected product type {TypeName}", product.GetType().Name);
            return null;
        }

        return new PolicyDetail
        {
            Type = financeProduct.Type,
            Title = MapTitle(financeProduct),
            Subtitle = MapSubtitle(financeProduct),
            PolicyItems = MapPolicyItems(financeProduct),
            Actions = MapActions(financeProduct),
        };
    }

    private static string MapTitle(FinanceProductHolding financeProduct)
    {
        return financeProduct.IsFinanceQuote ? $"{financeProduct.Subtitle} {financeProduct.Title}" : financeProduct.Title;
    }

    private static string MapSubtitle(FinanceProductHolding financeProduct)
    {
        return financeProduct.IsFinanceQuote ? financeProduct.QuoteType : financeProduct.Subtitle;
    }

    private static List<PolicyItem> MapPolicyItems(FinanceProductHolding financeProduct)
    {
        var policyItems = new List<PolicyItem>();

        if (financeProduct.IsSecuredInvestment)
        {
            policyItems.AddRange(MapSecureInvestmentItems(financeProduct));
        }
        else if (financeProduct.IsFinanceQuote)
        {
            policyItems.AddRange(MapFinanceQuoteItems(financeProduct));
        }
        else
        {
            if (financeProduct.IsNextPaymentAmountBlank)
            {
                policyItems.Add(new PolicyItem
                {
                    Label = "Next payment",
                    Value = financeProduct.NextPayment
                });
            }
            else
            {
                policyItems.Add(new PolicyItem
                {
                    Label = "Next payment",
                    Value = $"${financeProduct.NextPaymentAmount} on {financeProduct.NextPayment}",
                    Tooltip = new Tooltip
                    {
                        Title = "Repayment Method",
                        Message = MapNextPaymentTooltipMessage(financeProduct)
                    }
                });
            }

            policyItems.AddRange(MapCommonItems(financeProduct));
        }

        return policyItems;
    }

    private static List<PolicyItem> MapCommonItems(FinanceProductHolding financeProduct)
    {
        return new List<PolicyItem>
        {
            new PolicyItem
            {
                Label = "Current balance",
                Value = $"${financeProduct.CurrentBalance}@{financeProduct.InterestRate}% P.A. {financeProduct.InterestFrequency}"
            },
            new PolicyItem
            {
                Label = "Account Name",
                Value = financeProduct.AccountName
            },
            new PolicyItem
            {
                Label = "Loan Amount",
                Value = financeProduct.LoanAmount
            },
            new PolicyItem
            {
                Label = "Account no.",
                Value = financeProduct.AccountNumber
            }
        };
    }

    private static string MapNextPaymentTooltipMessage(FinanceProductHolding financeProduct)
    {
        var contactNumber = string.Empty;
        if (financeProduct.IsPropertyFinanceLoan)
        {
            contactNumber = "{RAC Finance|tel:6150 6249}";
        }
        else if (financeProduct.IsBusinessLoan || financeProduct.IsPersonalLoan)
        {
            contactNumber = "{RAC Finance|tel:1300 736 290}";
        }

        return $"The repayment amount is the amount that appears on your loan contract and " +
               $"does not include any outstanding payments. Please contact {contactNumber} for further details.";
    }

    private static List<PolicyItem> MapFinanceQuoteItems(FinanceProductHolding financeProduct)
    {
        return new List<PolicyItem>
        {
            new PolicyItem
            {
                Label = "Payments",
                Value = financeProduct.Payments
            },
            new PolicyItem
            {
                Label = "Quote Amount",
                Value = financeProduct.QuoteAmount
            },
            new PolicyItem
            {
                Label = "Expires",
                Value = financeProduct.ExpiryDate
            },
            new PolicyItem
            {
                Label = "Name",
                Value = financeProduct.AccountName
            }
        };
    }

    private static List<PolicyItem> MapSecureInvestmentItems(FinanceProductHolding financeProduct)
    {
        return new List<PolicyItem>
        {
            new PolicyItem
            {
                Label = "Current balance",
                Value = $"${financeProduct.CurrentBalance}@{financeProduct.InterestRate}% P.A. {financeProduct.InterestFrequency}"
            },
            new PolicyItem
            {
                Label = "Account name",
                Value = financeProduct.AccountName
            },
            new PolicyItem
            {
                Label = "Matures",
                Value = financeProduct.ExpiryDate
            },
            new PolicyItem
            {
                Label = "Account no.",
                Value = financeProduct.AccountNumber
            }
        };
    }

    private static List<Action> MapActions(FinanceProductHolding financeProduct)
    {
        var mappedActions = new List<Action>();
        if (financeProduct.IsFinanceQuote)
        {
            mappedActions.Add(new Action
            {
                Label = "Apply now",
                Type = "primary",
                Link = $"/products/finance/apply?quoteId={financeProduct.QuoteId}",
                Analytics = new Analytics
                {
                    Description = $"{financeProduct.Subtitle} {financeProduct.Title} - {financeProduct.QuoteType}"
                }
            });
        }
        else
        {
            mappedActions.Add(new Action
            {
                Label = "View Account",
                Type = "secondary",
                Link = $"https://financeonline.rac.com.au",
                Analytics = MapAnalytics(financeProduct)
            });
        }

        return mappedActions;
    }

    private static Analytics MapAnalytics(FinanceProductHolding financeProduct) => new()
    {
        Description = financeProduct.IsPropertyFinanceLoan ?
                        financeProduct.Title :
                        $"{financeProduct.Title} - {financeProduct.Subtitle}"
    };
}
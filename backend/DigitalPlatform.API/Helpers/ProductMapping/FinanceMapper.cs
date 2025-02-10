using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using DigitalPlatform.API.Models.Products.AnnuityProducts;
using MappedAction = DigitalPlatform.API.Models.Data.Products.PolicyDetails.Action;

namespace DigitalPlatform.API.Helpers.ProductMapping;

public class FinanceMapper(ILogger<FinanceMapper> logger) : IProductMapper
{
    private readonly ILogger<FinanceMapper> _logger = logger;

    public string Type => "Finance";

    public PolicyDetail? Map(AnnuityProduct product)
    {
        if (!product.BusinessType.Equals(Type))
        {
            _logger.LogError($"Not supported product type {product.BusinessType}");
            return null;
        }

        if (product is not FinanceProductHolding financeProduct)
        {
            _logger.LogError($"Unexpected product type {product.GetType().Name}");
            return null;
        }

        var policyDetails = new PolicyDetail
        {
            Type = financeProduct.Type,
            Title = MapTitle(financeProduct),
            Subtitle = MapSubtitle(financeProduct),
            PolicyItems = MapPolicyItems(financeProduct),
            Actions = MapActions(financeProduct),
        };

        return policyDetails;
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
        var policyItems = new List<PolicyItem>();
        var currentBalance = new PolicyItem
        {
            Label = "Current balance",
            Value = $"${financeProduct.CurrentBalance}@{financeProduct.InterestRate}% P.A. {financeProduct.InterestFrequency}"
        };
        policyItems.Add(currentBalance);

        var accountName = new PolicyItem
        {
            Label = "Account Name",
            Value = financeProduct.AccountName
        };
        policyItems.Add(accountName);

        var loadAmount = new PolicyItem
        {
            Label = "Loan Amount",
            Value = financeProduct.LoanAmount
        };
        policyItems.Add(loadAmount);

        var accountNumber = new PolicyItem
        {
            Label = "Account no.",
            Value = financeProduct.AccountNumber
        };
        policyItems.Add(accountNumber);

        return policyItems;
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
        var policyItems = new List<PolicyItem>();
        var payments = new PolicyItem
        {
            Label = "Payments",
            Value = financeProduct.Payments
        };
        policyItems.Add(payments);

        var quoteAmount = new PolicyItem
        {
            Label = "Quote Amount",
            Value = financeProduct.QuoteAmount
        };
        policyItems.Add(quoteAmount);

        var expiryDate = new PolicyItem
        {
            Label = "Expires",
            Value = financeProduct.ExpiryDate
        };
        policyItems.Add(expiryDate);

        var accountName = new PolicyItem
        {
            Label = "Name",
            Value = financeProduct.AccountName
        };
        policyItems.Add(accountName);

        return policyItems;
    }

    private static List<PolicyItem> MapSecureInvestmentItems(FinanceProductHolding financeProduct)
    {
        var policyItems = new List<PolicyItem>();
        var currentBalance = new PolicyItem
        {
            Label = "Current balance",
            Value = $"${financeProduct.CurrentBalance}@{financeProduct.InterestRate}% P.A. {financeProduct.InterestFrequency}"
        };
        policyItems.Add(currentBalance);

        var accountName = new PolicyItem
        {
            Label = "Account name",
            Value = financeProduct.AccountName
        };
        policyItems.Add(accountName);

        var matureDate = new PolicyItem
        {
            Label = "Matures",
            Value = financeProduct.ExpiryDate
        };
        policyItems.Add(matureDate);

        var accountNumber = new PolicyItem
        {
            Label = "Account no.",
            Value = financeProduct.AccountNumber
        };
        policyItems.Add(accountNumber);

        return policyItems;
    }

    private static List<MappedAction> MapActions(FinanceProductHolding financeProduct)
    {
        var mappedActions = new List<MappedAction>();
        if (financeProduct.IsFinanceQuote)
        {
            mappedActions.Add(new MappedAction
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
            mappedActions.Add(new MappedAction
            {
                Label = "View Account",
                Type = "secondary",
                Link = $"https://financeonline.rac.com.au",
                Analytics = MapAnalytics(financeProduct)
            });
        }

        return mappedActions;
    }

    private static Analytics MapAnalytics(FinanceProductHolding financeProduct)
    {
        if (financeProduct.IsPropertyFinanceLoan)
        {
            return new Analytics
            {
                Description = financeProduct.Title
            };
        }

        return new Analytics
        {
            Description = $"{financeProduct.Title} - {financeProduct.Subtitle}"
        };
    }

}
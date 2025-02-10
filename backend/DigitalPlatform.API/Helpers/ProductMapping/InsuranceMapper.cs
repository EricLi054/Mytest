using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using DigitalPlatform.API.Models.Products.AnnuityProducts;
using MappedAction = DigitalPlatform.API.Models.Data.Products.PolicyDetails.Action;

namespace DigitalPlatform.API.Helpers.ProductMapping;

public class InsuranceMapper(ILogger<InsuranceMapper> logger) : IProductMapper
{
    private readonly ILogger<InsuranceMapper> _logger = logger;

    public string Type => "Insurance";

    private const string InsuranceNumber = "{13 17 03|tel:13 17 03}";

    public PolicyDetail? Map(AnnuityProduct product)
    {
        if (!product.BusinessType.Equals("Insurance"))
        {
            _logger.LogError($"Not supported product type {product.BusinessType}");
            return null;
        }

        if (product is not InsuranceProductHolding insuranceProduct)
        {
            _logger.LogError($"Unexpected product type {product.GetType().Name}");
            return null;
        }

        var policyDetail = new PolicyDetail
        {
            Type = insuranceProduct.Type,
            Title = insuranceProduct.Title,
            Subtitle = insuranceProduct.Asset,
            SubtitleSecondary = insuranceProduct.AssetDescription,
            RegistrationNumber = insuranceProduct.RegistrationNumber,
            PolicyItems = MapPolicyItems(insuranceProduct),
            Alerts = MapAlerts(insuranceProduct),
            Actions = MapActions(insuranceProduct),
        };

        return policyDetail;
    }

    private static List<PolicyItem> MapPolicyItems(InsuranceProductHolding insuranceProduct)
    {
        var policyItems = new List<PolicyItem>();
        if (!string.IsNullOrEmpty(insuranceProduct.NextPayment))
        {
            var nextPayment = new PolicyItem
            {
                Label = "Next payment",
                Value = insuranceProduct.NextPayment
            };
            policyItems.Add(nextPayment);

            if (!string.IsNullOrEmpty(insuranceProduct.PaymentMethodType))
            {
                nextPayment.PaymentMethod = new PaymentMethod
                {
                    Title = "Payment method",
                    Type = insuranceProduct.PaymentMethodType,
                    Bsb = insuranceProduct.BSB,
                    AccountNumber = insuranceProduct.AccountNumber,
                    CardNumber = insuranceProduct.CardNumber,
                    CardExpiry = insuranceProduct.CardExpiry
                };
            }
        }

        if (!string.IsNullOrEmpty(insuranceProduct.NextPaymentAmount))
        {
            policyItems.Add(new PolicyItem
            {
                Label = "Amount",
                Value = insuranceProduct.NextPaymentAmount
            });
        }

        policyItems.Add(new PolicyItem
        {
            Label = "Policy no.",
            Value = insuranceProduct.PolicyNumber
        });

        policyItems.Add(new PolicyItem
        {
            Label = "Cover",
            Value = insuranceProduct.Subtitle
        });

        return policyItems;
    }

    private static List<Alert> MapAlerts(InsuranceProductHolding insuranceProduct)
    {
        var alerts = new List<Alert>();
        if (insuranceProduct.HasClaimsInProgress)
        {
            alerts.Add(new Alert
            {
                Severity = "info",
                Message = $"You have claims in progress. For past claims, please call us on {InsuranceNumber}"
            });
        }

        return alerts;
    }

    private static List<MappedAction> MapActions(InsuranceProductHolding insuranceProduct)
    {
        var mappedActions = new List<MappedAction>();
        foreach (var action in insuranceProduct.Actions)
        {
            var mappedAction = new MappedAction
            {
                Label = action.Label,
                Analytics = new Analytics
                {
                    Description = $"{action.Label} - {insuranceProduct.Title}"
                }
            };
            mappedActions.Add(mappedAction);

            if (!string.IsNullOrEmpty(action.Colour))
            {
                mappedAction.Type = action.Colour;
            }
            if (!string.IsNullOrEmpty(action.Link))
            {
                mappedAction.Link = action.Link;
            }

            if (action.SubActions == null) continue;

            foreach (var subAction in action.SubActions)
            {
                var mappedSubAction = new SubAction
                {
                    Label = subAction.Label,
                    Analytics = new Analytics
                    {
                        Description = $"{subAction.Label} - {insuranceProduct.Title}"
                    }
                };
                mappedAction.SubActions.Add(mappedSubAction);

                if (!string.IsNullOrEmpty(subAction.Label))
                {
                    mappedSubAction.SubLabel = subAction.SubLabel;
                }
                if (!string.IsNullOrEmpty(subAction.Link))
                {
                    mappedSubAction.Link = subAction.Link;
                }
            }
        }

        return mappedActions;
    }
}

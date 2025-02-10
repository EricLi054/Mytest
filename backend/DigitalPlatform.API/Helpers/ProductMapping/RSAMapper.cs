using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using DigitalPlatform.API.Models.Products.AnnuityProducts;
using MappedBundledProduct = DigitalPlatform.API.Models.Data.Products.PolicyDetails.BundledProduct;
using MappedAction = DigitalPlatform.API.Models.Data.Products.PolicyDetails.Action;
using DigitalPlatform.API.Models;

namespace DigitalPlatform.API.Helpers.ProductMapping;

public class RSAMapper(ILogger<RSAMapper> logger) : IProductMapper
{
    private readonly ILogger<RSAMapper> _logger = logger;

    public string Type => "RSA";

    public PolicyDetail? Map(AnnuityProduct product)
    {
        if (!product.BusinessType.Equals("RSA"))
        {
            _logger.LogError($"Not supported product type {product.BusinessType}");
            return null;
        }

        if (product is not RoadsideProductHolding roadsideProduct)
        {
            _logger.LogError($"Unexpected product type {product.GetType().Name}");
            return null;
        }

        var roadsidePolicy = new PolicyDetail
        {
            Type = roadsideProduct.Type,
            Title = roadsideProduct.PolicyCardTitle,
            Subtitle = MapSubtitle(roadsideProduct.Asset),
            RegistrationNumber = roadsideProduct.RegistrationNumber,
            PolicyItems = MapPolicyItems(roadsideProduct),
            Actions = MapActions(roadsideProduct),
            Alerts = MapAlerts(roadsideProduct)
        };

        return roadsidePolicy;
    }

    private static string MapSubtitle(Vehicle asset)
    {
        return asset == null ? string.Empty : $"{asset.Year} {asset.Make} {asset.Model}";
    }


    private static List<PolicyItem> MapPolicyItems(RoadsideProductHolding roadsideProduct)
    {
        var policyItems = new List<PolicyItem>();
        if (!string.IsNullOrEmpty(roadsideProduct.NextPayment))
        {
            var nextPayment = new PolicyItem
            {
                Label = "Next payment",
                Value = $"{roadsideProduct.NextPayment} from ",
                PaymentMethod = new PaymentMethod
                {
                    Title = "Update method",
                    Type = roadsideProduct.PaymentMethodType,
                    Bsb = roadsideProduct.BSB,
                    AccountNumber = roadsideProduct.AccountNumber,
                    CardNumber = roadsideProduct.CardNumber,
                    CardExpiry = roadsideProduct.CardExpiry,
                    LinkText = "Change direct debit payment method",
                    Link = $"/myrac/change-direct-debit?phhid={roadsideProduct.HeaderId}"
                },
            };
            var amount = new PolicyItem
            {
                Label = "Amount",
                Value = MapProductAmount(roadsideProduct),
            };
            if (roadsideProduct.ProductFlags.IsBundled)
            {
                // Create BundledAmount with label, title, message, and bundled products
                amount.BundledAmount = new BundledAmount
                {
                    Label = "Bundled payment",
                    Title = "Bundled payment",
                    Message = $"The payments for the following products are bundled into {roadsideProduct.PaymentFrequency} payments of {roadsideProduct.NextPaymentAmount}:",
                    BundledProducts = MapBundledProductAmount(roadsideProduct).ToList()
                };
            }
            else
            {
                // Create tooltip and payment frequency
                amount.Tooltip = MapProductTooltip();
                amount.PaymentFrequency = MapProductPaymentFrequency(roadsideProduct);
            }

            policyItems.Add(nextPayment);
            policyItems.Add(amount);
        }
        else if (roadsideProduct.ShowPayNow && roadsideProduct.ProductFlags.IsNotBundledOrFirstInBundle)
        {
            policyItems.Add(new PolicyItem
            {
                Label = "Bpay",
                Value = $"Biller code: 337097   Ref: {roadsideProduct.UPN}"
            });

            var payNowAmount = new PolicyItem
            {
                Label = "Amount",
                Value = $"${roadsideProduct.TotalDueAmount}"
            };
            if (roadsideProduct.ProductFlags.IsBundled)
            {
                payNowAmount.BundledAmount = new BundledAmount
                {
                    Label = "Bundled payment",
                    Title = "Bundled payment",
                    Message = $"The payments for the following products are bundled together in a payment of {roadsideProduct.TotalDueAmount}:",
                    BundledProducts = MapBundledProductAmount(roadsideProduct).ToList()
                };
            }

            policyItems.Add(payNowAmount);
        }

        policyItems.Add(new PolicyItem
        {
            Label = "Expires",
            Value = $"{roadsideProduct.ExpiryDate}"
        });

        if (!roadsideProduct.Type.Equals("REWARDS"))
        {
            policyItems.Add(new PolicyItem
            {
                Label = "Cover",
                Value = $"{roadsideProduct.PolicyCardCoverLevel}"
            });
        }

        return policyItems;
    }

    private static IEnumerable<MappedBundledProduct> MapBundledProductAmount(RoadsideProductHolding roadsideProduct)
    {
        foreach (var bundledProduct in roadsideProduct.BundledProducts)
        {
            var asset = bundledProduct.Asset;
            yield return new MappedBundledProduct
            {
                ProductName = bundledProduct.ProductName,
                Asset = $"{asset.Year} {asset.Make} {asset.Model} {bundledProduct.RegistrationNumber}"
            };
        }
    }


    private static List<MappedAction> MapActions(RoadsideProductHolding roadsideProduct)
    {
        var actions = new List<MappedAction>();
        if (roadsideProduct.Actions == null)
        {
            return actions;
        }

        foreach (var action in roadsideProduct.Actions)
        {
            var mappedAction = new MappedAction
            {
                Label = action.Label,
                Analytics = new Analytics
                {
                    Description = $"{action.Label} - {roadsideProduct.PolicyCardTitle}"
                }
            };

            actions.Add(mappedAction);

            if (action.Colour != null)
            {
                mappedAction.Type = action.Colour;
            }
            if (action.Link != null)
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
                        Description = $"{subAction.Label} - {roadsideProduct.PolicyCardTitle}"
                    }
                };

                if (subAction.SubLabel != null)
                {
                    mappedSubAction.SubLabel = subAction.SubLabel;
                }
                if (subAction.Link != null)
                {
                    mappedSubAction.Link = subAction.Link;
                }

                mappedAction.SubActions.Add(mappedSubAction);
            }
        }

        return actions;
    }

    private static List<Alert> MapAlerts(RoadsideProductHolding roadsideProduct)
    {
        var alerts = new List<Alert>();
        if (!roadsideProduct.Type.Equals("REWARDS"))
        {
            var rsaInfoAlert = new Alert
            {
                Severity = "info",
                Message = "To update your vehicle details, call us on {13 17 03|tel:13 17 03} or visit a {member service centre|/about-rac/contact-us/find-a-branch}"
            };
            alerts.Add(rsaInfoAlert);
        };

        return alerts;

    }

    private static string MapProductAmount(RoadsideProductHolding roadsideProduct)
    {
        return roadsideProduct.ProductFlags.IsBundled ?
            $"${roadsideProduct.NextPaymentAmount} / {roadsideProduct.PaymentFrequency}" :
            $"${roadsideProduct.NextPaymentAmount}";
    }

    private static Tooltip? MapProductTooltip()
    {
        return new Tooltip
        {
            Title = "Administration fee",
            Message = "Amount includes 6% administration fee."
        };
    }

    private static PaymentFrequency? MapProductPaymentFrequency(RoadsideProductHolding roadsideProduct)
    {
        return new PaymentFrequency
        {
            Title = "Update frequency",
            PreMessage = "paying",
            Frequency = roadsideProduct.PaymentFrequency,
            Message = $"Your nominated {roadsideProduct.PaymentMethodType} is debited {roadsideProduct.PaymentFrequency}",
            LinkText = "Change direct debit payment frequency",
            Link = $"/myrac/change-frequency?phhid={roadsideProduct.HeaderId}",
        };
    }
}
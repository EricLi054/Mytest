using Membership.Types.PolicyDetails;
using Membership.Types.Products.AnnuityProducts;
using BundledProduct = Membership.Types.PolicyDetails.BundledProduct;
using Action = Membership.Types.PolicyDetails.Action;
using Membership.Constants;

namespace Membership.PolicyMappers;

/*
    TODO: These mappers will be refactored into the UI layer
*/
public class FinOpsMapper(ILogger<FinOpsMapper> logger) : IPolicyMapper
{
    public string Type => "RSA";

    public PolicyDetail? Map(AnnuityProduct product)
    {
        if (!product.BusinessType.Equals(Type))
        {
            logger.LogError("Not supported product type {BusinessType}", product.BusinessType);
            return null;
        }

        if (product is not RoadsideProductHolding roadsideProduct)
        {
            logger.LogError("Unexpected product type {TypeName}", product.GetType().Name);
            return null;
        }

        return new PolicyDetail
        {
            Type = roadsideProduct.Type,
            Title = roadsideProduct.PolicyCardTitle,
            Subtitle = MapSubtitle(roadsideProduct.Asset),
            RegistrationNumber = roadsideProduct.RegistrationNumber,
            PolicyItems = MapPolicyItems(roadsideProduct),
            Actions = MapActions(roadsideProduct),
            Alerts = MapAlerts(roadsideProduct)
        };
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

        if (!roadsideProduct.Type.Equals(FinOpsConstants.ProductCodes.Rewards))
        {
            policyItems.Add(new PolicyItem
            {
                Label = "Cover",
                Value = $"{roadsideProduct.PolicyCardCoverLevel}"
            });
        }

        return policyItems;
    }

    private static IEnumerable<BundledProduct> MapBundledProductAmount(RoadsideProductHolding roadsideProduct)
    {
        foreach (var bundledProduct in roadsideProduct.BundledProducts)
        {
            var asset = bundledProduct.Asset;
            yield return new BundledProduct
            {
                ProductName = bundledProduct.ProductName,
                Asset = $"{asset.Year} {asset.Make} {asset.Model} {bundledProduct.RegistrationNumber}"
            };
        }
    }


    private static List<Action> MapActions(RoadsideProductHolding roadsideProduct)
    {
        if (roadsideProduct.Actions == null)
        {
            return [];
        }

        var actions = new List<Action>();

        foreach (var action in roadsideProduct.Actions)
        {
            var mappedAction = new Action
            {
                Label = action.Label,
                Analytics = new Analytics
                {
                    Description = $"{action.Label} - {roadsideProduct.PolicyCardTitle}"
                },
                Type = action.Colour,
                Link = action.Link
            };

            actions.Add(mappedAction);

            if (action.SubActions == null)
            {
                continue;
            }

            foreach (var subAction in action.SubActions)
            {
                var mappedSubAction = new SubAction
                {
                    Label = subAction.Label,
                    Analytics = new Analytics
                    {
                        Description = $"{subAction.Label} - {roadsideProduct.PolicyCardTitle}"
                    },
                    SubLabel = subAction.SubLabel,
                    Link = subAction.Link
                };

                mappedAction.SubActions.Add(mappedSubAction);
            }
        }

        return actions;
    }

    private static List<Alert> MapAlerts(RoadsideProductHolding roadsideProduct)
    {
        var alerts = new List<Alert>();

        // Only removing alert from vehicles that have update enabled
        if (!roadsideProduct.ProductFlags.CanUpdateVehicle && !roadsideProduct.Type.Equals(FinOpsConstants.ProductCodes.Rewards))
        {
            var rsaInfoAlert = new Alert
            {
                Severity = "info",
                Message = "To update your vehicle details, call us on {13 17 03|tel:13 17 03} or visit a {member service centre|/about-rac/contact-us/find-a-branch}"
            };
            alerts.Add(rsaInfoAlert);
        }

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
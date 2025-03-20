using Membership.Types.FinOps;
using Shared.Extensions;

namespace Membership.Types.Products.AnnuityProducts;

/*
    TODO: Most of the mapping logic in this file will be moved into the UI layer
*/
public class Vehicle
{
    public string Year { get; set; } = string.Empty;
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
}

public class BundledProduct
{
    public string ProductName { get; set; } = string.Empty;
    public Vehicle Asset { get; set; } = default!;
    public string RegistrationNumber { get; set; } = string.Empty;
}

public class RoadsideProductHolding : AnnuityProduct
{
    public string HeaderId { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public Vehicle Asset { get; set; } = default!;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string UPN { get; set; } = string.Empty;
    public string ExpiryDate { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    public string Alert { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string RenewalPaymentMode { get; set; } = string.Empty;
    public string ViewMembershipOrCoverLink { get; set; } = string.Empty;
    public FinOpsProductFlags ProductFlags { get; set; } = new();
    public List<BundledProduct> BundledProducts { get; set; } = new();
    public string NextPayment { get; set; } = string.Empty;
    public string NextPaymentAmount { get; set; } = string.Empty;
    public string PaymentFrequency { get; set; } = string.Empty;
    public string PaymentMethodType { get; set; } = string.Empty;
    public string BSB { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string CardNumber { get; set; } = string.Empty;
    public string CardExpiry { get; set; } = string.Empty;
    public string TotalDueAmount { get; set; } = string.Empty;

    public string PolicyCardTitle => Title.ToLowerInvariant() switch
    {
        string rewards when rewards.Contains("rewards") => "Rewards",
        string councillor when councillor.Contains("councillor") => "Councillor",
        _ => "Roadside Assistance"
    };

    public string PolicyCardCoverLevel => Title switch
    {
        string title when string.IsNullOrEmpty(title) => string.Empty,
        _ => Title.Replace("Roadside Assistance", string.Empty).Trim()
    };

    public List<CTALink>? Actions
    {
        get
        {
            List<CTALink> ctaLinks = new List<CTALink>();
            List<CTALink> subActions = new List<CTALink>();

            if (ProductFlags.ShowPayNow && ProductFlags.IsNotBundledOrFirstInBundle)
            {
                ctaLinks.Add(new CTALink
                {
                    Label = "Pay Now",
                    Link = $"/membership-benefits/pay-a-bill?PaymentNumber={UPN}",
                    IsDefaultAction = true,
                    Colour = "primary"
                });
            }
            ((ProductFlags.ShowPayNow && ProductFlags.IsRewards) ? subActions : ctaLinks).Add(new CTALink
            {
                Label = ProductFlags.IsRewards ? "View membership" : "View cover",
                Link = ViewMembershipOrCoverLink,
                IsDefaultAction = true,
                Colour = (ProductFlags.ShowPayNow && ProductFlags.IsNotBundledOrFirstInBundle && !ProductFlags.CanUpdateVehicle) ? "" : "secondary"
            });
            if (ProductFlags.IsRewards)
            {
                (ProductFlags.ShowPayNow ? subActions : ctaLinks).Add(new CTALink
                {
                    Label = "Your savings",
                    Link = "/myrac/savings"
                });
            }
            if (ProductFlags.IsDirectDebit && ProductFlags.DirectDebitAllowed)
            {
                subActions.Add(new CTALink
                {
                    Label = "Change direct debit",
                    Link = $"/myrac/change-direct-debit?phhid={HeaderId}"
                });
                subActions.Add(new CTALink
                {
                    Label = "Change direct debit frequency",
                    Link = $"/myrac/change-frequency?phhid={HeaderId}"
                });
            }
            if (!ProductFlags.IsDirectDebit && ProductFlags.DirectDebitAllowed && !ProductFlags.ShowPayNow)
            {
                subActions.Add(new CTALink
                {
                    Label = "Setup direct debit",
                    Link = $"/myrac/set-up-direct-debit?phhid={HeaderId}"
                });
            }
            if (ProductFlags.CanUpdateVehicle)
            {
                subActions.Add(new CTALink
                {
                    Label = "Update your vehicle",
                    Link = $"/motoring/roadside-assistance/update-your-vehicle?productHoldingHeaderId={HeaderId}&productHoldingLineId={Id}"
                });
            }
            if (ProductFlags.IsUpgradeDowngradeEligible && !ProductFlags.ShowPayNow)
            {
                subActions.Add(new CTALink
                {
                    Label = "Change cover level",
                    Link = $"/myrac/change-rsa-cover-level?referenceNo={HeaderId}&regoNo={RegistrationNumber}&productHoldingId={Id}&productHoldingVersion={Version}"
                });
            }

            if (subActions.Count > 0)
            {
                ctaLinks.Add(new CTALink
                {
                    Label = "Manage",
                    SubActions = subActions
                });
            }

            return ctaLinks;
        }
    }

    public RoadsideProductHolding(FinOpsProductFlags productFlags)
    {
        ProductFlags = productFlags;
    }

    public RoadsideProductHolding(ProductHolding productHoldingHeader, ProductHoldingLine productHoldingLine, FinOpsProductFlags productFlags)
    {
        ProductFlags = productFlags;
        ProductId = productHoldingLine.ProductId;
        Id = productHoldingLine.ProductHoldingId;
        base.BusinessType = Products.BusinessType.RSA.ToString();
        HeaderId = productHoldingHeader.ProductHoldingHeaderId;
        Title = productHoldingLine.ProductName;
        Subtitle = PolicyCardTitle;
        Version = productHoldingLine.ProductHoldingVersion.ToString();
        Asset = productHoldingLine.VehicleDetail != null ? new Vehicle { Year = productHoldingLine.VehicleDetail.Year, Make = productHoldingLine.VehicleDetail.Make, Model = productHoldingLine.VehicleDetail.Model } : null!;
        RegistrationNumber = productHoldingLine.VehicleDetail?.RegistrationNumber?.ToUpper() ?? "";
        ExpiryDate = productHoldingLine.EndDate.ToString("dd MMM yyyy");
        Type = ProductFlags.IsRewards ? "REWARDS" : "RSA";
        RenewalPaymentMode = productHoldingHeader.RenewalPaymentMode;
        ShowPayNow = productFlags.ShowPayNow;
        ViewMembershipOrCoverLink = productFlags.GetProductDetailsUrl(PolicyCardCoverLevel);
        TotalDueAmount = (productHoldingHeader.RenewalTotalRemainingAmount + productHoldingHeader.TotalDueAmount).ToString("0.00");
        UPN = productHoldingHeader.Upn;

        if (productFlags.IsBundled)
        {
            // Populates the list of products this product is bundled with
            foreach (var line in productHoldingHeader.ProductHoldingLines)
            {
                BundledProducts.Add(new BundledProduct
                {
                    ProductName = line.ProductName,
                    Asset = line.VehicleDetail != null ? new Vehicle { Year = line.VehicleDetail.Year, Make = line.VehicleDetail.Make, Model = line.VehicleDetail.Model } : null!,
                    RegistrationNumber = line.VehicleDetail?.RegistrationNumber?.ToUpper() ?? ""
                });
            }
        }

        // Only process the payment information if the member is on direct debit
        if (!string.IsNullOrEmpty(productHoldingHeader.PaymentMode) || !string.IsNullOrEmpty(productHoldingHeader.RenewalPaymentMode))
        {
            ProcessPaymentInformation(productHoldingHeader);
        }
    }

    private void ProcessPaymentInformation(ProductHolding productHoldingHeader)
    {
        var paymentDetail = productHoldingHeader.RenewalPaymentDetail ?? productHoldingHeader.PaymentDetail;

        if (paymentDetail == null)
        {
            return;
        }

        var paymentScheduleId = productHoldingHeader.RenewalPaymentDetail != null ? productHoldingHeader.RenewalPaymentScheduleId : productHoldingHeader.PaymentScheduleId;
        var paymentMode = productHoldingHeader.RenewalPaymentDetail != null ? productHoldingHeader.RenewalPaymentMode : productHoldingHeader.PaymentMode;
        var productHoldingPaymSched = productHoldingHeader.RenewalPaymentDetail != null ? productHoldingHeader.RenewalProductHoldingPaymSched.Any() ? productHoldingHeader.RenewalProductHoldingPaymSched : productHoldingHeader.ProductHoldingPaymSched : productHoldingHeader.ProductHoldingPaymSched;

        if (productHoldingPaymSched != null)
        {
            var nextPayableInstalment = productHoldingPaymSched.Where(x => x.RemainingAmount > 0)
                .OrderBy(x => x.DueDate)
                .FirstOrDefault();

            if (nextPayableInstalment != null && ProductFlags.IsNotBundledOrFirstInBundle)
            {
                NextPayment = nextPayableInstalment.DueDate.ToString("dd MMM yyyy");
                NextPaymentAmount = nextPayableInstalment.Amount.ToString("0.00");
                PaymentFrequency = paymentScheduleId.ToLower() == "yearly" ? "Annually" : paymentScheduleId;
                PaymentMethodType = paymentMode == "DDBA" ? "Bank Account" : "Card";
                BSB = paymentDetail.BankBsb.MaskString(3);
                AccountNumber = paymentDetail.BankAccountNum.MaskString(4);
                CardNumber = paymentDetail.CreditCardMaskedNumber;
                CardExpiry = !string.IsNullOrEmpty(paymentDetail?.CreditCardExpiryMonth) ? $"{paymentDetail?.CreditCardExpiryMonth}/{paymentDetail?.CreditCardExpiryYear}" : "";
                NextPaymentActionDate = nextPayableInstalment.DueDate;
            }
        }
    }
}

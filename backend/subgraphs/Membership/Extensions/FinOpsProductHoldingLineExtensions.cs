using Membership.Constants;
using Membership.Types.FinOps;
using Membership.Types.Products;
using Shared.Interfaces;
using static Membership.Constants.SharedConstants;

namespace Membership.Extensions;

public static class FinOpsProductHoldingLineExtensions
{
    private static bool ShowPayNow(ProductHolding productHeader, ProductHoldingLine productHoldingLine, bool isDirectDebit)
    {
        bool isWithinExpiryPeriod = DateTime.Now > productHoldingLine.EndDate.AddDays(FinOpsConstants.Products.ExpiryDateRange.DaysBeforeEndDate) &&
                                    DateTime.Now < productHoldingLine.EndDate.AddDays(FinOpsConstants.Products.ExpiryDateRange.DaysAfterEndDate);

        return FinOpsConstants.Products.AllowedToShowPayNow.Contains(productHoldingLine.ProductHoldingId) &&
                (isWithinExpiryPeriod || productHeader?.TotalDueAmount > 0) &&
                !isDirectDebit;
    }

    private static bool IsUpgradeDowngradeEligible(ProductHolding productHeader, ProductHoldingLine productHoldingLine)
    {
        return productHeader?.TotalDueAmount <= 0 &&
                FinOpsConstants.Products.AllowedForUpgradeDowngrade.Contains(productHoldingLine.ProductId) &&
                productHoldingLine.ProductChanges?.Any(x => x.CanChangeProductHolding) == true;
    }

    private static bool IsNotBundledOrFirstInBundle(IEnumerable<string>? distinctProductIds, ProductHoldingLine productHoldingLine, bool isBundle)
    {
        return !isBundle || (isBundle && distinctProductIds?.First() == productHoldingLine.ProductHoldingId?.Split('-')[0]);
    }

    private static async Task<bool> CanUpdateVehicleAsync(string productId, IFeatureService featureService)
    {
        var updateVehicleFlag = await featureService.IsFeatureEnabledAsync(FeatureFlags.Update_Vehicle);
        return updateVehicleFlag && FinOpsConstants.Products.AllowedForUpdateVehicle.Contains(productId);
    }

    public static async Task<FinOpsProductFlags> GenerateProductFlagsAsync(
        this ProductHoldingLine productHoldingLine,
        ProductHolding productHeader,
        IEnumerable<string>? distinctProductIds,
        IFeatureService featureService,
        bool isBundle)
    {

        bool isDirectDebit = productHeader!.RenewalPaymentMode.Contains("DD") || productHeader.PaymentMode.Contains("DD");

        return new FinOpsProductFlags()
        {
            ShowPayNow = ShowPayNow(productHeader!, productHoldingLine, isDirectDebit),
            IsRewards = FinOpsConstants.Products.Rewards.Contains(productHoldingLine.ProductId),
            IsUpgradeDowngradeEligible = IsUpgradeDowngradeEligible(productHeader!, productHoldingLine),
            IsDirectDebit = isDirectDebit,
            DirectDebitAllowed = FinOpsConstants.Products.AllowedForDirectDebit.Contains(productHoldingLine.ProductId),
            IsFordRoadside = FinOpsConstants.Products.FordRoadside.Contains(productHoldingLine.ProductId),
            IsFree2GoRoadside = FinOpsConstants.Products.Free2GoRoadside.Contains(productHoldingLine.ProductId),
            IsMitsubishiRoadside = FinOpsConstants.Products.MitsubishiRoadside.Contains(productHoldingLine.ProductId),
            IsSubaruRoadside = FinOpsConstants.Products.SubaruRoadside.Contains(productHoldingLine.ProductId),
            IsWheels2Go = FinOpsConstants.Products.Wheels2GoRoadside.Contains(productHoldingLine.ProductId),
            IsBundled = isBundle,
            IsNotBundledOrFirstInBundle = IsNotBundledOrFirstInBundle(distinctProductIds, productHoldingLine, isBundle),
            CanUpdateVehicle = await CanUpdateVehicleAsync(productHoldingLine.ProductId, featureService)
        };
    }
}
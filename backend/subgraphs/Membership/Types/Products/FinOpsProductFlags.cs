using Membership.Constants;

namespace Membership.Types.Products;

public class FinOpsProductFlags
{
    public bool ShowPayNow { get; set; }
    public bool IsRewards { get; set; }
    public bool IsUpgradeDowngradeEligible { get; set; }
    public bool IsDirectDebit { get; set; }
    public bool DirectDebitAllowed { get; set; }
    public bool IsFordRoadside { get; set; }
    public bool IsFree2GoRoadside { get; set; }
    public bool IsMitsubishiRoadside { get; set; }
    public bool IsSubaruRoadside { get; set; }
    public bool IsWheels2Go { get; set; }
    public bool IsBundled { get; set; }
    public bool IsNotBundledOrFirstInBundle { get; set; }
    public bool CanUpdateVehicle { get; set; }
    public string GetProductDetailsUrl(string productName)
    {
        return (IsFordRoadside, IsFree2GoRoadside, IsMitsubishiRoadside, IsSubaruRoadside, IsWheels2Go, IsRewards) switch
        {
            (true, _, _, _, _, _) => FinOpsConstants.ProductDetailsUrls.FordRoadside,
            (_, true, _, _, _, _) => FinOpsConstants.ProductDetailsUrls.Free2GoRoadside,
            (_, _, true, _, _, _) => FinOpsConstants.ProductDetailsUrls.MitsubishiRoadside,
            (_, _, _, true, _, _) => FinOpsConstants.ProductDetailsUrls.SubaruRoadside,
            (_, _, _, _, true, _) => FinOpsConstants.ProductDetailsUrls.Wheels2Go,
            (_, _, _, _, _, true) => FinOpsConstants.ProductDetailsUrls.Rewards,
            _ => $"/myrac/product-details?highlightedProduct={productName}"
        };
    }
}

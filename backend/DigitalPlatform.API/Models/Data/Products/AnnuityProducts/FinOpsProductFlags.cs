using DigitalPlatform.API.Descriptors;

namespace DigitalPlatform.API.Models.Products.AnnuityProducts;

public class FinOpsProductFlags
{
    public bool ShowPayNow { get; set; }
    public bool IsRewards { get; set; }
    public bool IsUpgradeDowngradeEligible { get; set; }
    public bool IsDirectDebit { get; set; }
    public bool DirectDebitAllowed { get; set; }
    public bool ShouldNeverShowViewCover { get; set; }
    public bool IsFordRoadside { get; set; }
    public bool IsFree2GoRoadside { get; set; }
    public bool IsMitsubishiRoadside { get; set; }
    public bool IsSubaruRoadside { get; set; }
    public bool IsWheels2Go { get; set; }
    public bool IsBundled { get; set; }
    public bool IsNotBundledOrFirstInBundle { get; set; }
    public string GetProductDetailsUrl(string productName)
    {
        return (IsFordRoadside, IsFree2GoRoadside, IsMitsubishiRoadside, IsSubaruRoadside, IsWheels2Go, IsRewards) switch
        {
            (true, _, _, _, _, _) => FinOpsProductDetailsUrls.FordRoadside,
            (_, true, _, _, _, _) => FinOpsProductDetailsUrls.Free2GoRoadside,
            (_, _, true, _, _, _) => FinOpsProductDetailsUrls.MitsubishiRoadside,
            (_, _, _, true, _, _) => FinOpsProductDetailsUrls.SubaruRoadside,
            (_, _, _, _, true, _) => FinOpsProductDetailsUrls.Wheels2Go,
            (_, _, _, _, _, true) => FinOpsProductDetailsUrls.Rewards,
            _ => $"/myrac/product-details?highlightedProduct={productName}"
        };
    }
}

namespace DigitalPlatform.API.Models.Products.AnnuityProducts;

public class FinOpsProducts
{
    public List<string> FordRoadside { get; set; } = [];
    public List<string> Free2GoRoadside { get; set; } = [];
    public List<string> MitsubishiRoadside { get; set; } = [];
    public List<string> AllowedForDirectDebit { get; set; } = [];
    public List<string> AllowedForUpgradeDowngrade { get; set; } = [];
    public List<string> AllowedToShowPayNow { get; set; } = [];
    public List<string> NotAllowedToShowViewCover { get; set; } = [];
    public List<string> Rewards { get; set; } = [];
    public List<string> SubaruRoadside { get; set; } = [];
    public List<string> Valid { get; set; } = [];
    public List<string> Wheels2GoRoadside { get; set; } = [];
    public ExpiryPeriodConfig? ExpiryDateRange { get; set; } 

    public class ExpiryPeriodConfig
    {
        public ExpiryPeriod? ExpiryPeriod { get; set; }
    }

    public class ExpiryPeriod
    {
        public int DaysBeforeEndDate { get; set; }
        public int DaysAfterEndDate { get; set; }
    }

}
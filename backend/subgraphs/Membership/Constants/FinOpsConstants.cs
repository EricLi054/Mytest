namespace Membership.Constants;

public static class FinOpsConstants
{
    public const string CompanyId = "E098";
    public const string Source = "Website";

    public static class Products
    {
        public static readonly List<string> FordRoadside =
        [
            ProductCodes.FordCMOStandard,
            ProductCodes.FordDSRStandard
        ];
        public static readonly List<string> Free2GoRoadside =
        [
            ProductCodes.Free2GoStandardRSA,
            ProductCodes.Free2GoClassicRSA,
            ProductCodes.Free2GoUltimateRSA,
            ProductCodes.Free2GoUltimatePlusRSA
        ];
        public static readonly List<string> MitsubishiRoadside =
        [
            ProductCodes.MitsubishiCMOStandard,
            ProductCodes.MitsubishiDSRStandard
        ];
        public static readonly List<string> AllowedForDirectDebit =
        [
            ProductCodes.StandardRSA,
            ProductCodes.ClassicRSA,
            ProductCodes.UltimateRSA,
            ProductCodes.UltimatePlusRSA,
            ProductCodes.Free2GoStandardRSA,
            ProductCodes.Free2GoClassicRSA,
            ProductCodes.Free2GoUltimateRSA,
            ProductCodes.Free2GoUltimatePlusRSA,
            ProductCodes.GoldLifeClassicRSA,
            ProductCodes.GoldLifeUltimateRSA,
            ProductCodes.GoldLifeUltimatePlusRSA,
            ProductCodes.HonoraryLifeStandardRSA,
            ProductCodes.HonoraryLifeClassicRSA,
            ProductCodes.HonoraryLifeStaffUltimateRSA,
            ProductCodes.Wheels2GoRSA,
        ];
        public static readonly List<string> AllowedForUpdateVehicle =
        [
            ProductCodes.StandardRSA,
            ProductCodes.ClassicRSA,
            ProductCodes.UltimateRSA,
            ProductCodes.UltimatePlusRSA,
            ProductCodes.StaffUltimateRSA,
            ProductCodes.CountryContractorUltimateRSA,
            ProductCodes.StIvesUltimateRSA,
            ProductCodes.HonoraryLifeStaffUltimateRSA,
            ProductCodes.HonoraryLifeStandardRSA,
            ProductCodes.HonoraryLifeClassicRSA,
            ProductCodes.GoldLifeStandardRSA,
            ProductCodes.GoldLifeClassicRSA,
            ProductCodes.GoldLifeUltimateRSA,
            ProductCodes.GoldLifeUltimatePlusRSA,
            ProductCodes.Free2GoStandardRSA,
            ProductCodes.Free2GoClassicRSA,
            ProductCodes.Free2GoUltimateRSA,
            ProductCodes.Free2GoUltimatePlusRSA
        ];
        public static readonly List<string> AllowedForUpgradeDowngrade =
        [
            ProductCodes.StandardRSA,
            ProductCodes.ClassicRSA,
            ProductCodes.UltimateRSA,
            ProductCodes.UltimatePlusRSA,
            ProductCodes.Free2GoStandardRSA,
            ProductCodes.Free2GoClassicRSA,
            ProductCodes.Free2GoUltimateRSA,
            ProductCodes.Free2GoUltimatePlusRSA,
            ProductCodes.GoldLifeStandardRSA,
            ProductCodes.GoldLifeClassicRSA,
            ProductCodes.GoldLifeUltimateRSA,
            ProductCodes.GoldLifeUltimatePlusRSA,
            ProductCodes.HonoraryLifeStandardRSA,
            ProductCodes.HonoraryLifeClassicRSA,
            ProductCodes.HonoraryLifeStaffUltimateRSA
        ];
        public static readonly List<string> AllowedToShowPayNow =
        [
            ProductCodes.Rewards,
            ProductCodes.StandardRSA,
            ProductCodes.ClassicRSA,
            ProductCodes.UltimateRSA,
            ProductCodes.UltimatePlusRSA,
            ProductCodes.Free2GoStandardRSA,
            ProductCodes.Free2GoClassicRSA,
            ProductCodes.Free2GoUltimateRSA,
            ProductCodes.Free2GoUltimatePlusRSA,
            ProductCodes.GoldLifeClassicRSA,
            ProductCodes.GoldLifeUltimateRSA,
            ProductCodes.GoldLifeUltimatePlusRSA,
            ProductCodes.HonoraryLifeClassicRSA,
            ProductCodes.HonoraryLifeStaffUltimateRSA
        ];
        public static readonly List<string> Rewards =
        [
            ProductCodes.Rewards,
            ProductCodes.GoldLifeRewards,
            ProductCodes.FordDSRNCORewards,
            ProductCodes.FordNCORewards,
            ProductCodes.Councillor
        ];
        public static readonly List<string> SubaruRoadside =
        [
            ProductCodes.SubaruCMOStandard,
            ProductCodes.SubaruMultiYearCMOStandard
        ];
        public static readonly List<string> Valid =
        [
            ProductCodes.Councillor,
            ProductCodes.Rewards,
            ProductCodes.CountryContractorUltimateRSA,
            ProductCodes.ClassicRSA,
            ProductCodes.StandardRSA,
            ProductCodes.UltimateRSA,
            ProductCodes.UltimatePlusRSA,
            ProductCodes.Free2GoStandardRSA,
            ProductCodes.Free2GoClassicRSA,
            ProductCodes.Free2GoUltimateRSA,
            ProductCodes.Free2GoUltimatePlusRSA,
            ProductCodes.FordNCORewards,
            ProductCodes.FordDSRNCORewards,
            ProductCodes.FordCMOStandard,
            ProductCodes.FordDSRStandard,
            ProductCodes.GoldLifeRewards,
            ProductCodes.GoldLifeStandardRSA,
            ProductCodes.GoldLifeClassicRSA,
            ProductCodes.GoldLifeUltimateRSA,
            ProductCodes.GoldLifeUltimatePlusRSA,
            ProductCodes.HonoraryLifeClassicRSA,
            ProductCodes.HonoraryLifeStandardRSA,
            ProductCodes.HonoraryLifeStaffUltimateRSA,
            ProductCodes.MitsubishiCMOStandard,
            ProductCodes.MitsubishiDSRStandard,
            ProductCodes.FairUseFeeRoadside,
            ProductCodes.JoinOnRoadFeeRoadside,
            ProductCodes.SubaruCMOStandard,
            ProductCodes.SubaruMultiYearCMOStandard,
            ProductCodes.StIvesUltimateRSA,
            ProductCodes.StaffUltimateRSA,
        ];
        public static readonly List<string> Wheels2GoRoadside =
        [
            ProductCodes.Wheels2GoRSA,
            ProductCodes.GoldLifeWheels2GoRSA
        ];
        public static readonly ExpiryPeriod ExpiryDateRange = new()
        {
            DaysBeforeEndDate = -35,
            DaysAfterEndDate = 90
        };

        public class ExpiryPeriod
        {
            public int DaysBeforeEndDate { get; set; }
            public int DaysAfterEndDate { get; set; }
        }

    }

    public static class ProductDetailsUrls
    {
        public static readonly string FordRoadside = "/myrac/product-details/ford";
        public static readonly string Free2GoRoadside = "/myrac/product-details/free2go";
        public static readonly string MitsubishiRoadside = "/myrac/product-details/mitsubishi";
        public static readonly string SubaruRoadside = "/myrac/product-details/subaru";
        public static readonly string Wheels2Go = "/car-motoring/roadside-assistance/wheels2go";
        public static readonly string Rewards = "/membership-benefits/become-a-member/rewards-membership";
    }

    public static class ProductCodes
    {
        public const string ClassicRSA = "CLAS";
        public const string Councillor = "COUNC";
        public const string CountryContractorUltimateRSA = "CCULT";
        public const string FairUseFeeRoadside = "RSAFAIR";
        public const string FordCMOStandard = "FSTDCMO";
        public const string FordDSRStandard = "FSTDDSR";
        public const string FordDSRNCORewards = "FREWDSR";
        public const string FordNCORewards = "FORRNCO";
        public const string Free2GoClassicRSA = "F2GCLAS";
        public const string Free2GoStandardRSA = "F2GSTD";
        public const string Free2GoUltimateRSA = "F2GULT";
        public const string Free2GoUltimatePlusRSA = "F2GULTP";
        public const string GoldLifeClassicRSA = "GLCLAS";
        public const string GoldLifeRewards = "GLRWDS";
        public const string GoldLifeStandardRSA = "GLSTD";
        public const string GoldLifeUltimateRSA = "GLULTI";
        public const string GoldLifeUltimatePlusRSA = "GLULPL";
        public const string GoldLifeWheels2GoRSA = "GLW2G";
        public const string HonoraryLifeClassicRSA = "HLCL";
        public const string HonoraryLifeStandardRSA = "HLSTD";
        public const string HonoraryLifeStaffUltimateRSA = "HONSTULT";
        public const string JoinOnRoadFeeRoadside = "RSAJOR";
        public const string MitsubishiCMOStandard = "MSTDCMO";
        public const string MitsubishiDSRStandard = "MSTDDSR";
        public const string Rewards = "REWARDS";
        public const string StaffUltimateRSA = "STULT";
        public const string StandardRSA = "STD";
        public const string StIvesUltimateRSA = "STIVES";
        public const string SubaruCMOStandard = "SSTDCMO";
        public const string SubaruMultiYearCMOStandard = "SSTDMY";
        public const string UltimateRSA = "ULTI";
        public const string UltimatePlusRSA = "ULPL";
        public const string Wheels2GoRSA = "W2G";
    }
}
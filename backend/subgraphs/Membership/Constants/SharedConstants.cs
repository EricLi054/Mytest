namespace Membership.Constants;
public static class SharedConstants
{
    public static class FeatureFlags
    {
        public static readonly string Update_Vehicle = "myRAC_Feature_Update_Vehicle";
        public static readonly string UHYP_Pet = "myRAC_Feature_UHYP_Pet";
        public static readonly string UHYP_Boat = "myRAC_Feature_UHYP_Boat";
        public static readonly string UHYP_Mobility = "myRAC_Feature_UHYP_Mobility";
        public static readonly string OTP_Bypass = "myRAC_Feature_BypassOtp";
    }

    public static class CustomErrorCodes
    {
        public static readonly string PartialProductResultsError = "PARTIAL_PRODUCT_RESULTS_ERROR";
    }
}

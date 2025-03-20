import { getFeatureToggles } from "#graphql/featureToggles";

import MessageBanner from "./MessageBanner";

const FEATURE_TOGGLE_KEY = "BypassOtp";

const OTPBypassBanner = async () => {
  const toggles = await getFeatureToggles();
  if (toggles.find((ft) => ft.key === FEATURE_TOGGLE_KEY)?.value) {
    return <MessageBanner text="OTP Bypass Enabled - Verification Code: 000000" />;
  } else {
    return null;
  }
};

export default OTPBypassBanner;

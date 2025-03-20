import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { getFeatureToggles } from "#graphql/featureToggles";
import { describe, expect, it, vi } from "vitest";

import OTPBypassBanner from ".";

vi.mock("#graphql/featureToggles", () => ({
  getFeatureToggles: vi.fn(),
}));

describe("OTPBypassBanner", () => {
  it("should render OTP bypass banner when feature toggle is enabled", async () => {
    (getFeatureToggles as Mock).mockResolvedValue([{ key: "BypassOtp", value: true }]);

    render(await OTPBypassBanner());

    const bannerText = await screen.findByText(/OTP Bypass Enabled/i);

    expect(bannerText).toBeInTheDocument();
    expect(bannerText).toHaveTextContent("OTP Bypass Enabled - Verification Code: 000000");
  });

  it("should not render OTP bypass banner when feature toggle is disabled", async () => {
    (getFeatureToggles as Mock).mockResolvedValue([{ key: "BypassOtp", value: false }]);

    render(await OTPBypassBanner());

    const bannerText = screen.queryByText(/OTP Bypass Enabled/i);

    expect(bannerText).toBeNull();
  });

  it("should not render OTP bypass banner when the feature toggle does not exist", async () => {
    (getFeatureToggles as Mock).mockResolvedValue([{ key: "SomeOtherFeature", value: true }]);

    render(await OTPBypassBanner());

    // Assert: Ensure the banner is not shown
    const bannerText = screen.queryByText(/OTP Bypass Enabled/i);

    expect(bannerText).toBeNull();
  });
});

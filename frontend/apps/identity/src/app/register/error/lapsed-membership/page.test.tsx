import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clientEnv } from "#env/client";
import { expectGtmCustomEvent } from "#testing/analytics";
import { assertFooterProps } from "#testing/footerProps";
import { describe, expect, it, vi } from "vitest";

import MembershipLapsed from "./page";

vi.mock("server-only", () => ({}));

const racHomePageUrl = clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL;
const siteInfoUrl = clientEnv().NEXT_PUBLIC_RAC_ABOUT_SITE_INFO_URL;

describe("LapsedMembership", () => {
  it("should be able to render", () => {
    render(<MembershipLapsed />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const phoneLink = screen.getByRole("link", { name: "13 17 03" });
    const racHomePageLink = screen.getByRole("link", { name: /RAC homepage/i });

    expect(screen.getByText("Sorry, your membership has lapsed")).toBeVisible();
    expect(screen.getByText("To be a member...")).toBeVisible();
    expect(
      screen.getByText(
        "You must have insurance, Roadside Assistance, a loan, security monitoring or a Rewards membership with us.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText("If you've missed a payment or forgotten to renew, please call us on", { exact: false }),
    ).toBeVisible();
    expect(homeLink).toBeVisible();
    expect(homeLink).toHaveAttribute("href", racHomePageUrl);
    expect(phoneLink).toBeVisible();
    expect(phoneLink).toHaveAttribute("href", "tel:131703");
    expect(racHomePageLink).toBeVisible();
    expect(racHomePageLink).toHaveAttribute("href", racHomePageUrl);

    assertFooterProps(siteInfoUrl);
  });

  it("should raise GTM event when 'RAC homepage' button is clicked", async () => {
    const user = userEvent.setup();
    render(<MembershipLapsed />);

    await user.click(screen.getByRole("link", { name: /RAC homepage/i }));

    expectGtmCustomEvent("RAC homepage");
  });
});

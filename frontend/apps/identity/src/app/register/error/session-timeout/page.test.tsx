import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clientEnv } from "#env/client";
import { expectGtmCustomEvent } from "#testing/analytics";
import { assertFooterProps } from "#testing/footerProps";
import { describe, expect, it, vi } from "vitest";

import SessionTimeout from "./page";

vi.mock("server-only", () => ({}));

const racHomePageUrl = clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL;
const siteInfoUrl = clientEnv().NEXT_PUBLIC_RAC_ABOUT_SITE_INFO_URL;

describe("SessionTimeout", () => {
  it("should be able to render", () => {
    render(<SessionTimeout />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const racHomePageLink = screen.getByRole("link", { name: /RAC homepage/i });

    expect(screen.getByText("Uh oh!")).toBeVisible();
    expect(screen.getByText("It looks like your page timed out")).toBeVisible();
    expect(screen.getByText("Please try again.")).toBeVisible();
    expect(homeLink).toBeVisible();
    expect(homeLink).toHaveAttribute("href", racHomePageUrl);
    expect(racHomePageLink).toBeVisible();
    expect(racHomePageLink).toHaveAttribute("href", racHomePageUrl);

    assertFooterProps(siteInfoUrl);
  });

  it("should raise GTM event when 'RAC homepage' button is clicked", async () => {
    const user = userEvent.setup();
    render(<SessionTimeout />);

    await user.click(screen.getByRole("link", { name: /RAC homepage/i }));

    expectGtmCustomEvent("RAC homepage");
  });
});

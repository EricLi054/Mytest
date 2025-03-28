import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clientEnv } from "#env/client";
import { expectGtmCustomEvent } from "#testing/analytics";
import { assertFooterProps } from "#testing/footerProps";
import { describe, expect, it, vi } from "vitest";

import SystemUnavailable from "./page";

vi.mock("server-only", () => ({}));

const racHomePageUrl = clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL;
const siteInfoUrl = clientEnv().NEXT_PUBLIC_RAC_ABOUT_SITE_INFO_URL;

describe("SystemUnavailable", () => {
  it("should be able to render", () => {
    render(<SystemUnavailable />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const phoneLink = screen.getByRole("link", { name: "13 17 03" });

    expect(screen.getByText("Uh oh!")).toBeVisible();
    expect(screen.getByText("Something went wrong")).toBeVisible();
    expect(screen.getByText("Please try again later or call us on", { exact: false })).toBeVisible();
    expect(homeLink).toBeVisible();
    expect(homeLink).toHaveAttribute("href", racHomePageUrl);
    expect(phoneLink).toBeVisible();
    expect(phoneLink).toHaveAttribute("href", "tel:131703");

    assertFooterProps(siteInfoUrl);
  });

  it("should raise GTM event when 'RAC homepage' button is clicked", async () => {
    const user = userEvent.setup();
    render(<SystemUnavailable />);

    await user.click(screen.getByRole("link", { name: /RAC homepage/i }));

    expectGtmCustomEvent("RAC homepage");
  });
});

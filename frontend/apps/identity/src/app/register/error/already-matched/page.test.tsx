import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clientEnv } from "#env/client";
import { expectGtmCustomEvent } from "#testing/analytics";
import { assertFooterProps } from "#testing/footerProps";
import { describe, expect, it, vi } from "vitest";

import AlreadyMatched from "./page";

vi.mock("server-only", () => ({}));

const racHomePageUrl = clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL;
const myRacLoginPageUrl = clientEnv().NEXT_PUBLIC_MYRAC_LOGIN_PAGE_URL;
const siteInfoUrl = clientEnv().NEXT_PUBLIC_RAC_ABOUT_SITE_INFO_URL;

describe("AlreadyMatched", () => {
  it("should be able to render", () => {
    render(<AlreadyMatched />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const myRacLoginPageLink = screen.getByRole("link", { name: /Log in or register/i });

    expect(screen.getByText("Uh oh!")).toBeVisible();
    expect(screen.getByText("Something went wrong")).toBeVisible();
    expect(screen.getByText("Please try again.")).toBeVisible();
    expect(homeLink).toBeVisible();
    expect(homeLink).toHaveAttribute("href", racHomePageUrl);
    expect(myRacLoginPageLink).toBeVisible();
    expect(myRacLoginPageLink).toHaveAttribute("href", myRacLoginPageUrl);

    assertFooterProps(siteInfoUrl);
  });

  it("should raise GTM event when 'Log in or register' button is clicked", async () => {
    const user = userEvent.setup();
    render(<AlreadyMatched />);

    await user.click(screen.getByRole("link", { name: /Log in or register/i }));

    expectGtmCustomEvent("Log in or register");
  });
});

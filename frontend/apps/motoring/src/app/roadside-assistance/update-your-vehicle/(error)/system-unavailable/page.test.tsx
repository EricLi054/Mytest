import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clientEnv } from "#env/client";
import { expectGtmCustomEvent } from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import SystemUnavailable from "./page";

vi.mock("server-only", () => ({}));

describe("SystemUnavailable", () => {
  it("should be able to render", () => {
    render(<SystemUnavailable />);

    const phoneLink = screen.getByRole("link", { name: "13 17 03" });
    const myRacLink = screen.getByRole("link", { name: /Back to myRAC/i });
    const accessibilityLink = screen.getByRole("link", { name: /Accessibility/i });
    const disclaimerLink = screen.getByRole("link", { name: /Disclaimer/i });
    const privacyLink = screen.getByRole("link", { name: /Privacy/i });
    const securityLink = screen.getByRole("link", { name: /Security/i });

    expect(screen.getByText("Uh oh!")).toBeVisible();
    expect(screen.getByText("Something went wrong")).toBeVisible();
    expect(phoneLink).toBeVisible();
    expect(phoneLink).toHaveAttribute("href", "tel:131703");
    expect(myRacLink).toBeVisible();
    expect(myRacLink).toHaveAttribute("href", `${clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}/myrac`);
    expect(accessibilityLink).toHaveAttribute(
      "href",
      `${clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}/about-rac/site-info/accessibility`,
    );
    expect(disclaimerLink).toHaveAttribute(
      "href",
      `${clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}/about-rac/site-info/disclaimer`,
    );
    expect(privacyLink).toHaveAttribute(
      "href",
      `${clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}/about-rac/site-info/privacy`,
    );
    expect(securityLink).toHaveAttribute(
      "href",
      `${clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}/about-rac/site-info/security`,
    );
  });

  it("should raise GTM event when 'Back to myRAC' button is clicked", async () => {
    const user = userEvent.setup();
    render(<SystemUnavailable />);

    await user.click(screen.getByRole("link", { name: /Back to myRAC/i }));

    expectGtmCustomEvent("Back to myRAC");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ErrorPage } from ".";

const mockUrl = "https://ui.racwa.com.au";

describe("ErrorPage", () => {
  it("should be able to render", () => {
    const subheading = "test subheading";
    const subtext = "test subtext";
    const buttonText = "test button text";

    render(
      <ErrorPage>
        <ErrorPage.Subheading>{subheading}</ErrorPage.Subheading>
        <ErrorPage.Subtext>{subtext}</ErrorPage.Subtext>
        <ErrorPage.Button href={mockUrl}>{buttonText}</ErrorPage.Button>
      </ErrorPage>,
    );

    const errorButton = screen.getByRole("link", { name: buttonText });

    expect(screen.getByText("Uh oh!")).toBeVisible();
    expect(screen.getByText(subheading)).toBeVisible();
    expect(screen.getByText(subtext)).toBeVisible();
    expect(errorButton).toBeVisible();
    expect(errorButton).toHaveAttribute("href", mockUrl);
  });

  it("should forward StandardPageTemplate props", () => {
    const heading = "🚬";

    render(<ErrorPage heading={heading} navBreadcrumbProps={{ homeLink: mockUrl }}></ErrorPage>);

    const homeLink = screen.getByRole("link", { name: "Home" });

    expect(homeLink).toBeVisible();
    expect(homeLink).toHaveAttribute("href", mockUrl);
    expect(screen.getByText(heading)).toBeVisible();
  });
});

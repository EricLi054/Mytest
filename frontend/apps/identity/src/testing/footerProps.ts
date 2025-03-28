import { screen } from "@testing-library/react";
import { expect } from "vitest";

export const assertFooterProps = (racAboutSiteInfoUrl: string): void => {
  const accessibilityLink = screen.getByRole("link", { name: /Accessibility/i });
  expect(accessibilityLink).toBeVisible();
  expect(accessibilityLink).toHaveAttribute("href", `${racAboutSiteInfoUrl}/accessibility`);

  const disclaimerLink = screen.getByRole("link", { name: /Disclaimer/i });
  expect(disclaimerLink).toBeVisible();
  expect(disclaimerLink).toHaveAttribute("href", `${racAboutSiteInfoUrl}/disclaimer`);

  const privacyLink = screen.getByRole("link", { name: /Privacy/i });
  expect(privacyLink).toBeVisible();
  expect(privacyLink).toHaveAttribute("href", `${racAboutSiteInfoUrl}/privacy`);

  const securityLink = screen.getByRole("link", { name: /Security/i });
  expect(securityLink).toBeVisible();
  expect(securityLink).toHaveAttribute("href", `${racAboutSiteInfoUrl}/security`);
};

import type { Mock } from "vitest";
import { EMPTY_URL } from "#constants";
import { clientEnv } from "#env/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getFooterProps } from "./getFooterProps";

vi.mock("#env/client", () => ({
  clientEnv: vi.fn(),
}));

describe("getFooterProps", () => {
  beforeEach(() => {
    (clientEnv as Mock).mockReturnValue({
      NEXT_PUBLIC_RAC_ABOUT_PRIVACY_URL: "https://example.com/privacy",
      NEXT_PUBLIC_RAC_ABOUT_SECURITY_URL: "https://example.com/security",
      NEXT_PUBLIC_RAC_ABOUT_DISCLAIMER_URL: "https://example.com/disclaimer",
      NEXT_PUBLIC_RAC_ABOUT_ACCESSIBILITY_URL: "https://example.com/accessibility",
    });
  });

  it("should return the correct footer props", () => {
    const footerProps = getFooterProps();

    expect(footerProps.privacyLinkProps).toHaveProperty("href", "https://example.com/privacy");
    expect(footerProps.securityLinkProps).toHaveProperty("href", "https://example.com/security");
    expect(footerProps.disclaimerLinkProps).toHaveProperty("href", "https://example.com/disclaimer");
    expect(footerProps.accessibilityLinkProps).toHaveProperty("href", "https://example.com/accessibility");
  });

  it("should return EMPTY_URL for missing environment variables", () => {
    (clientEnv as Mock).mockReturnValue({
      NEXT_PUBLIC_RAC_ABOUT_PRIVACY_URL: undefined,
      NEXT_PUBLIC_RAC_ABOUT_SECURITY_URL: undefined,
      NEXT_PUBLIC_RAC_ABOUT_DISCLAIMER_URL: undefined,
      NEXT_PUBLIC_RAC_ABOUT_ACCESSIBILITY_URL: undefined,
    });

    const footerProps = getFooterProps();

    expect(footerProps.privacyLinkProps).toHaveProperty("href", EMPTY_URL);
    expect(footerProps.securityLinkProps).toHaveProperty("href", EMPTY_URL);
    expect(footerProps.disclaimerLinkProps).toHaveProperty("href", EMPTY_URL);
    expect(footerProps.accessibilityLinkProps).toHaveProperty("href", EMPTY_URL);
  });
});

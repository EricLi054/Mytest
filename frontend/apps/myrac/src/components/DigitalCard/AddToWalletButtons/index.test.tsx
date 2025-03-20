import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "#utils/analyticsTagging";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AddToAppleWalletButton, AddToGoogleWalletButton } from ".";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

describe("AddToWalletButtons", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render AddToAppleWalletButton with correct attributes", () => {
    render(<AddToAppleWalletButton href="https://apple.com" googleAnalyticsDescription="AppleEvent" />);

    const link = screen.getByRole("link", { name: /add to apple wallet/i });

    expect(link).toHaveAttribute("href", "https://apple.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("id", "add-to-apple-wallet");

    const image = screen.getByAltText("Add to Apple Wallet");

    expect(image).toBeVisible();
  });

  it("should render AddToGoogleWalletButton with correct attributes", () => {
    render(<AddToGoogleWalletButton href="https://google.com" googleAnalyticsDescription="GoogleEvent" />);

    const link = screen.getByRole("link", { name: /add to google wallet/i });

    expect(link).toHaveAttribute("href", "https://google.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("id", "add-to-google-wallet");

    const image = screen.getByAltText("Add to Google Wallet");

    expect(image).toBeVisible();
  });

  it("should call logEvent when AddToAppleWalletButton is clicked", async () => {
    render(<AddToAppleWalletButton href="https://apple.com" googleAnalyticsDescription="AppleEvent" />);

    const link = screen.getByRole("link", { name: /add to apple wallet/i });
    await userEvent.click(link);

    expect(logEvent).toHaveBeenCalledWith("AppleEvent");
  });

  it("should call logEvent when AddToGoogleWalletButton is clicked", async () => {
    render(<AddToGoogleWalletButton href="https://google.com" googleAnalyticsDescription="GoogleEvent" />);

    const link = screen.getByRole("link", { name: /add to google wallet/i });
    await userEvent.click(link);

    expect(logEvent).toHaveBeenCalledWith("GoogleEvent");
  });

  it("should not call logEvent if googleAnalyticsDescription is not provided for AddToAppleWalletButton", async () => {
    render(<AddToAppleWalletButton href="https://apple.com" />);

    const link = screen.getByRole("link", { name: /add to apple wallet/i });
    await userEvent.click(link);

    expect(logEvent).not.toHaveBeenCalled();
  });

  it("should not call logEvent if googleAnalyticsDescription is not provided for AddToGoogleWalletButton", async () => {
    render(<AddToGoogleWalletButton href="https://google.com" />);

    const link = screen.getByRole("link", { name: /add to google wallet/i });
    await userEvent.click(link);

    expect(logEvent).not.toHaveBeenCalled();
  });
});

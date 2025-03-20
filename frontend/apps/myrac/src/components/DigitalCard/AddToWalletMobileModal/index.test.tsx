import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import AddToWalletMobileModal from "./";

const mockPerson: z.infer<typeof PersonSchema> = {
  title: "Mr",
  firstName: "John",
  surname: "Doe",
  cardColour: "Gold",
  racId: "123456",
  membershipCardNumber: "1231231231231231",
  membershipType: "Gold",
  tier: "Gold",
};

const mockAddToWalletUrl = "https://example.com";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

describe("DigitalCardModalContent", () => {
  it("should render the modal content with person information", () => {
    render(<AddToWalletMobileModal person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    expect(screen.getByText("Your digital card")).toBeVisible();
    expect(screen.getByText("Use the barcode or set up your card in your digital wallet")).toBeVisible();
  });

  it("should render DigitalCardFront component initially", () => {
    render(<AddToWalletMobileModal person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    expect(screen.getByText("Show barcode")).toBeVisible();
    expect(screen.queryByText("Hide barcode")).toBeNull();
  });

  it('should toggle to show DigitalCardBack when "Show barcode" is clicked', async () => {
    render(<AddToWalletMobileModal person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    const toggleButton = screen.getByText("Show barcode");
    await userEvent.click(toggleButton);

    expect(screen.getByText("Hide barcode")).toBeVisible();
    expect(screen.queryByText("Show barcode")).toBeNull();
  });

  it("should toggle to show DigitalCardBack when card is left swiped", () => {
    render(<AddToWalletMobileModal person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    const card = screen.getByTestId("flippable-card");

    fireEvent.touchStart(card, { targetTouches: [{ clientX: 100, clientY: 1 }] });
    fireEvent.touchMove(card, { targetTouches: [{ clientX: 40, clientY: 1 }] });
    fireEvent.touchEnd(card);

    expect(screen.getByText("Hide barcode")).toBeVisible();
    expect(screen.queryByText("Show barcode")).toBeNull();
    expect(logEvent).toHaveBeenCalledWith("Digital card mobile modal - Swipe to show barcode");
  });

  it("should toggle to show DigitalCardFront when card is right swiped from back", async () => {
    render(<AddToWalletMobileModal person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    await testHelper.clickText("Show barcode", screen);

    expect(screen.getByText("Hide barcode")).toBeVisible();
    expect(screen.queryByText("Show barcode")).toBeNull();

    const card = screen.getByTestId("flippable-card");

    fireEvent.touchStart(card, { targetTouches: [{ clientX: 40, clientY: 1 }] });
    fireEvent.touchMove(card, { targetTouches: [{ clientX: 100, clientY: 1 }] });
    fireEvent.touchEnd(card);

    expect(screen.getByText("Show barcode")).toBeVisible();
    expect(screen.queryByText("Hide barcode")).toBeNull();
    expect(logEvent).toHaveBeenCalledWith("Digital card mobile modal - Swipe to hide barcode");
  });

  it("should render AddToAppleWalletButton and AddToGoogleWalletButton", () => {
    render(<AddToWalletMobileModal person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    expect(screen.queryByRole("link", { name: /Add to Apple Wallet/i })).toBeVisible();
    expect(screen.queryByRole("link", { name: /Add to Google Wallet/i })).toBeVisible();
  });

  it("should fire events when AddToAppleWalletButton and AddToGoogleWalletButton clicked", async () => {
    render(<AddToWalletMobileModal person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    await testHelper.clickLink("Add to Apple Wallet", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card mobile modal - Add to Apple Wallet");

    await testHelper.clickLink("Add to Google Wallet", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card mobile modal - Add to Google Wallet");
  });

  it("should hide AddToAppleWalletButton and AddToGoogleWalletButton when no addToWalletUrl is provided", () => {
    render(<AddToWalletMobileModal person={mockPerson} addToWalletUrl={undefined} />);

    expect(screen.queryByRole("link", { name: /Add to Apple Wallet/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /Add to Google Wallet/i })).toBeNull();
  });

  it("should render the footer link", () => {
    render(<AddToWalletMobileModal person={mockPerson} addToWalletUrl={mockAddToWalletUrl} />);

    expect(screen.getByText("Frequently asked questions")).toBeVisible();
    expect(screen.getByRole("link", { name: /Frequently asked questions/i })).toHaveAttribute("href", "/myrac/help");
  });

  it("should not render content if person information is not provided", () => {
    const { container } = render(<AddToWalletMobileModal person={undefined} addToWalletUrl={mockAddToWalletUrl} />);

    expect(container).toBeEmptyDOMElement();
  });
});

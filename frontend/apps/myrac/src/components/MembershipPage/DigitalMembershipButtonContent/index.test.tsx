import type { DigitalCardDetailsSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { render, screen } from "@testing-library/react";
import { ModalProvider } from "#providers/modal/index";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DigitalCardMembershipButtonContent from ".";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

vi.mock("../../shared/useDeviceDetection", () => ({
  useDeviceDetection: vi.fn(),
}));

describe("DigitalCardMembershipButtonContent", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  const mockedCardDetails: z.infer<typeof DigitalCardDetailsSchema> = {
    isActive: true,
    passId: "testing-123",
    passUrl: "https://www.example.com",
    numberOfPassesInstalled: 0,
    id: "",
  };

  it("should render add to wallet buttons in mobile view", () => {
    testHelper.mockMobileDevice();
    render(
      <ModalProvider>
        <DigitalCardMembershipButtonContent digitalCardDetails={mockedCardDetails} />
      </ModalProvider>,
    );

    expect(screen.getByAltText("Add to Apple Wallet")).toBeVisible();
    expect(screen.getByAltText("Add to Google Wallet")).toBeVisible();
  });

  it("should render find out more button in desktop view", () => {
    testHelper.mockDesktopDevice();
    render(
      <ModalProvider>
        <DigitalCardMembershipButtonContent digitalCardDetails={mockedCardDetails} />
      </ModalProvider>,
    );

    expect(screen.getByRole("button", { name: "Find out more" })).toBeVisible();
  });

  it("should show modal when clicking find out more button", async () => {
    testHelper.mockDesktopDevice();
    render(
      <ModalProvider>
        <DigitalCardMembershipButtonContent digitalCardDetails={mockedCardDetails} />
      </ModalProvider>,
    );

    await testHelper.clickButton("Find out more", screen);

    expect(logEvent).toHaveBeenCalledWith("Find out more");
    expect(logEvent).toHaveBeenCalledWith("Digital card desktop modal");

    expect(screen.getByText("Get your digital card now")).toBeVisible();

    await testHelper.clickButton("close", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card desktop modal - Close");

    expect(screen.queryByText("Get your digital card now")).not.toBeInTheDocument();
  });
});

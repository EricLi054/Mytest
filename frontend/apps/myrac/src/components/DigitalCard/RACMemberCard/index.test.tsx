import type { DigitalCardDetails } from "#components/MemberDetailsBar/types";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { render, screen } from "@testing-library/react";
import { ModalProvider } from "#providers/modal";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import type { RACMemberCardProps } from "./";
import RACMemberCard from "./";

library.add(fas);

const mockedCardDetails: DigitalCardDetails = {
  id: "123",
  passId: "12345",
  isActive: true,
  passUrl: "https://digital-card-link",
  numberOfPassesInstalled: 0,
};

const props: RACMemberCardProps = {
  person: {
    title: "Mr",
    firstName: "John",
    surname: "Doe",
    tier: "Blue",
    cardColour: "Blue",
    racId: "12345678",
    membershipCardNumber: "1234567890123456",
    membershipType: "Standard",
    digitalCardDetails: mockedCardDetails,
  },
};

const getItemMock = vi.fn();
const setItemMock = vi.fn();
Storage.prototype.getItem = getItemMock;
Storage.prototype.setItem = setItemMock;

vi.mock("../../shared/useDeviceDetection", () => ({
  useDeviceDetection: vi.fn(),
}));

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

describe("DigitalCard", () => {
  it("should render the card with correct details", () => {
    testHelper.mockDesktopDevice();
    render(
      <ModalProvider>
        <RACMemberCard {...props} />
      </ModalProvider>,
    );

    expect(screen.getByText("Digital card")).toBeVisible();
  });

  it("should click the image should show desktop modal and can close it", async () => {
    testHelper.mockDesktopDevice();
    render(
      <ModalProvider>
        <RACMemberCard {...props} />
      </ModalProvider>,
    );

    await testHelper.clickText("Digital card", screen);

    expect(screen.getByText("Get your digital card now")).toBeVisible();
    expect(logEvent).toHaveBeenCalledWith("Digital card desktop modal");

    expect(screen.getByText("Get your digital card now")).toBeVisible();

    await testHelper.clickButton("close", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card desktop modal - Close");
  });

  it("should show mobile modal and close it when image clicked", async () => {
    testHelper.mockMobileDevice();
    render(
      <ModalProvider>
        <RACMemberCard {...props} />
      </ModalProvider>,
    );

    await testHelper.clickText("Digital card", screen);

    expect(screen.getByText("Your digital card")).toBeVisible();
    expect(logEvent).toHaveBeenCalledWith("Digital card mobile modal");

    await testHelper.clickButton("close", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card mobile modal - Close");
  });
});

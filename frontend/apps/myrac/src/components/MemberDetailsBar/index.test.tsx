import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { render, screen } from "@testing-library/react";
import { ModalProvider } from "#providers/modal";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import type { DigitalCardDetails, Person } from "./types";
import MemberDetailsBar from ".";

library.add(fas);

testHelper.mockEnvironmentVariableProvider();

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

function getMockedPerson(): Person {
  return {
    title: "Mr",
    firstName: "Test",
    surname: "Tester",
    racId: "12345678",
    cardColour: "Blue",
    tier: "Blue",
    membershipCardNumber: "12345678888888888",
    membershipType: "Some Membership Type",
  };
}

function getMockedDigitalCardDetails(digitalCardPassIsActive = false): DigitalCardDetails {
  return {
    passId: "123",
    isActive: digitalCardPassIsActive,
    passUrl: "https://abc123.com",
    numberOfPassesInstalled: 0,
    id: "123",
  };
}

describe("MemberDetailsBar", () => {
  it("should render the component with correct member details", () => {
    render(<MemberDetailsBar person={getMockedPerson()} />);

    expect(screen.getByText("Mr T Tester")).toBeInTheDocument();
    expect(screen.getByText("12345678")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Blue member")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Profile" })).toBeInTheDocument();
  });

  it("should trigger GA event when Profile button clicked", async () => {
    render(<MemberDetailsBar person={getMockedPerson()} />);

    await testHelper.clickLink("Profile", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card - Profile button click");
  });

  it("should trigger GA event when Member Card clicked and Digital Card inactive", async () => {
    render(<MemberDetailsBar person={getMockedPerson()} />);

    const card = screen.getByTestId("digital-card-icon");

    expect(card).toBeVisible();

    await testHelper.clickElement(card);

    expect(logEvent).toHaveBeenCalledWith("Digital card icon click");
  });

  it("should render digital card if active", () => {
    const person: Person = {
      ...getMockedPerson(),
      digitalCardDetails: getMockedDigitalCardDetails(true),
    };
    render(
      <ModalProvider>
        <MemberDetailsBar person={person} />
      </ModalProvider>,
    );

    const cardImage = screen.getByText("Digital card");

    expect(cardImage).toBeVisible();
  });

  it("should trigger GA event when digitalCardPassIsActive is `false` and Digital Card Icon clicked", async () => {
    const person: Person = {
      ...getMockedPerson(),
      digitalCardDetails: getMockedDigitalCardDetails(),
    };

    render(<MemberDetailsBar person={person} />);

    await testHelper.clickTestId("digital-card-icon", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card - Profile button click");
  });
});

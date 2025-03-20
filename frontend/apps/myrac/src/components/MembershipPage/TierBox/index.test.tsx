import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { render, screen } from "@testing-library/react";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import { TierBox } from ".";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
  logFieldTouched: vi.fn(),
}));

function getMockedPerson(): z.infer<typeof PersonSchema> {
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

describe("TierBox", () => {
  it("should render the component with correct member details", () => {
    render(<TierBox person={getMockedPerson()} />);

    expect(screen.getByText("Blue member")).toBeInTheDocument();
  });

  it("should triggers GA event when clicking profile button", async () => {
    render(<TierBox person={getMockedPerson()} />);

    await testHelper.clickText("Blue member", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card - Tier pill");
  });
});

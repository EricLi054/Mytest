import { render, screen } from "@testing-library/react";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import type { DigitalCardFrontProps } from ".";
import DigitalCardFront from ".";

const props: DigitalCardFrontProps = {
  person: {
    firstName: "Fiona",
    surname: "Citizen",
    title: "Ms",
    racId: "018282922",
    cardColour: "Gold",
    membershipCardNumber: "1231231231231231",
    membershipType: "Standard",
    tier: "Gold",
  },
};

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

describe("DigitalCardFront", () => {
  it("should render details", () => {
    render(<DigitalCardFront {...props} />);

    expect(screen.getByTestId("rac-logo")).toBeVisible();
    expect(screen.getByText("MS Fiona Citizen", { exact: false })).toBeVisible();
    expect(screen.getByText("Tier")).toBeVisible();
    expect(screen.getByText("Gold")).toBeVisible();
    expect(screen.getByText("Member number")).toBeVisible();
    expect(screen.getByText("018282922")).toBeVisible();
  });

  it("should uppercase display name", () => {
    render(<DigitalCardFront {...props} />);

    expect(screen.getByText("MS Fiona Citizen", { exact: false })).toHaveStyle("text-transform: uppercase");
  });

  it("should fire event on click if passed", async () => {
    render(<DigitalCardFront {...props} googleAnalyticsDescription="Event" />);

    await testHelper.clickText("Gold", screen);

    expect(logEvent).toHaveBeenCalledWith("Event");
  });
});

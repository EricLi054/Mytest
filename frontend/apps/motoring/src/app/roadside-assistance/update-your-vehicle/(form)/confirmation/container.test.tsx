import { useActionState } from "react";
import { render, screen } from "@testing-library/react";
import { mockConfirmationContentfulData } from "#mocks/contentful";
import { useFormStatus } from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConfirmationContainer } from "./container";

vi.mock("server-only", () => ({}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    useFormStatus: vi.fn(),
  };
});

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

describe("ConfirmationContainer", () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
    vi.mocked(useFormStatus).mockReturnValue({ pending: false, data: null, method: null, action: null });
  });

  it("should render with car data", () => {
    render(
      <ConfirmationContainer
        firstName="Anurag"
        vehicleType="CAR"
        myRacUrl="https://myrac.com"
        contentfulData={mockConfirmationContentfulData}
      />,
    );

    expect(screen.getByText("You're all set, Anurag!")).toBeVisible();
    expect(screen.getByText(mockConfirmationContentfulData.subheading)).toBeVisible();
    expect(screen.getByText(mockConfirmationContentfulData.cards.carInsuranceCard.title)).toBeVisible();
    expect(screen.getByRole("link", { name: /Back to myRAC/i })).toBeVisible();
  });

  it("should render with motorcycle data", () => {
    render(
      <ConfirmationContainer
        firstName="Tom"
        vehicleType="MOTORCYCLE"
        myRacUrl="https://myrac.com"
        contentfulData={mockConfirmationContentfulData}
      />,
    );

    expect(screen.getByText("You're all set, Tom!")).toBeVisible();
    expect(screen.getByText(mockConfirmationContentfulData.subheading)).toBeVisible();
    expect(screen.getByText(mockConfirmationContentfulData.cards.motorcycleInsuranceCard.title)).toBeVisible();
    expect(screen.getByRole("link", { name: /Back to myRAC/i })).toBeVisible();
  });

  it("should render heading from contentfulData if available", () => {
    const customContentfulData = {
      ...mockConfirmationContentfulData,
      heading: "Custom Heading",
    };

    render(
      <ConfirmationContainer
        firstName="Conrad"
        vehicleType="CAR"
        myRacUrl="https://myrac.com"
        contentfulData={customContentfulData}
      />,
    );

    expect(screen.getByText("Custom Heading")).toBeVisible();
  });

  it("should render default heading if contentfulData heading is empty", () => {
    const customContentfulData = {
      ...mockConfirmationContentfulData,
      heading: "",
    };

    render(
      <ConfirmationContainer
        firstName="Dan"
        vehicleType="CAR"
        myRacUrl="https://myrac.com"
        contentfulData={customContentfulData}
      />,
    );

    expect(screen.getByText("You're all set, Dan!")).toBeVisible();
  });
});

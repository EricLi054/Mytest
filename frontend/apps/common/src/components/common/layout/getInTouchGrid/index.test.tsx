import type { ContactMethodsSection } from "#types/common/contactMethodsSection";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GetInTouchGrid from ".";

const mockContactMethod: ContactMethodsSection = {
  heading: "Test Contact Methods",
  rendering: "Grid",
  contactNumbersCollection: {
    items: [
      {
        businessAreaCovered: "General",
        phoneNumber: "0412345678",
        openingHours: "Test hours",
        additionalOpeningHours: "Test Additional",
      },
    ],
  },
};

describe("Get in Touch Grid", () => {
  it("should render the Get in Touch grid", () => {
    render(
      <GetInTouchGrid
        heading={mockContactMethod.heading}
        contactNumbers={mockContactMethod.contactNumbersCollection}
      />,
    );

    expect(screen.getByText("Test Contact Methods")).toBeVisible();
    expect(screen.getByText("Test hours")).toBeVisible();
  });
});

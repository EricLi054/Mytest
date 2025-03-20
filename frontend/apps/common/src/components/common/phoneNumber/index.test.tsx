import type { ContactNumbers } from "#types/common/contactMethodsSection";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PhoneNumber from ".";

const mockContactNumber: ContactNumbers = {
  businessAreaCovered: "General",
  phoneNumber: "0412345678",
  openingHours: "Test hours",
  additionalOpeningHours: "Test Additional",
};

describe("Contact Methods", () => {
  it("should render the Contact Methods section", () => {
    render(<PhoneNumber contactNumbers={mockContactNumber} />);

    expect(screen.getByText("Australia")).toBeVisible();
    expect(screen.getByText(mockContactNumber.openingHours)).toBeVisible();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DigitalCardBack from ".";

vi.mock("./Barcode", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="barcode" />),
}));

describe("DigitalCardBack", () => {
  it("should render the barcode when membershipCardNumber is provided", () => {
    render(<DigitalCardBack membershipCardNumber="1231231231231231" />);

    expect(screen.getByText("Scan and save")).toBeVisible();
    expect(screen.getByTestId("barcode")).toBeVisible();
  });

  it("should not render and log an error when membershipCardNumber is not provided", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");

    render(<DigitalCardBack />);

    expect(consoleErrorSpy).toHaveBeenCalledWith("No barcode provided to DigitalCardBack");
    expect(screen.queryByText("Scan and save")).toBeNull();
    expect(screen.queryByTestId("barcode")).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});

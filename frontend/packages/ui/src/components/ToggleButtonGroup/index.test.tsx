import type { Mock } from "vitest";
import { useField } from "@conform-to/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ToggleButtonGroup } from ".";

vi.mock("@conform-to/react", () => ({
  useField: vi.fn(),
  useInputControl: vi.fn().mockReturnValue({
    value: "",
    change: vi.fn(),
    blur: vi.fn(),
    focus: vi.fn(),
  }),
}));

describe("ToggleButtonGroup", () => {
  const defaultProps = {
    name: "testField",
    options: ["Option 1", "Option 2"],
    label: "Test Label",
  };

  beforeEach(() => {
    (useField as Mock).mockReturnValue([{ errors: [] }]);
  });

  it("should be able to render", () => {
    render(<ToggleButtonGroup {...defaultProps} />);

    expect(screen.getByText("Test Label")).toBeVisible();
    expect(screen.getByText("Option 1")).toBeVisible();
    expect(screen.getByText("Option 2")).toBeVisible();
  });

  it("should call onChange handler when an option is selected", async () => {
    const handleChange = vi.fn();
    render(<ToggleButtonGroup {...defaultProps} onChange={handleChange} />);

    await userEvent.click(screen.getByText("Option 1"));

    expect(handleChange).toHaveBeenCalledWith(expect.any(Object), "Option 1");
  });

  it("should call onBlur handler when the component loses focus", async () => {
    const handleBlur = vi.fn();
    render(<ToggleButtonGroup {...defaultProps} onBlur={handleBlur} />);

    await userEvent.click(screen.getByRole("button", { name: "Option 1" }));
    await userEvent.tab();

    expect(handleBlur).toHaveBeenCalled();
  });

  it("should display an error message when there are errors", () => {
    (useField as Mock).mockReturnValue([{ errors: ["Error message"] }]);
    render(<ToggleButtonGroup {...defaultProps} />);

    expect(screen.getByText("Please select an option")).toBeVisible();
  });

  describe("Tooltip functionality", () => {
    const tooltipProps = {
      title: "Tooltip Title",
      message: "Tooltip Message",
    };

    it("should render the tooltip correctly", () => {
      render(<ToggleButtonGroup {...defaultProps} tooltipProps={tooltipProps} />);

      expect(screen.getByLabelText("show tooltip")).toBeVisible();
    });

    it("should open the tooltip when the button is clicked", async () => {
      render(<ToggleButtonGroup {...defaultProps} tooltipProps={tooltipProps} />);
      await userEvent.click(screen.getByLabelText("show tooltip"));

      expect(screen.getByText("Tooltip Title")).toBeVisible();
      expect(screen.getByText("Tooltip Message")).toBeVisible();
    });

    it("should close the tooltip when the close button is clicked", async () => {
      render(<ToggleButtonGroup {...defaultProps} tooltipProps={tooltipProps} />);
      await userEvent.click(screen.getByLabelText("show tooltip"));
      const closeButton = screen.getByRole("button", { name: /close/i });
      await userEvent.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByText("Tooltip Title")).toBeNull();
      });
    });
  });
});

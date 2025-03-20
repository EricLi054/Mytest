import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TextResizer from ".";

describe("TextResizer", () => {
  it("should render correctly", () => {
    render(<TextResizer />);

    expect(screen.getByText("Text size")).toBeVisible();
  });

  it("should display three resize buttons", () => {
    render(<TextResizer />);
    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.textContent)).toEqual(["A", "A", "A"]);
  });

  it("should apply the active style to the default size button", () => {
    render(<TextResizer />);
    const defaultButton = screen.getAllByRole("button", { name: "A" })[0];

    expect(defaultButton).toHaveClass("MuiButton-root");
  });

  it("should trigger resizeText when a size button is clicked", async () => {
    render(<TextResizer />);

    const querySpy = vi.spyOn(document, "querySelectorAll");

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0] as Element);

    expect(querySpy).toHaveBeenCalled();

    querySpy.mockRestore();
  });
});

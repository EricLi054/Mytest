import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CancelLink from ".";

vi.mock("server-only", () => ({}));

const mockOnClick = vi.fn();

describe("CancelLink", () => {
  it("should be able to render", () => {
    render(<CancelLink />);

    const cancelLink = screen.getByText("Cancel");

    expect(cancelLink).toBeVisible();
    expect(cancelLink).toHaveAttribute("aria-label", "Cancel and return to the RAC homepage");
  });

  it("should call custom onClick", async () => {
    const user = userEvent.setup();
    render(<CancelLink onClick={mockOnClick} />);

    await user.click(screen.getByText("Cancel"));

    expect(mockOnClick).toHaveBeenCalled();
  });
});

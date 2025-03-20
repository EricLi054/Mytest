import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DropDown from ".";

// Mock data and utilities
vi.mock("./data", () => ({
  getDropDownCollection: vi.fn(() => ({
    data: {
      rac_basePageCollection: {
        items: [
          {
            slug: "test-slug",
            contentCollection: {
              items: [
                {
                  categoryName: "Menu Item 1",
                  sys: { id: "content-id" },
                },
                {
                  categoryName: "Menu Item 2",
                  sys: { id: "content-id2" },
                },
              ],
            },
          },
        ],
      },
    },
  })),
}));

vi.mock("server-only", () => {
  return {};
});

describe("Category Select Dropdown", () => {
  it("should render the Category Selectdropdown", async () => {
    const user = userEvent.setup();
    const page = await DropDown({ slug: "test-slug" });
    render(page);

    expect(screen.getByText("I need help with")).toBeInTheDocument();

    const button = screen.getByText("Select");
    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Menu Item 1")).toBeInTheDocument();
    expect(screen.getByText("Menu Item 2")).toBeInTheDocument();
  });
});

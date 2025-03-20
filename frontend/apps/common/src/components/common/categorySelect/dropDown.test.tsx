import type { MenuItemsCollection } from "#types/common/categorySelect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import WebsiteDropDown from "./dropDown";

const mockMenuCollection: MenuItemsCollection = {
  items: [
    {
      categoryName: "Test 1",
      sys: {
        id: "1111",
      },
    },
    {
      categoryName: "Test 2",
      sys: {
        id: "2222",
      },
    },
    {
      categoryName: "Test 3",
      sys: {
        id: "3333",
      },
    },
  ],
};

vi.mock("server-only", () => {
  return {};
});

describe("DropDown", () => {
  it("should render the Dropdown with options", async () => {
    const user = userEvent.setup();
    render(<WebsiteDropDown items={mockMenuCollection.items} />);

    expect(screen.getByText("I need help with")).toBeInTheDocument();

    const button = screen.getByText("Select");
    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Test 1")).toBeInTheDocument();
    expect(screen.getByText("Test 2")).toBeInTheDocument();
    expect(screen.getByText("Test 3")).toBeInTheDocument();
  });
});

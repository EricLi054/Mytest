import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import FooterSearchBar from ".";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
}));

describe("FooterSearchBar", () => {
  it("should route to search page after click", async () => {
    render(<FooterSearchBar placeholderText="Test" />);
    const searchInput = screen.getByPlaceholderText<HTMLInputElement>("Test");
    const searchButton = screen.getByRole("button", { name: "Search" });

    await userEvent.type(searchInput, "example");
    await userEvent.click(searchButton);

    expect(pushMock).toHaveBeenCalledWith("/search#/searchresult?query=example");
  });
});

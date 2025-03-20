import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import HeaderSearchBar from ".";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
}));

describe("HeaderSearchBar", () => {
  it("should update the search term when input value changes", async () => {
    render(<HeaderSearchBar placeholder="Search" />);

    const inputElement = screen.getByPlaceholderText<HTMLInputElement>("Search");
    const searchButton = screen.getByRole("button");

    await userEvent.type(inputElement, "example");
    await userEvent.click(searchButton);

    expect(pushMock).toHaveBeenCalledWith("/search#/searchresult?query=example");
  });
});

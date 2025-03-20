import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "#utils/analyticsTagging";
import { describe, expect, it, vi } from "vitest";

import type { DropdownButtonProps } from "./types";
import DropdownButton from ".";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

describe("DropdownButton", () => {
  it("should render and open a dropdown button", async () => {
    const dropdownProps: DropdownButtonProps = {
      primaryLabel: "Manage",
      menuItems: [
        {
          label: "First Item",
          link: "/",
        },
      ],
    };
    render(
      <DropdownButton primaryLabel={dropdownProps.primaryLabel} menuItems={dropdownProps.menuItems}>
        Manage
      </DropdownButton>,
    );

    const dropdown = screen.getByText("Manage");
    await userEvent.click(dropdown);

    const firstLink = screen.getByText("First Item");

    expect(firstLink).toBeVisible();

    await userEvent.click(firstLink);

    expect(vi.mocked(logEvent)).toHaveBeenCalledTimes(2);
  });
});

import type { Mock } from "vitest";
import { usePathname } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Navbar from "./navbar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("Navbar", () => {
  it("should be able to render", () => {
    (usePathname as Mock).mockReturnValue("/test-path");

    render(
      <Navbar
        categories={[
          {
            name: "RAC",
            slug: "rac",
            colour: "red",
          },
          {
            name: "Horizons",
            slug: "horizons",
            colour: "blue",
          },
          {
            name: "Test",
            slug: "test",
            colour: "green",
          },
        ]}
      />,
    );

    expect(screen.getAllByAltText("RAC Logo")[0]).toBeVisible();
    expect(screen.getAllByAltText("Horizons Logo")[0]).toBeVisible();
  });
});

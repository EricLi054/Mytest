import type { Mock } from "vitest";
import { usePathname } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Masthead from ".";

vi.mock("#components/horizons/cms/category/data", () => ({
  getCategories: vi.fn(() => ({
    data: {
      horizons_categoryCollection: {
        items: [
          { name: "Category 1", slug: "category-1", colour: "red", position: 1 },
          { name: "Category 2", slug: "category-2", colour: "blue", position: 2 },
        ],
      },
    },
  })),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("Masthead", () => {
  it("should fetch Masthead data and render", async () => {
    (usePathname as Mock).mockReturnValue("/test-path");

    const masthead = await Masthead();
    render(masthead);

    expect(screen.getAllByText("Category 1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Category 2")[0]).toBeInTheDocument();
  });
});

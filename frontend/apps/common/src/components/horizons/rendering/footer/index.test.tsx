import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Footer from ".";

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

describe("Footer", () => {
  it("should fetch Footer data and render", async () => {
    const footer = await Footer();
    render(footer);

    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
  });
});

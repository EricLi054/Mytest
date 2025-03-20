import { render, screen } from "@testing-library/react";
import { TestArticle, TestCategory } from "#testing/data/testData";
import { describe, expect, it, vi } from "vitest";

import FilterableContent from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getFilterableContent: vi.fn(() => ({
    data: {
      horizons_filterableContent: {
        title: "Featured Content Title",
        slug: "featured-content-item",
        sectionColour: "White",
        category: TestCategory,
        heading: "Recommended",
        showTagFilters: true,
        showCategoryOnCard: true,
        contentfulMetadata: {
          tags: [
            {
              id: "tagA",
              name: "Tag A",
            },
            {
              id: "tagB",
              name: "Tag B",
            },
          ],
        },
      },
    },
  })),
}));

vi.mock("./getArticlesFromTags", () => ({
  getArticlesFromTags: vi.fn(() => ({
    data: {
      horizons_articleCollection: {
        items: {
          ...TestArticle,
        },
      },
    },
  })),
}));

vi.mock("./getArticlesFromCategory", () => ({
  getArticlesFromCategory: vi.fn(() => ({
    data: {
      horizons_articleCollection: {
        items: {
          ...TestArticle,
        },
      },
    },
  })),
}));

describe("FilterableContent", () => {
  it("should fetch Filterable Content data and render", async () => {
    const filterableContent = await FilterableContent({ data: { sys: { id: "1234" } } });
    render(filterableContent);

    expect(screen.getByText("Recommended")).toBeInTheDocument();
  });
});

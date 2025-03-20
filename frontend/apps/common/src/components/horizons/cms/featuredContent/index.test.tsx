import { render, screen } from "@testing-library/react";
import { TestArticle, TestCategory } from "#testing/data/testData";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FeaturedContent from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getFeaturedContent: vi.fn(() => ({
    data: {
      horizons_featuredContent: {
        title: "Featured Content Title",
        slug: "featured-content-item",
        sectionColour: "White",
        category: TestCategory,
        heading: "Recommended",
        cardType: "Article",
        rendering: "Carousel",
        showCategoryOnCard: true,
        articlesCollection: {
          items: [{ ...TestArticle }],
        },
      },
    },
  })),
}));

vi.mock("../youtubeEmbed/data", () => ({
  getYoutubeEmbed: vi.fn(),
}));

describe("FeaturedContent", () => {
  beforeEach(() => {
    global.window.matchMedia = vi.fn(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("should fetch Featured Content data and render", async () => {
    const props = { data: { sys: { id: "1234" } } };

    render(await FeaturedContent(props));

    expect(screen.getByText("Recommended")).toBeInTheDocument();
  });
});

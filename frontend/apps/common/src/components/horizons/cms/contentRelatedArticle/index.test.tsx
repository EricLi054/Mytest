import { render } from "@testing-library/react";
import { TestArticle } from "#testing/data/testData";
import { describe, expect, it, vi } from "vitest";

import ContentRelatedArticle from ".";

vi.mock("../article/data", () => ({
  getArticle: vi.fn(() => ({
    data: {
      horizons_article: TestArticle,
    },
  })),
}));

describe("ContentRelatedArticle", () => {
  it("should fetch article data and render simple article list item", async () => {
    const component = await ContentRelatedArticle({
      relatedArticleRendering: "simple",
      data: { sys: { id: "1234" } },
    });
    render(component);

    expect(component).toBeDefined();
  });

  it("should fetch article data and render content related article", async () => {
    const component = await ContentRelatedArticle({
      relatedArticleRendering: "advanced",
      data: { sys: { id: "1234" } },
    });
    render(component);

    expect(component).toBeDefined();
  });
});

import type { Article } from "#types/horizons/article";
import { render, screen } from "@testing-library/react";
import { TestArticle, TestCategory } from "#testing/data/testData";
import { describe, expect, it, vi } from "vitest";

import ArticleGrid from ".";

vi.mock("../../rendering/articleCard", () => ({
  default: ({ article, showCategoryOnCard }: { article: Article; showCategoryOnCard: boolean }) => (
    <div data-testid="article-card">
      <span>{article.title}</span>
      <span>{showCategoryOnCard ? article.category.name : ""}</span>
    </div>
  ),
}));

vi.mock("../../rendering/articleWithRichMediaCard", () => ({
  default: ({ article }: { article: Article }) => (
    <div data-testid="article-podcast-card">
      <span>{article.title}</span>
    </div>
  ),
}));

vi.mock("./styles", () => ({
  styles: {
    gridCategoryHeader: vi.fn().mockReturnValue({ mockStyle: true }),
  },
}));

describe("ArticleGrid", () => {
  const mockArticles: Article[] = [{ ...TestArticle }];

  it("should render the heading with the correct category styles", () => {
    render(
      <ArticleGrid
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        showCategoryOnCard={true}
        sectionColour="White"
      />,
    );

    const heading = screen.getByRole("heading", { name: /category heading/i });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Category Heading");
  });

  it("should render ArticleCard components for each article when cardType is 'Article'", () => {
    render(
      <ArticleGrid
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        showCategoryOnCard={true}
        sectionColour="Grey"
      />,
    );

    const articleCards = screen.getAllByTestId("article-card");

    expect(articleCards).toHaveLength(mockArticles.length);
    expect(articleCards[0]).toHaveTextContent("Article Title");
  });

  it("should render ArticleWithRichMediaCard components for each article when cardType is 'Podcast'", () => {
    render(
      <ArticleGrid
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article with Rich Media"
        showCategoryOnCard={true}
        sectionColour="White"
      />,
    );

    const podcastCards = screen.getAllByTestId("article-podcast-card");

    expect(podcastCards).toHaveLength(mockArticles.length);
    expect(podcastCards[0]).toHaveTextContent("Article Title");
  });

  it("should render ArticleCard by default when cardType is empty", () => {
    render(
      <ArticleGrid
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType=""
        showCategoryOnCard={true}
        sectionColour="Grey"
      />,
    );

    const articleCards = screen.getAllByTestId("article-card");

    expect(articleCards).toHaveLength(mockArticles.length);
  });

  it("should handle an empty articles array gracefully", () => {
    render(
      <ArticleGrid
        category={TestCategory}
        heading="Category Heading"
        articles={[]}
        cardType="Article"
        showCategoryOnCard={true}
        sectionColour="White"
      />,
    );

    const articleCards = screen.queryByTestId("article-card");

    expect(articleCards).not.toBeInTheDocument();
  });
});

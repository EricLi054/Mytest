import type { Article } from "#types/horizons/article";
import { render, screen } from "@testing-library/react";
import { TestArticle, TestCategory } from "#testing/data/testData";
import { describe, expect, it, vi } from "vitest";

import ArticleGridWithList from ".";

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

vi.mock("../../rendering/simpleArticleListItem", () => ({
  default: ({ article }: { article: Article }) => (
    <div data-testid="simple-article-list-item">
      <span>{article.title}</span>
    </div>
  ),
}));

vi.mock("./styles", () => ({
  styles: {
    gridWithListCategoryHeader: vi.fn().mockReturnValue({ mockStyle: true }),
  },
}));

describe("ArticleGridWithList", () => {
  const mockArticles: Article[] = [{ ...TestArticle }, { ...TestArticle }, { ...TestArticle }, { ...TestArticle }];

  it("should render the heading with the correct category styles", () => {
    render(
      <ArticleGridWithList
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        showCategoryOnCard={true}
        seeMoreButtonText="See More"
        seeMoreButtonUrl="#"
        sectionColour="White"
      />,
    );

    const heading = screen.getByRole("heading", { name: /category heading/i });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Category Heading");
  });

  it("should render TWO articles in the grid on non-mobile screens", () => {
    render(
      <ArticleGridWithList
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        showCategoryOnCard={true}
        seeMoreButtonText="See More"
        seeMoreButtonUrl="#"
        sectionColour="White"
      />,
    );

    const articleCards = screen.getAllByTestId("article-card");

    expect(articleCards).toHaveLength(2);
  });

  it("should render ONE article in the grid on mobile screens", () => {
    render(
      <ArticleGridWithList
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        showCategoryOnCard={true}
        seeMoreButtonText="See More"
        seeMoreButtonUrl="#"
        sectionColour="White"
      />,
    );

    const articleCards = screen.getAllByTestId("article-card");

    expect(articleCards).toHaveLength(2);
  });

  it("should render the remaining articles in a list using SimpleArticleListItemRendering", () => {
    render(
      <ArticleGridWithList
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        showCategoryOnCard={true}
        seeMoreButtonText="See More"
        seeMoreButtonUrl="#"
        sectionColour="White"
      />,
    );

    const listItems = screen.getAllByTestId("simple-article-list-item");

    expect(listItems).toHaveLength(2);
  });

  it("should render the remaining articles correctly on mobile", () => {
    render(
      <ArticleGridWithList
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        showCategoryOnCard={true}
        seeMoreButtonText="See More"
        seeMoreButtonUrl="#"
        sectionColour="White"
      />,
    );

    const listItems = screen.getAllByTestId("simple-article-list-item");

    expect(listItems).toHaveLength(2);
  });

  it("should render ArticleWithRichMediaCard components for the first articles when cardType is 'Podcast'", () => {
    render(
      <ArticleGridWithList
        category={TestCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article with Rich Media"
        showCategoryOnCard={false}
        seeMoreButtonText="See More"
        seeMoreButtonUrl="#"
        sectionColour="White"
      />,
    );

    const podcastCards = screen.getAllByTestId("article-podcast-card");

    expect(podcastCards).toHaveLength(2);
  });

  it("should handle an empty articles array gracefully", () => {
    render(
      <ArticleGridWithList
        category={TestCategory}
        heading="Category Heading"
        articles={[]}
        cardType="Article"
        showCategoryOnCard={true}
        seeMoreButtonText="See More"
        seeMoreButtonUrl="#"
        sectionColour="White"
      />,
    );

    const articleCards = screen.queryByTestId("article-card");
    const listItems = screen.queryByTestId("simple-article-list-item");

    expect(articleCards).not.toBeInTheDocument();
    expect(listItems).not.toBeInTheDocument();
  });
});

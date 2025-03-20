import type { Article } from "#types/horizons/article";
import type { Category } from "#types/horizons/category";
import { render, screen } from "@testing-library/react";
import { TestArticle } from "#testing/data/testData";
import { describe, expect, it, vi } from "vitest";

import ArticleGridWithSeeMoreButton from ".";

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

vi.mock("../../rendering/videoCarouselCard", () => ({
  default: ({ article, category }: { article: Article; category: Category }) => (
    <div data-testid="article-video-card">
      <span>{article.title}</span>
      <span>{category.name}</span>
    </div>
  ),
}));

vi.mock("./styles", () => ({
  styles: {
    gridWithSeeMoreButtonCategoryHeader: vi.fn().mockReturnValue({ mockStyle: true }),
    seeMoreButton: { mockStyle: true },
  },
}));

describe("ArticleGridWithSeeMoreButton", () => {
  const mockArticles: Article[] = [
    { ...TestArticle, title: "Article 1" },
    { ...TestArticle, title: "Article 2" },
    { ...TestArticle, title: "Article 3" },
    { ...TestArticle, title: "Article 4" },
  ];

  const mockCategory: Category = {
    name: "Drive",
    slug: "drive",
    colour: "Red",
  };

  it("should render the heading with the correct category styles", () => {
    render(
      <ArticleGridWithSeeMoreButton
        category={mockCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        seeMoreButtonText="See More"
        seeMoreButtonUrl="/see-more"
        showCategoryOnCard={true}
        sectionColour="White"
      />,
    );

    const heading = screen.getByRole("heading", { name: /category heading/i });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Category Heading");
  });

  it("should render the See More button with the correct text and link", () => {
    render(
      <ArticleGridWithSeeMoreButton
        category={mockCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        seeMoreButtonText="See More"
        seeMoreButtonUrl="/see-more"
        showCategoryOnCard={true}
        sectionColour="White"
      />,
    );

    const seeMoreButton = screen.getByRole("button", { name: /see more/i });

    expect(seeMoreButton).toBeInTheDocument();
    expect(seeMoreButton).toHaveAttribute("href", "/see-more");
  });

  it("should render ArticleCard components for each article when cardType is 'Article'", () => {
    render(
      <ArticleGridWithSeeMoreButton
        category={mockCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article"
        seeMoreButtonText="See More"
        seeMoreButtonUrl="/see-more"
        showCategoryOnCard={true}
        sectionColour="White"
      />,
    );

    const articleCards = screen.getAllByTestId("article-card");

    expect(articleCards).toHaveLength(mockArticles.length);
    expect(articleCards[0]).toHaveTextContent("Article 1");
  });

  it("should render ArticleWithRichMediaCard components when cardType is 'Podcast'", () => {
    render(
      <ArticleGridWithSeeMoreButton
        category={mockCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType="Article with Rich Media"
        seeMoreButtonText="See More"
        seeMoreButtonUrl="/see-more"
        showCategoryOnCard={true}
        sectionColour="White"
      />,
    );

    const podcastCards = screen.getAllByTestId("article-podcast-card");

    expect(podcastCards).toHaveLength(mockArticles.length);
    expect(podcastCards[0]).toHaveTextContent("Article 1");
  });

  it("should render ArticleCard by default when cardType is empty", () => {
    render(
      <ArticleGridWithSeeMoreButton
        category={mockCategory}
        heading="Category Heading"
        articles={mockArticles}
        cardType=""
        seeMoreButtonText="See More"
        seeMoreButtonUrl="/see-more"
        showCategoryOnCard={true}
        sectionColour="White"
      />,
    );

    const articleCards = screen.getAllByTestId("article-card");

    expect(articleCards).toHaveLength(mockArticles.length);
  });

  it("should handle an empty articles array gracefully", () => {
    render(
      <ArticleGridWithSeeMoreButton
        category={mockCategory}
        heading="Category Heading"
        articles={[]}
        cardType="Article"
        seeMoreButtonText="See More"
        seeMoreButtonUrl="/see-more"
        showCategoryOnCard={true}
        sectionColour="White"
      />,
    );

    const articleCards = screen.queryByTestId("article-card");

    expect(articleCards).not.toBeInTheDocument();
  });
});

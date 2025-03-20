import { render, screen } from "@testing-library/react";
import { calculateReadingTime } from "#utils/common/calculateReadingTime";
import { describe, expect, it, vi } from "vitest";

import ContentRelatedArticleRendering from ".";
import { TestArticle } from "../../../../testing/data/testData";

vi.mock("#utils/common/calculateReadingTime", () => ({
  calculateReadingTime: vi.fn(() => "5 min read"),
}));

describe("ContentRelatedArticleRendering", () => {
  const mockArticle = TestArticle;

  it("should render the related heading", () => {
    render(
      <ContentRelatedArticleRendering article={mockArticle} showRelatedHeading={true} showCategoryOnCard={true} />,
    );

    expect(screen.getByText("RELATED")).toBeInTheDocument();
  });

  it("should not render the related heading", () => {
    render(
      <ContentRelatedArticleRendering article={mockArticle} showRelatedHeading={false} showCategoryOnCard={false} />,
    );

    expect(screen.queryByText("RELATED")).not.toBeInTheDocument();
  });

  it("should render the article image with correct styles", () => {
    render(
      <ContentRelatedArticleRendering article={mockArticle} showRelatedHeading={true} showCategoryOnCard={true} />,
    );
    const imageElement = screen.getByRole("img", { hidden: true });

    expect(imageElement).toHaveStyle(
      `background-image: url(https://res.rac.com.au/rac-horizons/image/upload/f_auto/q_auto:eco/v1742261818/600x400_je8zve.svg)`,
    );
  });

  it("should render the article category", () => {
    render(
      <ContentRelatedArticleRendering article={mockArticle} showRelatedHeading={true} showCategoryOnCard={true} />,
    );

    expect(screen.getByText("Drive")).toBeInTheDocument();
  });

  it("should render the reading time calculated from content", () => {
    render(
      <ContentRelatedArticleRendering article={mockArticle} showRelatedHeading={true} showCategoryOnCard={true} />,
    );

    expect(screen.getByText(/5 min read/i)).toBeInTheDocument();
    expect(calculateReadingTime).toHaveBeenCalledWith(mockArticle.content.json);
  });

  it("should render the article title as a link", () => {
    render(
      <ContentRelatedArticleRendering article={mockArticle} showRelatedHeading={true} showCategoryOnCard={false} />,
    );
    const linkElement = screen.getByRole("link");

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/horizons/drive/test-article");
  });
});

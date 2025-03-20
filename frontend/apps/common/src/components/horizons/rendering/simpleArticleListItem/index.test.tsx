import type { Article } from "#types/horizons/article";
import { render, screen } from "@testing-library/react";
import { TestArticle } from "#testing/data/testData";
import { calculateReadingTime } from "#utils/common/calculateReadingTime";
import { describe, expect, it, vi } from "vitest";

import SimpleArticleListItemRendering from ".";

vi.mock("#utils/common/calculateReadingTime", () => ({
  calculateReadingTime: vi.fn(),
}));

describe("SimpleArticleListItemRendering", () => {
  const mockArticle: Article = {
    ...TestArticle,
  };

  it("should render the article title as a link", () => {
    render(<SimpleArticleListItemRendering article={mockArticle} showCategoryOnCard={false} />);
    const linkElement = screen.getByRole("link", { name: /Article Title/i });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", `/horizons/${mockArticle.slug}`);
  });

  it("should display the reading time", () => {
    vi.mocked(calculateReadingTime).mockReturnValue("5 min read");
    render(<SimpleArticleListItemRendering article={mockArticle} showCategoryOnCard={true} />);

    expect(screen.getByText(/5 min read/i)).toBeInTheDocument();
    expect(calculateReadingTime).toHaveBeenCalledWith(mockArticle.content.json);
  });

  it("should render the AccessTimeIcon", () => {
    render(<SimpleArticleListItemRendering article={mockArticle} showCategoryOnCard={false} />);
    const iconElement = screen.getByTestId("AccessTimeIcon");

    expect(iconElement).toBeInTheDocument();
  });
});

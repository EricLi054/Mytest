import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ArticleGridWithListSkeleton from "./articleGridWithListSkeleton";

describe("ArticleGridWithListSkeleton", () => {
  it("should render the main grid skeleton container", () => {
    render(<ArticleGridWithListSkeleton />);

    const gridSkeleton = screen.getByTestId("article-grid-with-list-skeleton");

    expect(gridSkeleton).toBeInTheDocument();
  });

  it("should render the heading and red line skeletons", () => {
    render(<ArticleGridWithListSkeleton />);

    const headingSkeleton = screen.getByTestId("skeleton-heading");
    const redLineSkeleton = screen.getByTestId("skeleton-red-line");

    expect(headingSkeleton).toBeInTheDocument();
    expect(redLineSkeleton).toBeInTheDocument();
  });

  it("should render the content grid container", () => {
    render(<ArticleGridWithListSkeleton />);

    const contentGrid = screen.getByTestId("article-grid-container");

    expect(contentGrid).toBeInTheDocument();
  });

  it("should render the left-side article grid with article card skeletons", () => {
    render(<ArticleGridWithListSkeleton />);

    const leftGrid = screen.getByTestId("left-article-grid");

    expect(leftGrid).toBeInTheDocument();

    const articleCards = screen.getAllByTestId("article-card-skeleton-grid");

    expect(articleCards.length).toBe(2);
  });

  it("should render the right-side list with skeleton items", () => {
    render(<ArticleGridWithListSkeleton />);

    const rightGrid = screen.getByTestId("right-article-list");

    expect(rightGrid).toBeInTheDocument();

    const listItems = screen.getAllByTestId("list-skeleton-item");

    expect(listItems.length).toBe(3);

    const listTitles = screen.getAllByTestId("skeleton-list-title");
    const listSubtitles = screen.getAllByTestId("skeleton-list-subtitle");

    expect(listTitles.length).toBe(3);
    expect(listSubtitles.length).toBe(3);
  });

  it("should render the 'Load More' button skeleton", () => {
    render(<ArticleGridWithListSkeleton />);

    const loadMoreSkeleton = screen.getByTestId("skeleton-load-more");

    expect(loadMoreSkeleton).toBeInTheDocument();
  });
});

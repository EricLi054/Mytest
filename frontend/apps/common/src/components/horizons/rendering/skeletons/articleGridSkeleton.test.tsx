import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ArticleGridSkeleton from "./articleGridSkeleton";

describe("ArticleGridSkeleton", () => {
  it("should render the main grid skeleton container", () => {
    render(<ArticleGridSkeleton />);

    const gridSkeleton = screen.getByTestId("article-grid-skeleton");

    expect(gridSkeleton).toBeInTheDocument();
  });

  it("should render the heading and subheading skeletons", () => {
    render(<ArticleGridSkeleton />);

    const headingSkeleton = screen.getByTestId("skeleton-heading");
    const subheadingSkeleton = screen.getByTestId("skeleton-subheading");

    expect(headingSkeleton).toBeInTheDocument();
    expect(subheadingSkeleton).toBeInTheDocument();
  });

  it("should render the grid container for article cards", () => {
    render(<ArticleGridSkeleton />);

    const gridContainer = screen.getByTestId("article-grid-container");

    expect(gridContainer).toBeInTheDocument();
  });

  it("should render the correct number of article card skeletons", () => {
    render(<ArticleGridSkeleton />);

    const articleCardGrids = screen.getAllByTestId("article-card-skeleton-grid");

    expect(articleCardGrids.length).toBe(6);
  });
});

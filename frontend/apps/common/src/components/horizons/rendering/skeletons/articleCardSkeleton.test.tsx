import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ArticleCardSkeleton from "./articleCardSkeleton";

describe("ArticleCardSkeleton", () => {
  it("should render the correct number of skeletons", () => {
    const count = 3;
    render(<ArticleCardSkeleton count={count} xs={12} sm={6} md={4} />);

    const skeletonImages = screen.getAllByTestId("skeleton-image");

    expect(skeletonImages.length).toBe(count);

    const skeletonTitles = screen.getAllByTestId("skeleton-title");

    expect(skeletonTitles.length).toBe(count);

    const skeletonSubtitles = screen.getAllByTestId("skeleton-subtitle");

    expect(skeletonSubtitles.length).toBe(count);

    const skeletonTexts = screen.getAllByTestId("skeleton-text");

    expect(skeletonTexts.length).toBe(count);
  });

  it("should apply the correct grid size props", () => {
    render(<ArticleCardSkeleton count={1} xs={12} sm={6} md={4} />);

    const gridElements = screen.getAllByTestId("article-card-skeleton-grid");

    expect(gridElements.length).toBe(1);
  });

  it("should render rectangular skeleton for the image", () => {
    render(<ArticleCardSkeleton count={1} xs={12} sm={6} md={4} />);
    const skeletonImage = screen.getByTestId("skeleton-image");

    expect(skeletonImage).toBeInTheDocument();
  });

  it("should render text skeletons with correct widths", () => {
    render(<ArticleCardSkeleton count={1} xs={12} sm={6} md={4} />);

    expect(screen.getByTestId("skeleton-title")).toHaveStyle("width: 80%");
    expect(screen.getByTestId("skeleton-subtitle")).toHaveStyle("width: 50%");
    expect(screen.getByTestId("skeleton-text")).toHaveStyle("width: 40%");
  });
});

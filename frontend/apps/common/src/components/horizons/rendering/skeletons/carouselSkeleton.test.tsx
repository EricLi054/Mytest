import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CarouselSkeleton from "./carouselSkeleton";

describe("CarouselSkeleton", () => {
  it("should render the main carousel skeleton container", () => {
    render(<CarouselSkeleton />);

    const carouselSkeleton = screen.getByTestId("carousel-skeleton");

    expect(carouselSkeleton).toBeInTheDocument();
  });

  it("should render the heading and red underline skeletons", () => {
    render(<CarouselSkeleton />);

    const headingSkeleton = screen.getByTestId("skeleton-heading");
    const redLineSkeleton = screen.getByTestId("skeleton-red-line");

    expect(headingSkeleton).toBeInTheDocument();
    expect(redLineSkeleton).toBeInTheDocument();
  });

  it("should render the article card skeletons for each breakpoint", () => {
    render(<CarouselSkeleton />);

    const xsGrid = screen.getByTestId("carousel-breakpoint-xs");
    const smGrid = screen.getByTestId("carousel-breakpoint-sm");
    const mdGrid = screen.getByTestId("carousel-breakpoint-md");

    expect(xsGrid).toBeInTheDocument();
    expect(smGrid).toBeInTheDocument();
    expect(mdGrid).toBeInTheDocument();

    const xsArticles = screen.getAllByTestId("article-card-skeleton-grid");

    expect(xsArticles.length).toBeGreaterThanOrEqual(1);
  });

  it("should render the pagination skeletons", () => {
    render(<CarouselSkeleton />);

    const paginationContainer = screen.getByTestId("skeleton-pagination");

    expect(paginationContainer).toBeInTheDocument();

    const paginationDots = screen.getAllByTestId("skeleton-pagination-dot");

    expect(paginationDots.length).toBe(3);
  });
});

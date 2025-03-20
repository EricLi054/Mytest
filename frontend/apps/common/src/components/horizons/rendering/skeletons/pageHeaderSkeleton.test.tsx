import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PageHeaderSkeleton from "./pageHeaderSkeleton";

describe("PageHeaderSkeleton", () => {
  it("should render the main page header skeleton container", () => {
    render(<PageHeaderSkeleton />);

    const headerSkeleton = screen.getByTestId("page-header-skeleton");

    expect(headerSkeleton).toBeInTheDocument();
  });

  it("should render the heading skeleton", () => {
    render(<PageHeaderSkeleton />);

    const headingSkeleton = screen.getByTestId("skeleton-heading");

    expect(headingSkeleton).toBeInTheDocument();
  });

  it("should render exactly three paragraph skeleton lines", () => {
    render(<PageHeaderSkeleton />);

    const skeletonLines = [
      screen.getByTestId("skeleton-line-0"),
      screen.getByTestId("skeleton-line-1"),
      screen.getByTestId("skeleton-line-2"),
    ];

    skeletonLines.forEach((line) => expect(line).toBeInTheDocument());

    expect(skeletonLines.length).toBe(3);
  });
});

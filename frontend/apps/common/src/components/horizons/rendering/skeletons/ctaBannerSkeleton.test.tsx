import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CTABannerSkeleton from "./ctaBannerSkeleton";

describe("CTABannerSkeleton", () => {
  it("should render the main CTA banner skeleton container", () => {
    render(<CTABannerSkeleton />);

    const bannerSkeleton = screen.getByTestId("cta-banner-skeleton");

    expect(bannerSkeleton).toBeInTheDocument();
  });

  it("should render the background skeleton", () => {
    render(<CTABannerSkeleton />);

    const backgroundSkeleton = screen.getByTestId("skeleton-background");

    expect(backgroundSkeleton).toBeInTheDocument();
  });

  it("should render the overlay skeleton", () => {
    render(<CTABannerSkeleton />);

    const overlaySkeleton = screen.getByTestId("skeleton-overlay");

    expect(overlaySkeleton).toBeInTheDocument();
  });

  it("should render the category, heading, subtext, and CTA button skeletons", () => {
    render(<CTABannerSkeleton />);

    expect(screen.getByTestId("skeleton-category")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-heading")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-subtext-1")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-subtext-2")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-cta-button")).toBeInTheDocument();
  });

  it("should render content positioned on the left by default", () => {
    render(<CTABannerSkeleton />);

    const leftContent = screen.getByTestId("cta-content-left");

    expect(leftContent).toBeInTheDocument();
  });

  it("should render content positioned on the right when specified", () => {
    render(<CTABannerSkeleton contentPosition="Right" />);

    const rightContent = screen.getByTestId("cta-content-right");

    expect(rightContent).toBeInTheDocument();
  });
});

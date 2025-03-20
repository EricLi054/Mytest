import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProductCardSkeleton from ".";

describe("Product Card Skeleton", () => {
  it("should render the loading skeleton", () => {
    render(<ProductCardSkeleton />);

    const headers = screen.getAllByTestId("product-card-skeleton-header");

    expect(headers.length).toBe(2);
    expect(headers.at(0)).toBeInTheDocument();
    expect(headers.at(1)).toBeInTheDocument();

    const actions = screen.getAllByTestId("product-card-skeleton-actions");

    expect(actions.length).toBe(2);
    expect(actions.at(0)).toBeInTheDocument();
    expect(actions.at(1)).toBeInTheDocument();

    const details = screen.getAllByTestId("product-card-skeleton-details");

    expect(details.length).toBe(2);
    expect(details.at(0)).toBeInTheDocument();
    expect(details.at(1)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { logEvent } from "#utils/analyticsTagging";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { GraphQLError, PartialResultsError } from "./types";
import DashboardSystemError from ".";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

vi.mock("./index.styled", () => ({
  default: () => <div>Mocked DashboardAlertNotification</div>,
}));

describe("DashboardPartialResultsNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render null if there are no errors", () => {
    const { container } = render(<DashboardSystemError errors={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render null if there are no partial results errors", () => {
    const errors: GraphQLError[] = [{ message: "error", extensions: { type: "OTHER_ERROR", systemKey: "key1" } }];

    const { container } = render(<DashboardSystemError errors={errors} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render DashboardAlertNotification if there are partial results errors", () => {
    const errors: PartialResultsError[] = [
      { extensions: { type: "PARTIAL_PRODUCT_RESULTS_ERROR", systemKey: "Finance", code: "something" } },
    ];
    render(<DashboardSystemError errors={errors} />);

    expect(screen.getByText("Mocked DashboardAlertNotification")).toBeInTheDocument();
    expect(logEvent).toHaveBeenCalledWith("System unavailable message - Fin");
  });

  it("should call useGTMLogSystemErrors with the correct system keys", () => {
    const errors = [
      { extensions: { type: "PARTIAL_PRODUCT_RESULTS_ERROR", systemKey: "FinOps" } },
      { extensions: { type: "PARTIAL_PRODUCT_RESULTS_ERROR", systemKey: "Finance" } },
    ];
    render(<DashboardSystemError errors={errors} />);

    expect(logEvent).toHaveBeenCalledWith("System unavailable message - Fin, FinOps");
  });

  it("should call useGTMLogSystemErrors with the correct system keys when there are multiple Shield Errors", () => {
    const errors = [
      { extensions: { type: "PARTIAL_PRODUCT_RESULTS_ERROR", systemKey: "FinOps" } },
      { extensions: { type: "PARTIAL_PRODUCT_RESULTS_ERROR", systemKey: "FinOps" } },
      { extensions: { type: "PARTIAL_PRODUCT_RESULTS_ERROR", systemKey: "Shield" } },
      { extensions: { type: "PARTIAL_PRODUCT_RESULTS_ERROR", systemKey: "Finance" } },
      { extensions: { type: "PARTIAL_PRODUCT_RESULTS_ERROR", systemKey: "Shield" } },
    ];
    render(<DashboardSystemError errors={errors} />);

    expect(logEvent).toHaveBeenCalledWith("System unavailable message - Fin, FinOps, Ins");
  });
});

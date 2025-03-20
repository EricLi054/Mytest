import { render } from "@testing-library/react";
import { expectGtmPageView } from "#testing/analytics";
import { describe, it, vi } from "vitest";

import Analytics from ".";

vi.mock("server-only", () => ({}));

const mockPathname = "/myRAC";
Object.defineProperty(window, "location", {
  value: { pathname: mockPathname },
  writable: true,
});

const mockTitle = "Welcome to myRAC";
Object.defineProperty(document, "title", {
  value: mockTitle,
  writable: true,
});

describe("Analytics", () => {
  it("should send GTM page view", () => {
    render(<Analytics />);

    expectGtmPageView(mockPathname, mockTitle);
  });
});

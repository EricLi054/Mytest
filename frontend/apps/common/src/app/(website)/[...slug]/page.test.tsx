import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWebsitePage } from "#testing/data/websiteTestData";
import { describe, expect, it, vi } from "vitest";

import { getWebsitePage } from "./data";
import Page from "./page";

// Mock data and utilities
vi.mock("./data", () => ({
  getWebsitePage: vi.fn(() => ({
    data: {
      rac_basePageCollection: {
        items: [
          {
            ...TestWebsitePage,
          },
        ],
      },
    },
  })),
}));

vi.mock("server-only", () => {
  return {};
});

describe("Home Page", () => {
  it("should render 404 if no matching content is found", async () => {
    // Mock getPageData to return empty data
    (getWebsitePage as Mock).mockResolvedValueOnce({
      data: {
        rac_basePageCollection: {
          items: [],
        },
      },
    });

    const slug = ["non-existent-slug"];

    const page = await Page({ params: Promise.resolve({ slug }) });
    render(page);

    expect(screen.getByText("We seem to be missing some parts")).toBeInTheDocument();
    expect(screen.getByText("Sorry, we can't find the page that you're looking for.")).toBeInTheDocument();
  });
});

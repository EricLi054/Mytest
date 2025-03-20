import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestPage } from "#testing/data/testData";
import { describe, expect, it, vi } from "vitest";

import { getHomePageData } from "./data";
import HorizonsHomePage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getHomePageData: vi.fn(() => ({
    data: {
      horizons_articleCollection: {
        items: [],
      },
      horizons_pageCollection: {
        items: [
          {
            ...TestPage,
          },
        ],
      },
    },
  })),
}));

describe("HorizonsHomePage", () => {
  it("should fetch page data and generate metadata for the home page", async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: "SEO Title",
      description: "SEO Description",
      authors: {
        name: "RACWA",
      },
      openGraph: {
        title: "Open Graph Title",
        description: "Open Graph Description",
        url: "https://www.rac.com.au",
        images: [
          {
            url: "https://res.rac.com.au/rac-horizons/image/upload/v1742261818/600x400_je8zve.svg",
            width: 800,
            height: 600,
            alt: "Open Graph Image",
          },
        ],
        siteName: "Open Graph Site Name",
      },
      other: {
        canonical: "https://rac.com.au/horizons/page-slug",
      },
      robots: {
        index: true,
        follow: true,
      },
    });
  });

  it("should render 404 if no matching content is found", async () => {
    (getHomePageData as Mock).mockResolvedValueOnce({
      data: {
        horizons_pageCollection: { items: [] },
      },
    });

    const page = await HorizonsHomePage();
    render(page);

    expect(screen.getByText("You've ventured beyond the horizon")).toBeInTheDocument();
  });
});

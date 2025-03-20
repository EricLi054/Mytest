import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestArticle, TestAuthor } from "#testing/data/testData";
import { describe, expect, it, vi } from "vitest";

import { getAuthorData } from "./data";
import AuthorPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getAuthorData: vi.fn(() => ({
    data: {
      horizons_authorCollection: {
        items: [TestAuthor],
      },
      horizons_articleCollection: {
        items: [
          {
            ...TestArticle,
          },
          {
            ...TestArticle,
          },
          {
            ...TestArticle,
          },
        ],
      },
    },
  })),
}));

describe("AuthorPage", () => {
  it("should fetch author data and generate metadata", async () => {
    const params = Promise.resolve({ slug: "test-author" });
    const metadata = await generateMetadata({ params });

    expect(metadata).toEqual({
      title: "Author Name",
      description: "Author Name",
      authors: {
        name: "Author Name",
      },
      openGraph: {
        title: "Author Name",
        description: "Author Name",
        url: "https://rac.com.au/horizons/authors/author-slug",
        images: [
          {
            url: "https://res.rac.com.au/rac-horizons/image/upload/v1742261818/600x400_je8zve.svg",
            width: 800,
            height: 600,
            alt: "Author Name",
          },
        ],
        siteName: "RACWA",
      },
      other: {
        canonical: "https://rac.com.au/horizons/authors/author-slug",
      },
      robots: {
        index: true,
        follow: true,
      },
    });
  });

  it("should render the AuthorPage with the author card and latest articles", async () => {
    const params = Promise.resolve({ slug: "author-slug" });
    const page = await AuthorPage({ params });

    render(page);

    expect(screen.getAllByText("Author Name")[0]).toBeInTheDocument();
    expect(screen.getAllByText("This is some bio text for an author")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Latest")[0]).toBeInTheDocument();
  });

  it("should render the NotFound component if no author is found", async () => {
    (getAuthorData as Mock).mockResolvedValueOnce({
      data: {
        horizons_authorCollection: {
          items: [],
        },
        horizons_articleCollection: {
          items: [],
        },
      },
    });

    const params = Promise.resolve({ slug: "non-existent-author" });
    const page = await AuthorPage({ params });

    render(page);

    expect(screen.getByText("You've ventured beyond the horizon")).toBeInTheDocument();
    expect(screen.getByText("Either you've gone too far or we moved the page.")).toBeInTheDocument();
  });
});

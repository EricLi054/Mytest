import type { Mock } from "vitest";
import { permanentRedirect } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { TestArticle, TestPage } from "#testing/data/testData";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPageData } from "./data";
import HorizonsArticlePage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getPageData: vi.fn(() => ({
    data: {
      horizons_articleCollection: {
        items: [
          {
            ...TestArticle,
          },
        ],
      },
      horizons_pageCollection: { items: [] },
    },
  })),
}));

vi.mock("#components/horizons/cms/article/data", () => ({
  getArticle: vi.fn(() => ({
    data: {
      horizons_article: {
        ...TestArticle,
      },
    },
  })),
}));

vi.mock("#utils/common/toKebabCase", () => ({
  toKebabCase: vi.fn((str: string) => str.toLowerCase().replace(/\s+/g, "-")),
}));

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn(),
}));

describe("HorizonsArticlePage", () => {
  const mockSpeak = vi.fn();
  const mockCancel = vi.fn();
  const mockGetVoices = vi.fn(() => [
    { lang: "en-US", name: "Aria", default: true },
    { lang: "en-GB", name: "Daniel", default: false },
  ]);

  const mockSpeechSynthesisUtterance = vi.fn();

  beforeEach(() => {
    global.window.speechSynthesis = {
      getVoices: mockGetVoices,
      speak: mockSpeak,
      cancel: mockCancel,
    } as unknown as SpeechSynthesis;

    global.window.SpeechSynthesisUtterance = mockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;
  });

  it("should fetch page data and generate metadata for an article", async () => {
    const params = Promise.resolve({ slug: ["test-article"] });

    const metadata = await generateMetadata({ params });

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
        canonical: "https://rac.com.au/horizons/drive/test-article",
      },
      robots: {
        index: true,
        follow: true,
      },
    });

    const page = await HorizonsArticlePage({ params: Promise.resolve({ slug: ["test-article"] }) });
    render(page);
  });

  it("should fetch page data and generate metadata for a dynamic content page", async () => {
    (getPageData as Mock).mockResolvedValue({
      data: {
        horizons_articleCollection: { items: [] },
        horizons_pageCollection: {
          items: [
            {
              ...TestPage,
            },
          ],
        },
      },
    });

    const params = Promise.resolve({ slug: ["drive", "test-page"] });

    const metadata = await generateMetadata({ params });

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

    const page = await HorizonsArticlePage({ params: Promise.resolve({ slug: ["drive", "test-page"] }) });
    render(page);
  });

  it("should render 404 if no matching content is found", async () => {
    (getPageData as Mock).mockResolvedValueOnce({
      data: {
        horizons_articleCollection: { items: [] },
        horizons_pageCollection: { items: [] },
      },
    });

    const slug = ["non-existent-slug"];

    const page = await HorizonsArticlePage({ params: Promise.resolve({ slug }) });
    render(page);

    expect(screen.getByText("You've ventured beyond the horizon")).toBeInTheDocument();
    expect(screen.getByText("Either you've gone too far or we moved the page.")).toBeInTheDocument();
  });

  it("should redirect to the specified URL if an article has a redirectUrl", async () => {
    const redirectUrl = "https://www.example.com/redirect";
    (getPageData as Mock).mockResolvedValueOnce({
      data: {
        horizons_articleCollection: {
          items: [
            {
              ...TestArticle,
              redirectUrl,
            },
          ],
        },
        horizons_pageCollection: { items: [] },
      },
    });

    const params = Promise.resolve({ slug: ["redirect-article"] });

    await HorizonsArticlePage({ params });

    expect(permanentRedirect).toHaveBeenCalledWith(redirectUrl);
  });
});

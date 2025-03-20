import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ArticleCarousel from ".";
import { TestArticle, TestCategory } from "../../../../testing/data/testData";

describe("ArticleContent", () => {
  beforeEach(() => {
    global.window.matchMedia = vi.fn(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("should render carousel with Article cards", () => {
    render(
      <ArticleCarousel
        category={TestCategory}
        heading="Trending"
        articles={[TestArticle]}
        cardType="Article"
        showCategoryOnCard={true}
        showViewAllButton={false}
        viewAllButtonLink=""
        sectionColour="White"
      />,
    );

    expect(screen.getByText(TestArticle.title ?? "")).toBeInTheDocument();
  });

  it("should render carousel with Podcast cards", () => {
    render(
      <ArticleCarousel
        category={TestCategory}
        heading="Recommended"
        articles={[TestArticle]}
        cardType="Article with Rich Media"
        showCategoryOnCard={false}
        showViewAllButton={true}
        viewAllButtonLink="https://rac.com.au"
        sectionColour="Grey"
      />,
    );

    expect(screen.getByText(TestArticle.title ?? "")).toBeInTheDocument();
  });

  it("should render default carousel with Article cards", () => {
    render(
      <ArticleCarousel
        category={TestCategory}
        heading="Default"
        articles={[TestArticle]}
        cardType=""
        showCategoryOnCard={true}
        showViewAllButton={false}
        viewAllButtonLink=""
        sectionColour="White"
      />,
    );

    expect(screen.getByText(TestArticle.title ?? "")).toBeInTheDocument();
  });
});

import type { FilterableContentProps } from "#types/horizons/filterableContent";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestArticle, TestCategory } from "#testing/data/testData";
import { describe, expect, it } from "vitest";

import FilterableContentRendering from "./filterableContent";

const mockArticles = Array.from({ length: 30 }, (_) => ({
  ...TestArticle,
}));

const mockFilterableContent: FilterableContentProps = {
  title: "Filterable Content",
  slug: "filterable-content",
  heading: "Test Articles",
  sectionColour: "White",
  category: TestCategory,
  filterBy: "Tags",
  showTagFilters: true,
  showCategoryOnCard: true,
  contentfulMetadata: {
    tags: [
      { name: "Tag A", id: "tagA" },
      { name: "Tag B", id: "tagB" },
    ],
  },
};

const mockFilterableContentWithNoTagFilters: FilterableContentProps = {
  ...mockFilterableContent,
  showTagFilters: false,
  showCategoryOnCard: false,
};

describe("FilterableContentRendering Component", () => {
  const renderComponent = () => {
    render(<FilterableContentRendering filterableContent={mockFilterableContent} articles={mockArticles} />);
  };

  it("should render the first 9 articles on load", () => {
    renderComponent();
    const articles = screen.getAllByRole("article");

    expect(articles.length).toBe(9);
  });

  it("should display 3 more articles on first 'Load more' click", async () => {
    renderComponent();
    const loadMoreButton = screen.getByRole("button", { name: /Load more/i });
    await userEvent.click(loadMoreButton);

    const articles = screen.getAllByRole("article");

    expect(articles.length).toBe(12);
  });

  it("should display 3 more articles on second 'Load more' click", async () => {
    renderComponent();
    const loadMoreButton = screen.getByRole("button", { name: /Load more/i });
    await userEvent.click(loadMoreButton);
    await userEvent.click(loadMoreButton);

    const articles = screen.getAllByRole("article");

    expect(articles.length).toBe(15);
  });

  it("should display all articles and hide 'Load more' button after all items are visible", async () => {
    renderComponent();
    const loadMoreButton = screen.getByRole("button", { name: /Load more/i });

    for (let i = 0; i < 7; i++) {
      await userEvent.click(loadMoreButton);
    }

    const articles = screen.getAllByRole("article");

    expect(articles.length).toBe(30);

    expect(screen.queryByRole("button", { name: /Load more/i })).not.toBeInTheDocument();
  });

  it("should filter articles when a tag is selected", async () => {
    renderComponent();
    const tagAChip = screen.getByText("Tag A");
    await userEvent.click(tagAChip);

    const filteredArticles = screen.getAllByText(/Article Title/);

    expect(filteredArticles.length).toBeGreaterThan(0);

    filteredArticles.forEach((article) => {
      expect(article.textContent).toMatch(/Article Title/);
    });
  });

  it("should clear filters and show first 9 articles when a tag is deselected", async () => {
    renderComponent();
    const tagAChip = screen.getByText("Tag A");

    await userEvent.click(tagAChip);
    await userEvent.click(tagAChip);

    const articles = screen.getAllByRole("article");

    expect(articles.length).toBe(9);
  });
});

describe("FilterableContentRendering Component without Tag Filters", () => {
  const renderComponent = () => {
    render(
      <FilterableContentRendering filterableContent={mockFilterableContentWithNoTagFilters} articles={mockArticles} />,
    );
  };

  it("should render the first 9 articles on load", () => {
    renderComponent();
    const articles = screen.getAllByRole("article");

    expect(articles.length).toBe(9);
  });

  it("should display 3 more articles on first 'Load more' click", async () => {
    renderComponent();
    const loadMoreButton = screen.getByRole("button", { name: /Load more/i });
    await userEvent.click(loadMoreButton);

    const articles = screen.getAllByRole("article");

    expect(articles.length).toBe(12);
  });

  it("should display 3 more articles on second 'Load more' click", async () => {
    renderComponent();
    const loadMoreButton = screen.getByRole("button", { name: /Load more/i });
    await userEvent.click(loadMoreButton);
    await userEvent.click(loadMoreButton);

    const articles = screen.getAllByRole("article");

    expect(articles.length).toBe(15);
  });

  it("should display all articles and hide 'Load more' button after all items are visible", async () => {
    renderComponent();
    const loadMoreButton = screen.getByRole("button", { name: /Load more/i });

    for (let i = 0; i < 7; i++) {
      await userEvent.click(loadMoreButton);
    }

    const articles = screen.getAllByRole("article");

    expect(articles.length).toBe(30);

    expect(screen.queryByRole("button", { name: /Load more/i })).not.toBeInTheDocument();
  });

  it("should verify tags are not visible", () => {
    renderComponent();
    const tagAChip = screen.queryByText("Tag A");

    expect(tagAChip).not.toBeInTheDocument();
  });
});

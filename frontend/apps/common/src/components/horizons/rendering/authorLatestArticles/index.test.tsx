import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthorLatestArticles from ".";
import { TestArticle } from "../../../../testing/data/testData";

describe("AuthorLatestArticles", () => {
  it("should render the desktop layout when articles are provided", () => {
    render(<AuthorLatestArticles articles={[TestArticle]} />);

    const desktopWrapper = screen.getByTestId("author-latest-articles-desktop");

    expect(desktopWrapper).toBeInTheDocument();

    expect(screen.getAllByText("Latest")[0]).toBeInTheDocument();
  });

  it("should render the mobile layout when articles are provided", () => {
    render(<AuthorLatestArticles articles={[TestArticle]} />);

    const mobileWrapper = screen.getByTestId("author-latest-articles-mobile");

    expect(mobileWrapper).toBeInTheDocument();

    const mobileHeader = screen.getAllByText("Latest")[1];

    expect(mobileHeader).toBeInTheDocument();
  });

  it("should display a message if no articles are provided", () => {
    render(<AuthorLatestArticles articles={[]} />);

    const noArticlesMessage = screen.getByText("This author has no articles yet.");

    expect(noArticlesMessage).toBeInTheDocument();
  });
});

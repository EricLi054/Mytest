import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ArticleWithRichMediaCard from ".";
import { TestArticle } from "../../../../testing/data/testData";

describe("ArticleWithRichMediaCard", () => {
  it("should render and display an image", () => {
    render(<ArticleWithRichMediaCard article={TestArticle} showCategoryOnCard={true} />);

    expect(screen.getAllByRole("img")[0]).toBeVisible();
  });
});

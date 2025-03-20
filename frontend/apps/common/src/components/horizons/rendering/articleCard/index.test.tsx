import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ArticleCard from ".";
import { TestArticle } from "../../../../testing/data/testData";

describe("ArticleCard", () => {
  it("should render and display an image", () => {
    render(<ArticleCard article={TestArticle} showCategoryOnCard={true} sectionColour="White" />);

    expect(screen.getByRole("img")).toBeVisible();
  });
});

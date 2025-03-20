import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AuthorCard from ".";
import { TestAuthor } from "../../../../testing/data/testData";

vi.mock("server-only", () => ({}));

describe("AuthorCard", () => {
  it("should render and display an image", () => {
    render(<AuthorCard author={TestAuthor} authorBio={<div>This is the author bio</div>} />);

    expect(screen.getAllByRole("img")[0]).toBeVisible();
    expect(screen.getAllByText("Author")[0]).toBeInTheDocument();
    expect(screen.getAllByText(TestAuthor.name)[0]).toBeInTheDocument();
  });
});

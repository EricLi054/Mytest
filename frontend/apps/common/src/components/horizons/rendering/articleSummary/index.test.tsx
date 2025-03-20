import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import ArticleSummary from ".";

describe("ArticleSummary component", () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <article>
      <h2>Introduction</h2>
      <h3>Subheading 1</h3>
      <h4>Details 1</h4>
      <h2>Conclusion</h2>
    </article>
  `;
  });

  it("should render the summary heading", () => {
    render(<ArticleSummary />);

    expect(screen.getByRole("heading", { name: /summary/i })).toBeInTheDocument();
  });

  it("should populate the list with headings from the article", () => {
    render(<ArticleSummary />);

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(2);

    expect(links[0]).toHaveTextContent("Introduction");
    expect(links[0]).toHaveAttribute("href", "#introduction");

    expect(links[1]).toHaveTextContent("Conclusion");
    expect(links[1]).toHaveAttribute("href", "#conclusion");
  });

  it("should add unique IDs to the headings in the DOM", () => {
    render(<ArticleSummary />);

    const headings = screen.getAllByRole("heading");

    expect(headings[0]).toHaveAttribute("id", "introduction");
    expect(headings[3]).toHaveAttribute("id", "conclusion");
  });

  it("should navigate to the correct heading on link click", async () => {
    render(<ArticleSummary />);

    const links = screen.getAllByRole("link");
    if (!links[0]) {
      return;
    }
    await userEvent.click(links[0]);

    expect(window.location.hash).toBe("#introduction");
  });
});

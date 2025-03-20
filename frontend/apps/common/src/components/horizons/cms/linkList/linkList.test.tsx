import type { LinkListProps } from "#types/horizons/linkList";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestCategory, TestPage } from "#testing/data/testData";
import { describe, expect, it } from "vitest";

import LinkListRendering from "./linkList";

const mockLinkList: LinkListProps = {
  title: "Explore Topics",
  slug: "explore-topics",
  sectionColour: "White",
  heading: "Explore Topics",
  category: TestCategory,
  pagesCollection: {
    items: Array.from({ length: 8 }, () => ({ ...TestPage })),
  },
};

describe("LinkListRendering Component", () => {
  it("should render the heading correctly", () => {
    render(<LinkListRendering linkList={mockLinkList} pages={mockLinkList.pagesCollection?.items ?? []} />);

    expect(screen.getByText("Explore Topics")).toBeInTheDocument();
  });

  it("should render the first 4 topics by default", () => {
    render(<LinkListRendering linkList={mockLinkList} pages={mockLinkList.pagesCollection?.items ?? []} />);
    const topics = screen.getAllByRole("link", { name: /Page/ });

    expect(topics).toHaveLength(4);
  });

  it("should render the 'View more' button when there are more than 4 pages", () => {
    render(<LinkListRendering linkList={mockLinkList} pages={mockLinkList.pagesCollection?.items ?? []} />);

    expect(screen.getByRole("button", { name: "View more" })).toBeInTheDocument();
  });

  it("should show all topics when 'View more' is clicked", async () => {
    render(<LinkListRendering linkList={mockLinkList} pages={mockLinkList.pagesCollection?.items ?? []} />);
    const button = screen.getByRole("button", { name: "View more" });
    await userEvent.click(button);

    const topics = screen.getAllByRole("link", { name: /Page/ });

    expect(topics).toHaveLength(8);
    expect(screen.getAllByText("Page Title")[0]).toBeInTheDocument();
  });

  it("should render topic links and images correctly", () => {
    render(<LinkListRendering linkList={mockLinkList} pages={mockLinkList.pagesCollection?.items.slice(0, 2) ?? []} />);

    const topicLinks = screen.getAllByRole("link", { name: /Page/ });

    expect(topicLinks).toHaveLength(2);

    topicLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", `/horizons/page-slug`);
    });

    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(2);

    images.forEach((img) => {
      expect(img).toHaveAttribute("alt", `Open Graph Image`);
    });
  });

  it("should not render the 'View more' button when there are 4 or fewer topics", () => {
    render(<LinkListRendering linkList={mockLinkList} pages={mockLinkList.pagesCollection?.items.slice(0, 4) ?? []} />);

    expect(screen.queryByRole("button", { name: "View more" })).not.toBeInTheDocument();
  });
});

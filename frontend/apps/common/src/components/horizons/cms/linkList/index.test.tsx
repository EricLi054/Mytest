import { render } from "@testing-library/react";
import { TestCategory, TestPage } from "#testing/data/testData";
import { describe, expect, it, vi } from "vitest";

import LinkList from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getLinkList: vi.fn(() => ({
    data: {
      horizons_linkList: {
        title: "Explore by driving topics",
        slug: "explore-by-driving-topics",
        sectionColour: "White",
        category: TestCategory,
        heading: "Explore by driving topics",
        pagesCollection: [
          {
            ...TestPage,
          },
        ],
      },
    },
  })),
}));

describe("LinkList", () => {
  it("should fetch Link List data and render", async () => {
    const linkList = await LinkList({ data: { sys: { id: "1234" } } });
    render(linkList);

    expect(linkList).toBeDefined();
  });
});

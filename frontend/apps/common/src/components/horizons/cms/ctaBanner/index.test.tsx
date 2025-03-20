import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CtaBanner from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getCtaBanner: vi.fn(() => ({
    data: {
      horizons_ctaBanner: {
        title: "CTA Banner Title",
        image: {
          title: "Image Title",
          image: "image-url",
        },
        contentPosition: "left",
        category: {
          name: "Category Name",
          slug: "category-slug",
          colour: "White",
        },
        heading: "Heading Text",
        subtext: "Subtext",
        buttonText: "Click Here",
        buttonUrl: "https://example.com",
      },
    },
  })),
}));

describe("CtaBanner", () => {
  it("should fetch CTA Banner data and render", async () => {
    const ctaBanner = await CtaBanner({ data: { sys: { id: "1234" } } });
    render(ctaBanner);

    expect(screen.getByText("Heading Text")).toBeInTheDocument();
  });
});

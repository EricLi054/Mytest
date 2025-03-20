import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Typography from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getTypography: vi.fn(() => ({
    data: {
      horizons_typography: {
        title: "Test Typography",
        heading: "Test Heading",
        layoutSize: "Full width",
        leftContent: {
          json: {
            nodeType: BLOCKS.DOCUMENT,
            content: [],
            data: {},
          },
        },
        rightContent: {
          json: {
            nodeType: BLOCKS.DOCUMENT,
            content: [],
            data: {},
          },
        },
      },
    },
  })),
}));

describe("Typography", () => {
  it("should fetch Typography data and render", async () => {
    const page = await Typography({ data: { sys: { id: "1234" } } });
    render(page);

    expect(screen.getByText("Test Heading")).toBeInTheDocument();
  });
});

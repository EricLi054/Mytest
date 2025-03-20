import type { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import type { z } from "zod";
import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Typography from ".";
import { getTypographyData } from "./data";

vi.mock("../RichText/ContentfulRichTextRenderer", () => ({
  default: (props: { text: z.infer<typeof RichTextSchema> }) => <div>{props.text.json.nodeType}</div>,
}));

vi.mock("./data", () => ({
  getTypographyData: vi.fn(),
}));

const validRichText: { text: z.infer<typeof RichTextSchema> } = {
  text: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    },
  },
};

const mockedData = {
  title: "Example Typography",
  text: validRichText.text,
};

describe("typography", () => {
  it("should returns null when no data", async () => {
    vi.mocked(getTypographyData).mockResolvedValue(null);
    const result = await Typography({ id: "1" });

    expect(result).toBeNull();
  });

  it("should render using RichTextRenderer", async () => {
    vi.mocked(getTypographyData).mockResolvedValue(mockedData);
    render(<>{await Typography({ id: "1" })}</>);

    expect(screen.getByText("document")).toBeInTheDocument();
  });
});

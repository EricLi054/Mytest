import type { z } from "zod";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ContentfulButtonContainerSchema } from "./schema";
import ButtonContainer from ".";
import { getButtonContainerData } from "./data";

vi.mock("../ContentfulButton", () => {
  return {
    default: ({ id }: { id: string }) => <div>Button-{id}</div>,
  };
});
vi.mock("./data", () => ({
  getButtonContainerData: vi.fn(),
}));

const mockData: z.infer<typeof ContentfulButtonContainerSchema> = {
  stackTogether: true,
  itemsPerRow: 2,
  largeWidth: 95,
  columnBreakpoint: "sm",
  gap: 1,
  buttons: {
    items: [
      {
        sys: {
          id: "1",
        },
      },
      {
        sys: {
          id: "2",
        },
      },
    ],
  },
};

describe("Button Container", () => {
  it("should render buttons", async () => {
    vi.mocked(getButtonContainerData).mockReturnValueOnce(Promise.resolve(mockData));
    render(<>{await ButtonContainer({ id: "1" })}</>);

    expect(screen.getByText("Button-1")).toBeInTheDocument();
    expect(screen.getByText("Button-2")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Grid from ".";
import { getGridData } from "./data";

vi.mock("server-only", () => ({}));
vi.mock("../GridItem", () => ({
  default: (props: { id: string }) => <div>{props.id}</div>,
}));

vi.mock("./data", () => ({
  getGridData: vi.fn(),
}));

const mockedData2 = {
  __typename: "rac_Grid",
  title: "Example Grid",
  direction: null,
  width: "100%",
  justifyContent: "center",
  alignItems: "flex-start",
  textAlign: null,
  gap: "10px",
  padding: "20px",
  background: "#f0f0f0",
  wrap: null,
  contentItemsCollection: {
    items: [
      {
        __typename: "rac_GridItem",
        sys: { id: "1" },
      },
      {
        __typename: "rac_GridItem",
        sys: { id: "2" },
      },
    ],
  },
};

describe("Grid", () => {
  it("should returns null when no data", async () => {
    vi.mocked(getGridData).mockResolvedValue(null);
    const result = await Grid({ id: "1" });

    expect(result).toBeNull();
  });

  it("should renders 1 of each item", async () => {
    vi.mocked(getGridData).mockResolvedValue(mockedData2);
    render(<>{await Grid({ id: "1" })}</>);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

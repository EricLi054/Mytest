import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Placeholder from ".";
import { getPlaceholderData } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getPlaceholderData: vi.fn(),
}));

vi.mock("#graphql/policyDetails", () => ({
  getPolicyDetails: vi.fn(),
}));

vi.mock("#graphql/person/queries", () => ({
  getPerson: vi.fn(),
}));

describe("Placeholder Component", () => {
  it("should log an error if the placeholderType is unknown", async () => {
    const mockData = {
      __typename: "rac_placeholder",
      placeholderType: "UnknownType",
      engineeredContentCollection: {
        items: [],
      },
      sys: { id: "123" },
    };

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());

    vi.mocked(getPlaceholderData).mockResolvedValue(mockData);

    render(<Placeholder id="123" />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error: PlaceHolder.tsx Component not found for placeholderType: ",
        "UnknownType",
      );
    });

    // Clean up the spy
    consoleErrorSpy.mockRestore();
  });
});

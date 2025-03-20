import type { z } from "zod";
import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { MyRACThemeProvider } from "#theme";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { RawBannerSchema } from "./schema";
import Banner from "./";

testHelper.mockEnvironmentVariableProvider();

vi.mock("server-only", () => ({}));
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const mockBannerData: z.infer<typeof RawBannerSchema> = {
  bannerImage: [
    {
      secureUrl: "123",
    },
  ],
  heading: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: "text",
              value: "Banner text",
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
  bannerLinksCollection: {
    items: [
      {
        longText: "Get a quote",
        shortText: "",
        link: "#",
        icon: "certificate",
      },
    ],
  },
};

const mockResponse = {
  data: {
    rac_banner: mockBannerData,
  },
};

describe("Banner", () => {
  it("should throw and log error", async () => {
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: null }));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());

    await expect(Banner({ id: "1" })).rejects.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "getBannerData: failed to fetch banner alerts for id:",
      "1",
      expect.any(Error),
    );
  });

  it("should render the component", async () => {
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve(mockResponse));
    render(<MyRACThemeProvider>{await Banner({ id: "1" })}</MyRACThemeProvider>);

    expect(screen.getByText("Banner text")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get a quote" })).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });
});

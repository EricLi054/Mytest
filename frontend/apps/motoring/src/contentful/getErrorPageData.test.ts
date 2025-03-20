import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getContentfulErrorPageData } from "./getErrorPageData";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql");
vi.mock("#utils/getAccessToken");

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getContentfulErrorPageData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call execute with the correct parameters", async () => {
    const id = "test-id";
    const mockToken = "mock-token";
    const mockResponse = {
      data: {
        rac_stepperFormErrorPage: {
          heading: "Test Heading",
          subheading: "Test Subheading",
          content: {
            json: {
              nodeType: "document",
              data: {},
              content: [],
            },
          },
        },
      },
    };

    vi.mocked(execute).mockResolvedValue(mockResponse);
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);

    const result = await getContentfulErrorPageData(id);

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "motoring",
      token: mockToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: { id, preview: true },
    });
    expect(result).toEqual({
      rac_stepperFormErrorPage: {
        heading: "Test Heading",
        subheading: "Test Subheading",
        content: {
          json: {
            nodeType: "document",
            data: {},
            content: [],
          },
        },
      },
    });
  });

  it("should handle errors correctly", async () => {
    const id = "test-id";
    const mockToken = "mock-token";
    vi.mocked(execute).mockRejectedValue(new Error("GraphQL error"));
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);

    await expect(getContentfulErrorPageData(id)).rejects.toThrow(
      `Failed to fetch Contentful Error Page data with id: ${id}`,
    );

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "motoring",
      token: mockToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: { id, preview: true },
    });
  });
});

import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { execute } from "@racwa/gql";

import { getContentfulConfirmationPageData } from "./getConfirmationPageData";
import { CardSchema } from "./schema";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql");
vi.mock("#utils/getAccessToken");

const { GRAPHQL_ENDPOINT } = serverEnv();

const mockSchema = z.object({
  heading: z.string().nullable(),
  subheading: z.string(),
  cards: z.object({
    card1: CardSchema,
  }),
});

describe("getContentfulConfirmationPageData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call execute with the correct parameters", async () => {
    const id = "test-id";
    const mockToken = "mock-token";
    const mockResponse = {
      data: {
        rac_stepperFormConfirmationPage: {
          heading: "Test Heading",
          subheading: "Test Subheading",
          cardsCollection: {
            items: [
              {
                name: "card1",
                title: "Card 1",
                content: {
                  json: {
                    nodeType: "document",
                    data: {},
                    content: [],
                  },
                },
              },
            ],
          },
        },
      },
    };

    vi.mocked(execute).mockResolvedValue(mockResponse);
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);

    const result = await getContentfulConfirmationPageData(id, mockSchema);

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
      heading: "Test Heading",
      subheading: "Test Subheading",
      cards: {
        card1: {
          name: "card1",
          title: "Card 1",
          content: {
            json: {
              nodeType: "document",
              data: {},
              content: [],
            },
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

    await expect(getContentfulConfirmationPageData(id, mockSchema)).rejects.toThrow(
      `Failed to fetch Contentful Confirmation Page data with id: ${id}`,
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

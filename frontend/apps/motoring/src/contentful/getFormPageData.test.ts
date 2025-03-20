import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { execute } from "@racwa/gql";

import { getContentfulFormPageData } from "./getFormPageData";
import { NotificationCardSchema, RichTextContentSchema } from "./schema";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql");
vi.mock("#utils/getAccessToken");

const { GRAPHQL_ENDPOINT } = serverEnv();

const mockSchema = z.object({
  heading: z.string(),
  subheading: z.string(),
  fields: z.object({
    field1: z.object({
      label: z.string(),
      placeholder: z.string().nullable(),
      requiredErrorMessage: z.string(),
      invalidErrorMessage: z.string(),
      tooltipTitle: z.string(),
      tooltipContent: RichTextContentSchema.optional(),
    }),
  }),
  notifications: z.object({
    notification1: NotificationCardSchema,
  }),
});

describe("getContentfulFormPageData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call execute with the correct parameters", async () => {
    const id = "test-id";
    const mockToken = "mock-token";
    const mockResponse = {
      data: {
        rac_stepperFormPage: {
          heading: "Heading",
          subheading: "Subheading",
          fieldsCollection: {
            items: [
              {
                name: "field1",
                label: "Field 1",
                placeholder: "Enter field 1",
                requiredErrorMessage: "Field 1 is required",
                invalidErrorMessage: "Field 1 is invalid",
                tooltipTitle: "Field 1 Tooltip",
                tooltipContent: {
                  json: {
                    nodeType: "document",
                    data: {},
                    content: [],
                  },
                },
              },
            ],
          },
          notificationCardsCollection: {
            items: [
              {
                name: "notification1",
                title: "Notification 1",
                severity: "error",
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

    const result = await getContentfulFormPageData({ id, schema: mockSchema });

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
      heading: "Heading",
      subheading: "Subheading",
      fields: {
        field1: {
          label: "Field 1",
          placeholder: "Enter field 1",
          requiredErrorMessage: "Field 1 is required",
          invalidErrorMessage: "Field 1 is invalid",
          tooltipTitle: "Field 1 Tooltip",
          tooltipContent: {
            json: {
              nodeType: "document",
              data: {},
              content: [],
            },
          },
        },
      },
      notifications: {
        notification1: {
          name: "notification1",
          title: "Notification 1",
          severity: "error",
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

    await expect(getContentfulFormPageData({ id, schema: mockSchema })).rejects.toThrow(
      "Failed to fetch Contentful Form Page data with id: test-id",
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

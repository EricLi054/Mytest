import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/Authentication";
import { describe, expect, it, vi } from "vitest";

import type { ExecuteProps } from "@racwa/gql";
import type { Result } from "@racwa/types";
import { execute } from "@racwa/gql";

import type { UpdateADB2CAccountCrmIdParams } from "./data";
import { UpdateADB2CAccountCrmId } from "./data";

vi.mock("server-only", () => ({}));
vi.mock("#utils/Authentication");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

type Query = ExecuteProps<Result, UpdateADB2CAccountCrmIdParams>["query"];

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getMatchedPersonData", () => {
  const mockToken = "mockToken";
  const mockParams = {
    crmId: "123456789",
    adb2cAccountId: "111111111",
  };

  it("should return data when the query is successful", async () => {
    const mockData = {
      data: {
        updateAdAccountCrmId: {
          isSuccessful: true,
        },
      },
    };
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);
    vi.mocked(execute).mockResolvedValue(mockData);

    const result = await UpdateADB2CAccountCrmId(mockParams, mockToken);

    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "identity",
      token: mockToken,
      query: expect.anything() as Query,
      variables: mockParams,
    });
    expect(result).toEqual(mockData);
  });

  it("should throw an error when the query fails", async () => {
    const mockError = new Error("Query failed");
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);
    vi.mocked(execute).mockRejectedValue(mockError);

    await expect(UpdateADB2CAccountCrmId(mockParams, mockToken)).rejects.toThrow("Query failed");

    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      token: mockToken,
      sourceSystem: "identity",
      query: expect.anything() as Query,
      variables: mockParams,
    });
  });
});

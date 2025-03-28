import { serverEnv } from "#env/server";
import HeadersBuilder from "#testing/builders/HeadersBuilder";
import { getAccessToken } from "#utils/Authentication";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ExecuteProps } from "@racwa/gql";
import type { Result } from "@racwa/types";
import { execute } from "@racwa/gql";

import type { GetMatchedPersonDataParams } from "./data";
import { getMatchedPersonData } from "./data";

vi.mock("server-only", () => ({}));
vi.mock("#utils/Authentication");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

type Query = ExecuteProps<Result, GetMatchedPersonDataParams>["query"];

const mockToken = "mockToken";
const mockCorrelationID = "98765321";
const mockParams = {
  input: {
    request: {
      firstName: "john",
      dateOfBirth: "1980-01-10",
      surname: "Smith",
      mobilePhone: "0412312312",
    },
  },
};

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getMatchedPersonData", () => {
  beforeEach(() => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockCorrelationID);
  });

  it("should return data when the query is successful", async () => {
    const consoleMock = vi.spyOn(console, "log");
    const expectedHeaders = new HeadersBuilder().withCorrelationId(mockCorrelationID).build();
    const mockData = {
      data: {
        match: {
          matchedPerson: {
            personId: "00000000-0000-0000-0000-00000000000",
            racId: "00000001",
            firstName: "John",
            mobilePhone: "04132112312",
            membershipType: "Member",
          },
          errors: null,
        },
      },
    };
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);
    vi.mocked(execute).mockResolvedValue(mockData);

    const result = await getMatchedPersonData(mockParams);

    expect(getAccessToken).toHaveBeenCalled();
    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "identity",
      token: mockToken,
      query: expect.anything() as Query,
      variables: mockParams,
      headers: expectedHeaders,
    });
    expect(result).toEqual(mockData);
    expect(consoleMock).toHaveBeenCalledWith(
      `[getMatchedPersonData]: Starting to check for member match with CorrelationID [${mockCorrelationID}] | Session: - | CRM: -`,
    );
  });

  it.each(["NoMatchError", "DuplicateMatchError"])(
    "should return data with null matchedPerson and match error of type %s",
    async (errorType) => {
      const expectedHeaders = new HeadersBuilder().withCorrelationId(mockCorrelationID).build();
      const mockData = {
        data: {
          match: {
            matchedPerson: null,
            errors: [{ type: errorType }],
          },
        },
      };
      vi.mocked(getAccessToken).mockResolvedValue(mockToken);
      vi.mocked(execute).mockResolvedValue(mockData);

      const result = await getMatchedPersonData(mockParams);

      expect(getAccessToken).toHaveBeenCalled();
      expect(execute).toHaveBeenCalledWith({
        endpoint: GRAPHQL_ENDPOINT,
        sourceSystem: "identity",
        token: mockToken,
        query: expect.anything() as Query,
        variables: mockParams,
        headers: expectedHeaders,
      });
      expect(result).toEqual(mockData);
    },
  );

  it("should throw error if getAccessToken returns an error", async () => {
    const errorMessage = "getAccessToken exception";
    const consoleMock = vi.spyOn(console, "error");
    vi.mocked(getAccessToken).mockRejectedValueOnce(new Error(errorMessage));

    await expect(getMatchedPersonData(mockParams)).rejects.toThrow();
    expect(consoleMock).toHaveBeenCalledWith(
      `[getMatchedPersonData]: Failed to check for member match with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: - | CRM: -`,
    );
  });

  it("should throw an error when the query fails", async () => {
    const mockError = new Error("Query failed");
    const expectedHeaders = new HeadersBuilder().withCorrelationId(mockCorrelationID).build();
    const consoleMock = vi.spyOn(console, "error");
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);
    vi.mocked(execute).mockRejectedValue(mockError);

    await expect(getMatchedPersonData(mockParams)).rejects.toThrowError(mockError);

    expect(getAccessToken).toHaveBeenCalled();
    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      token: mockToken,
      sourceSystem: "identity",
      query: expect.anything() as Query,
      variables: mockParams,
      headers: expectedHeaders,
    });
    expect(consoleMock).toHaveBeenCalledWith(
      `[getMatchedPersonData]: Failed to check for member match with CorrelationID [${mockCorrelationID}] | Error: Query failed | Session: - | CRM: -`,
    );
  });
});

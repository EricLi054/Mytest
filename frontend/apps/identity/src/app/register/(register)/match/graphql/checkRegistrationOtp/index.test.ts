import { serverEnv } from "#env/server";
import HeadersBuilder from "#testing/builders/HeadersBuilder";
import { getAccessToken } from "#utils/Authentication";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ExecuteProps } from "@racwa/gql";
import type { Result } from "@racwa/types";
import { execute } from "@racwa/gql";

import { checkRegistrationOtp } from ".";

vi.mock("server-only", () => ({}));
vi.mock("#utils/Authentication");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const headerGetMock = vi.fn();
vi.mock("next/headers", () => ({
  headers: () => {
    return {
      get: headerGetMock,
    };
  },
}));

type Query = ExecuteProps<Result, { key: string; crmId: string }>["query"];

const mockCorrelationID = "98765321";
const mockCrmId = "mock_crm_id";
const mockSessionKey = "mock_session_key";
const mockToken = "mockToken";

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("CheckRegistrationOtp GraphQL", () => {
  beforeEach(() => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockCorrelationID);
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);
  });

  it("should return true for authenticated response and log CorrelationId", async () => {
    const consoleMock = vi.spyOn(console, "log");
    const expectedHeaders = new HeadersBuilder().withCorrelationId(mockCorrelationID).withUserAgent().build();
    const mockRequestResponse = {
      checkRegistrationOtp: {
        isAuthenticated: true,
      },
    };

    headerGetMock.mockReturnValueOnce(expectedHeaders["User-Agent"]);
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockRequestResponse }));

    const result = await checkRegistrationOtp(mockSessionKey, mockCrmId);

    expect(result).toEqual(true);
    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: GRAPHQL_ENDPOINT,
        sourceSystem: "identity",
        token: mockToken,
        query: expect.anything() as Query,
        variables: { key: mockSessionKey, crmId: mockCrmId },
        headers: expectedHeaders,
      }),
    );
    expect(consoleMock).toHaveBeenCalledWith(
      `[checkRegistrationOtp]: Starting to check registration OTP with CorrelationID [${mockCorrelationID}] | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });

  it("should throw error if getAccessToken returns an error", async () => {
    const errorMessage = "getAccessToken exception";
    vi.mocked(getAccessToken).mockRejectedValueOnce(new Error(errorMessage));

    await expect(checkRegistrationOtp(mockSessionKey, mockCrmId)).rejects.toThrow(errorMessage);
  });

  it("should return false for unauthenticated response", async () => {
    const mockRequestResponse = {
      checkRegistrationOtp: {
        isAuthenticated: false,
      },
    };
    vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

    const result = await checkRegistrationOtp(mockSessionKey, mockCrmId);

    expect(result).toEqual(false);
  });

  it("should return false for error response", async () => {
    vi.mocked(execute).mockResolvedValue({
      data: { checkOtp: null },
      errors: [{ name: "Error", message: "Couldn't get session" }],
    });

    const result = await checkRegistrationOtp(mockSessionKey, mockCrmId);

    expect(result).toEqual(false);
  });

  it("should throw unhandled exception if unknown error returned", async () => {
    const errorMessage = "Unhandled Exception";
    const consoleMock = vi.spyOn(console, "error");
    vi.mocked(execute).mockRejectedValueOnce(new Error(errorMessage));

    await expect(checkRegistrationOtp(mockSessionKey, mockCrmId)).rejects.toThrow(errorMessage);
    expect(consoleMock).toHaveBeenCalledWith(
      `[checkRegistrationOtp]: Failed to check registration OTP with with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });
});

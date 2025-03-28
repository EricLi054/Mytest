import { serverEnv } from "#env/server";
import HeadersBuilder from "#testing/builders/HeadersBuilder";
import { getAccessToken } from "#utils/Authentication";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ExecuteProps } from "@racwa/gql";
import type { Result } from "@racwa/types";
import { execute } from "@racwa/gql";
import { createMfaSessionKey } from "@racwa/mfa";

import { getRegistrationOtpVerificationDetails } from ".";
import { getMfaSessionKeyAndCrmId } from "../../utils/mfa";

vi.mock("server-only", () => ({}));
vi.mock("../../utils/mfa");
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

const mockCorrelationID = "123456789-98765321";
const mockCrmId = "mock_crm_id";
const mockSessionKey = createMfaSessionKey("my-rac-account-registration", "mock_session_key");
const mockToken = "mockToken";

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("GetRegistrationOtpVerificationDetails Graphql", () => {
  beforeEach(() => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockCorrelationID);
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);
    vi.mocked(getMfaSessionKeyAndCrmId).mockResolvedValue([mockSessionKey, mockCrmId]);
  });

  it("should return response when successful and log CorrelationId", async () => {
    const consoleMock = vi.spyOn(console, "log");
    const expectedHeaders = new HeadersBuilder().withCorrelationId(mockCorrelationID).withUserAgent().build();
    const mockRequestResponse = {
      registrationOtpVerificationDetails: {
        isAuthenticated: false,
        isMobile: true,
        phoneNumberSuffix: "123",
      },
    };
    headerGetMock.mockReturnValueOnce(expectedHeaders["User-Agent"]);
    vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

    const result = await getRegistrationOtpVerificationDetails();

    expect(result).toEqual({ sessionKey: mockSessionKey, ...mockRequestResponse.registrationOtpVerificationDetails });
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
      `[getRegistrationOtpVerificationDetails]: Starting to get registration OTP verification details with CorrelationID [${mockCorrelationID}] | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });

  it("should return throw and error and log when registrationOtpVerificationDetails is null", async () => {
    const errorMessage = "Unhandled Exception";
    const consoleMock = vi.spyOn(console, "error");
    const expectedHeaders = new HeadersBuilder().withCorrelationId(mockCorrelationID).withUserAgent().build();
    const mockRequestResponse = {
      registrationOtpVerificationDetails: null,
    };
    headerGetMock.mockReturnValueOnce(expectedHeaders["User-Agent"]);
    vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

    await expect(getRegistrationOtpVerificationDetails()).rejects.toThrow(errorMessage);

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
      `[getRegistrationOtpVerificationDetails]: Failed to get registration OTP verification details with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });

  it("should throw and log error if getMfaSessionKeyAndCrmId returns an error", async () => {
    const errorMessage = "getCrmId exception";
    const consoleMock = vi.spyOn(console, "error");
    vi.mocked(getMfaSessionKeyAndCrmId).mockRejectedValue(new Error(errorMessage));

    await expect(getRegistrationOtpVerificationDetails()).rejects.toThrow(errorMessage);

    expect(consoleMock).toHaveBeenCalledWith(
      `[getRegistrationOtpVerificationDetails]: Failed to get registration OTP verification details with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: - | CRM: -`,
    );
  });

  it("should throw and log error if getAccessToken returns an error", async () => {
    const errorMessage = "getAccessToken exception";
    const consoleMock = vi.spyOn(console, "error");
    vi.mocked(getAccessToken).mockRejectedValue(new Error(errorMessage));

    await expect(getRegistrationOtpVerificationDetails()).rejects.toThrow(errorMessage);

    expect(consoleMock).toHaveBeenCalledWith(
      `[getRegistrationOtpVerificationDetails]: Failed to get registration OTP verification details with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });

  it("should throw unhandled exception and log error", async () => {
    const errorMessage = "Unhandled Exception";
    const consoleMock = vi.spyOn(console, "error");
    vi.mocked(execute).mockResolvedValue({ data: {} });

    await expect(getRegistrationOtpVerificationDetails()).rejects.toThrow(errorMessage);

    expect(consoleMock).toHaveBeenCalledWith(
      `[getRegistrationOtpVerificationDetails]: Failed to get registration OTP verification details with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });
});

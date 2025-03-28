import { serverEnv } from "#env/server";
import HeadersBuilder from "#testing/builders/HeadersBuilder";
import { NPE_CONTAINER_APP_ENVS } from "#testing/constants";
import { getAccessToken } from "#utils/Authentication";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ExecuteProps } from "@racwa/gql";
import type { Result } from "@racwa/types";
import { execute } from "@racwa/gql";
import { NpeOtpFeatureHeaders } from "@racwa/mfa/types";

import { verifyRegistrationOtp } from ".";
import { getCrmId } from "../../utils/mfa";

vi.mock("server-only", () => ({}));
vi.mock("#utils/Authentication");
vi.mock("../../utils/mfa");
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

type Query = ExecuteProps<Result, { key: string; crmId: string; code: string }>["query"];

const mockCode = "000000";
const mockCorrelationID = "98765321";
const mockCrmId = "mock_crm_id";
const mockSessionKey = "mock_session_key";
const mockToken = "mockToken";

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("VerifyRegistrationOtp GraphQL", () => {
  beforeEach(() => {
    process.env.CONTAINER_APP_ENV = "prd";
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockCorrelationID);
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);
    vi.mocked(getCrmId).mockResolvedValue(mockCrmId);
  });

  it("should return response when successful, log CorrelationId and not set default NPE feature headers when containerAppEnv is prd", async () => {
    const consoleMock = vi.spyOn(console, "log");
    const expectedHeaders = new HeadersBuilder().withCorrelationId(mockCorrelationID).withUserAgent().build();
    const mockRequestResponse = {
      verifyRegistrationOtp: {
        verifyOtpResponse: {
          isVerified: true,
        },
      },
    };
    headerGetMock.mockReturnValueOnce(expectedHeaders["User-Agent"]);
    vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

    const result = await verifyRegistrationOtp(mockSessionKey, mockCode);

    expect(result).toEqual({
      data: mockRequestResponse.verifyRegistrationOtp.verifyOtpResponse,
    });
    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: GRAPHQL_ENDPOINT,
        sourceSystem: "identity",
        token: mockToken,
        query: expect.anything() as Query,
        variables: { input: { key: mockSessionKey, crmId: mockCrmId, code: mockCode } },
        headers: expectedHeaders,
      }),
    );
    expect(consoleMock).toHaveBeenCalledWith(
      `[verifyRegistrationOtp]: Starting to verify registration OTP with CorrelationID [${mockCorrelationID}] | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });

  it.each([...NPE_CONTAINER_APP_ENVS])(
    "should return response when successful and set default NPE feature headers when headers not in headerStore and when containerAppEnv is %s",
    async (npeContainerAppEnv) => {
      process.env.CONTAINER_APP_ENV = npeContainerAppEnv;
      const expectedHeaders = new HeadersBuilder()
        .withCorrelationId(mockCorrelationID)
        .withUserAgent()
        .withDefaultNpeOtpFeatureHeaders()
        .build();
      const mockRequestResponse = {
        verifyRegistrationOtp: {
          verifyOtpResponse: {
            isVerified: true,
          },
        },
      };
      headerGetMock
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(expectedHeaders["User-Agent"]);
      vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

      const result = await verifyRegistrationOtp(mockSessionKey, mockCode);

      expect(result).toEqual({
        data: mockRequestResponse.verifyRegistrationOtp.verifyOtpResponse,
      });
      expect(execute).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: GRAPHQL_ENDPOINT,
          sourceSystem: "identity",
          token: mockToken,
          query: expect.anything() as Query,
          variables: { input: { key: mockSessionKey, crmId: mockCrmId, code: mockCode } },
          headers: expectedHeaders,
        }),
      );
    },
  );

  it.each([...NPE_CONTAINER_APP_ENVS])(
    "should return response when successful and set NPE feature headers when headers are in headerStore and when containerAppEnv is %s",
    async (npeContainerAppEnv) => {
      process.env.CONTAINER_APP_ENV = npeContainerAppEnv;
      const expectedHeaders = new HeadersBuilder()
        .withCorrelationId(mockCorrelationID)
        .withUserAgent()
        .withBypassOtp(false)
        .withOverrideToNumber("+61400000000")
        .build();
      const mockRequestResponse = {
        verifyRegistrationOtp: {
          verifyOtpResponse: {
            isVerified: true,
          },
        },
      };
      headerGetMock
        .mockReturnValueOnce(expectedHeaders[NpeOtpFeatureHeaders.BypassOtp])
        .mockReturnValueOnce(expectedHeaders[NpeOtpFeatureHeaders.OverrideToNumber])
        .mockReturnValueOnce(expectedHeaders["User-Agent"]);
      vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

      const result = await verifyRegistrationOtp(mockSessionKey, mockCode);

      expect(result).toEqual({
        data: mockRequestResponse.verifyRegistrationOtp.verifyOtpResponse,
      });
      expect(execute).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: GRAPHQL_ENDPOINT,
          sourceSystem: "identity",
          token: mockToken,
          query: expect.anything() as Query,
          variables: { input: { key: mockSessionKey, crmId: mockCrmId, code: mockCode } },
          headers: expectedHeaders,
        }),
      );
    },
  );

  it("should throw error if getCrmId returns an error", async () => {
    const consoleMock = vi.spyOn(console, "error");
    const errorMessage = "getCrmId exception";
    vi.mocked(getCrmId).mockRejectedValue(new Error(errorMessage));

    await expect(verifyRegistrationOtp(mockSessionKey, mockCode)).rejects.toThrow(errorMessage);

    expect(consoleMock).toHaveBeenCalledWith(
      `[verifyRegistrationOtp]: Failed to verify registration OTP with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: ${mockSessionKey} | CRM: -`,
    );
  });

  it("should throw error if getAccessToken returns an error", async () => {
    const consoleMock = vi.spyOn(console, "error");
    const errorMessage = "getAccessToken exception";
    vi.mocked(getAccessToken).mockRejectedValue(new Error(errorMessage));

    await expect(verifyRegistrationOtp(mockSessionKey, mockCode)).rejects.toThrow(errorMessage);

    expect(consoleMock).toHaveBeenCalledWith(
      `[verifyRegistrationOtp]: Failed to verify registration OTP with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });

  it("should throw unhandled exception if unknown error", async () => {
    const consoleMock = vi.spyOn(console, "error");
    const errorMessage = "Unhandled Exception";
    vi.mocked(execute).mockResolvedValue({
      data: null,
      errors: [{ name: "SomeError", message: "SomeError" }],
    });

    await expect(verifyRegistrationOtp(mockSessionKey, mockCode)).rejects.toThrow(errorMessage);

    expect(consoleMock).toHaveBeenCalledWith(
      `[verifyRegistrationOtp]: Failed to verify registration OTP with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });

  it("should return error code NotFoundError if error type returned", async () => {
    const errorCode = "NotFoundError";
    vi.mocked(execute).mockResolvedValue({
      data: {
        verifyRegistrationOtp: { verifyOtpResponse: null, errors: [{ __typename: errorCode }] },
      },
    });

    const result = await verifyRegistrationOtp(mockSessionKey, mockCode);

    expect(result).toEqual({ errorCode });
  });

  it("should return error code TooManyRequestsError if error type returned", async () => {
    const errorCode = "TooManyRequestsError";
    vi.mocked(execute).mockResolvedValue({
      data: {
        verifyRegistrationOtp: { verifyOtpResponse: null, errors: [{ __typename: errorCode }] },
      },
    });

    const result = await verifyRegistrationOtp(mockSessionKey, mockCode);

    expect(result).toEqual({ errorCode });
  });

  it("should throw unhandled exception and log error if unknown error returned", async () => {
    const consoleMock = vi.spyOn(console, "error");
    const errorMessage = "Unhandled Exception";
    vi.mocked(execute).mockResolvedValue({
      data: { verifyRegistrationOtp: { verifyOtpResponse: null, errors: [{ __typename: "SomeError" }] } },
    });

    await expect(verifyRegistrationOtp(mockSessionKey, mockCode)).rejects.toThrow(errorMessage);

    expect(consoleMock).toHaveBeenCalledWith(
      `[verifyRegistrationOtp]: Failed to verify registration OTP with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });

  it("should throw error and log when verifyOtpResponse is null", async () => {
    const consoleMock = vi.spyOn(console, "error");
    const errorMessage = "Unhandled Exception";
    const expectedHeaders = new HeadersBuilder().withCorrelationId(mockCorrelationID).withUserAgent().build();
    const mockRequestResponse = {
      verifyRegistrationOtp: {
        verifyOtpResponse: null,
      },
    };
    headerGetMock.mockReturnValueOnce(expectedHeaders["User-Agent"]);
    vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

    await expect(verifyRegistrationOtp(mockSessionKey, mockCode)).rejects.toThrow(new Error(errorMessage));

    expect(consoleMock).toHaveBeenCalledWith(
      `[verifyRegistrationOtp]: Failed to verify registration OTP with CorrelationID [${mockCorrelationID}] | Error: Unhandled Exception | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });
});

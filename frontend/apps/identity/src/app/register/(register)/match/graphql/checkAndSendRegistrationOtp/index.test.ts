import { serverEnv } from "#env/server";
import HeadersBuilder from "#testing/builders/HeadersBuilder";
import { NPE_CONTAINER_APP_ENVS } from "#testing/constants";
import { getAccessToken } from "#utils/Authentication";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ExecuteProps } from "@racwa/gql";
import type { OtpChannelValue } from "@racwa/mfa/types";
import type { Result } from "@racwa/types";
import { execute } from "@racwa/gql";
import { NpeOtpFeatureHeaders, OtpChannel } from "@racwa/mfa/types";

import { checkAndSendRegistrationOtp } from ".";
import { getCrmId } from "../../utils/mfa";

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

type Query = ExecuteProps<Result, { key: string; crmId: string; channel: OtpChannelValue }>["query"];

const mockCorrelationID = "123456789-98765321";
const mockCrmId = "mock_crm_id";
const mockSessionKey = "mock_session_key";
const mockToken = "mockToken";

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("CheckAndSendRegistrationOtp GraphQL", () => {
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
      checkAndSendRegistrationOtp: {
        sendOtpResponse: {
          hasSendAttemptsRemaining: true,
        },
      },
    };

    headerGetMock.mockReturnValueOnce(expectedHeaders["User-Agent"]);
    vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

    const result = await checkAndSendRegistrationOtp(mockSessionKey, OtpChannel.SMS);

    expect(result).toEqual({
      data: mockRequestResponse.checkAndSendRegistrationOtp.sendOtpResponse,
    });
    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: GRAPHQL_ENDPOINT,
        sourceSystem: "identity",
        token: mockToken,
        query: expect.anything() as Query,
        variables: { input: { key: mockSessionKey, crmId: mockCrmId, channel: OtpChannel.SMS } },
        headers: expectedHeaders,
      }),
    );
    expect(consoleMock).toHaveBeenCalledWith(
      `[checkAndSendRegistrationOtp]: Starting to check and send registration OTP with CorrelationID [${mockCorrelationID}] | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
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
        checkAndSendRegistrationOtp: {
          sendOtpResponse: {
            hasSendAttemptsRemaining: true,
          },
        },
      };

      headerGetMock
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(expectedHeaders["User-Agent"]);
      vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

      const result = await checkAndSendRegistrationOtp(mockSessionKey, OtpChannel.SMS);

      expect(result).toEqual({
        data: mockRequestResponse.checkAndSendRegistrationOtp.sendOtpResponse,
      });
      expect(execute).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: GRAPHQL_ENDPOINT,
          sourceSystem: "identity",
          token: mockToken,
          query: expect.anything() as Query,
          variables: { input: { key: mockSessionKey, crmId: mockCrmId, channel: OtpChannel.SMS } },
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
        checkAndSendRegistrationOtp: {
          sendOtpResponse: {
            hasSendAttemptsRemaining: true,
          },
        },
      };

      headerGetMock
        .mockReturnValueOnce(expectedHeaders[NpeOtpFeatureHeaders.BypassOtp])
        .mockReturnValueOnce(expectedHeaders[NpeOtpFeatureHeaders.OverrideToNumber])
        .mockReturnValueOnce(expectedHeaders["User-Agent"]);
      vi.mocked(execute).mockResolvedValue({ data: mockRequestResponse });

      const result = await checkAndSendRegistrationOtp(mockSessionKey, OtpChannel.SMS);

      expect(result).toEqual({
        data: mockRequestResponse.checkAndSendRegistrationOtp.sendOtpResponse,
      });
      expect(execute).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: GRAPHQL_ENDPOINT,
          sourceSystem: "identity",
          token: mockToken,
          query: expect.anything() as Query,
          variables: { input: { key: mockSessionKey, crmId: mockCrmId, channel: OtpChannel.SMS } },
          headers: expectedHeaders,
        }),
      );
    },
  );

  it("should throw error if getCrmId returns an error", async () => {
    const errorMessage = "getCrmId exception";
    vi.mocked(getCrmId).mockRejectedValueOnce(new Error(errorMessage));

    await expect(checkAndSendRegistrationOtp(mockSessionKey, OtpChannel.SMS)).rejects.toThrow(errorMessage);
  });

  it("should throw error if getAccessToken returns an error", async () => {
    const errorMessage = "getAccessToken exception";
    vi.mocked(getAccessToken).mockRejectedValueOnce(new Error(errorMessage));

    await expect(checkAndSendRegistrationOtp(mockSessionKey, OtpChannel.SMS)).rejects.toThrow(errorMessage);
  });

  it("should throw unhandled exception if unknown error", async () => {
    vi.mocked(execute).mockReturnValueOnce(
      Promise.resolve({
        data: null,
        errors: [{ name: "SomeError", message: "SomeError" }],
      }),
    );

    await expect(checkAndSendRegistrationOtp(mockSessionKey, OtpChannel.SMS)).rejects.toThrow("Unhandled Exception");
  });

  it("should throw unhandled exception and log error if unknown error returned", async () => {
    const errorMessage = "Unhandled Exception";
    const consoleMock = vi.spyOn(console, "error");
    vi.mocked(execute).mockReturnValueOnce(
      Promise.resolve({
        data: { checkAndSendRegistrationOtp: { sendOtpResponse: null, errors: [{ __typename: "SomeError" }] } },
      }),
    );

    await expect(checkAndSendRegistrationOtp(mockSessionKey, OtpChannel.SMS)).rejects.toThrow(errorMessage);
    expect(consoleMock).toHaveBeenCalledWith(
      `[checkAndSendRegistrationOtp]: Failed to check and send registration OTP with with CorrelationID [${mockCorrelationID}] | Error: ${errorMessage} | Session: ${mockSessionKey} | CRM: ${mockCrmId}`,
    );
  });

  it("should return error code TooManyRequestsError if error type returned", async () => {
    const errorCode = "TooManyRequestsError";
    vi.mocked(execute).mockResolvedValue({
      data: {
        checkAndSendRegistrationOtp: { sendOtpResponse: null, errors: [{ __typename: errorCode }] },
      },
    });

    const result = await checkAndSendRegistrationOtp(mockSessionKey, OtpChannel.SMS);

    expect(result).toEqual({ errorCode });
  });
});

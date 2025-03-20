import { getFeatureToggles } from "#graphql/featureToggles";
import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";
import { OtpChannel } from "@racwa/mfa/types";

import { sendOtp } from ".";

vi.mock("server-only", () => ({}));
vi.mock("#utils/session/getCrmId");

vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("#graphql/featureToggles", () => ({
  getFeatureToggles: vi.fn(),
}));
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

const headerGetMock = vi.fn();
vi.mock("next/headers", () => ({
  headers: () => {
    return {
      get: headerGetMock,
    };
  },
}));

const mockSessionKey = "mock_session_key";

describe("SendOtp Graphql", () => {
  it("should return response when successful", async () => {
    const mockRequestResponse = {
      sendOtp: {
        hasSendAttemptsRemaining: true,
      },
    };

    headerGetMock.mockReturnValueOnce("This is a user agent");
    vi.mocked(getFeatureToggles).mockResolvedValueOnce([]);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockRequestResponse }));

    expect(await sendOtp(mockSessionKey, OtpChannel.SMS)).toEqual({
      data: mockRequestResponse.sendOtp,
    });

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "https://graphql.com",
        sourceSystem: "myRAC",
        variables: { input: { key: mockSessionKey, channel: OtpChannel.SMS } },
        headers: {
          "User-Agent": "This is a user agent",
          Feature_BypassOtp: "false",
          Feature_OverrideToNumber: "number",
          CorrelationId: expect.any(String) as unknown as string,
        },
      }),
    );
  });

  it("should pass through bypass otp", async () => {
    const mockRequestResponse = {
      sendOtp: {
        hasSendAttemptsRemaining: true,
      },
    };

    headerGetMock.mockReturnValueOnce("This is a user agent");
    vi.mocked(getFeatureToggles).mockResolvedValueOnce([{ key: "BypassOtp", value: true }]);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockRequestResponse }));

    await sendOtp(mockSessionKey, OtpChannel.SMS);

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "https://graphql.com",
        sourceSystem: "myRAC",
        variables: { input: { key: mockSessionKey, channel: OtpChannel.SMS } },
        headers: {
          "User-Agent": "This is a user agent",
          Feature_BypassOtp: "true",
          Feature_OverrideToNumber: "number",
          CorrelationId: expect.any(String) as unknown as string,
        },
      }),
    );
  });

  it("should throw unhandled if unknown error instead of data", async () => {
    headerGetMock.mockReturnValueOnce("This is a user agent");
    vi.mocked(getFeatureToggles).mockResolvedValueOnce([]);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(
      Promise.resolve({
        data: null,
        errors: [{ name: "SomeError", message: "SomeError" }],
      }),
    );

    await expect(sendOtp(mockSessionKey, OtpChannel.SMS)).rejects.toThrow("Unhandled Exception");
  });

  it("should throw unhandled if unknown error returned", async () => {
    headerGetMock.mockReturnValueOnce("This is a user agent");
    vi.mocked(getFeatureToggles).mockResolvedValueOnce([]);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(
      Promise.resolve({
        data: { sendOtp: { hasSendAttemptsRemaining: null, errors: [{ __typename: "SomeError" }] } },
      }),
    );

    await expect(sendOtp(mockSessionKey, OtpChannel.SMS)).rejects.toThrow("Unhandled Exception");
  });

  it("should return error code with specific error if known error returned", async () => {
    headerGetMock.mockReturnValueOnce("This is a user agent");
    vi.mocked(getFeatureToggles).mockResolvedValueOnce([]);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(
      Promise.resolve({
        data: { sendOtp: { hasSendAttemptsRemaining: null, errors: [{ __typename: "TooManyRequestsError" }] } },
      }),
    );

    expect(await sendOtp(mockSessionKey, OtpChannel.SMS)).toEqual({
      errorCode: "TooManyRequestsError",
    });
  });
});

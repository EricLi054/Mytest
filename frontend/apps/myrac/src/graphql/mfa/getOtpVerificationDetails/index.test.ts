import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { OtpVerificationDetailsResponse } from ".";
import { getOtpVerificationDetails } from ".";

vi.mock("server-only", () => ({}));
vi.mock("#utils/session/getCrmId");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
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

const mockRequestResponse: OtpVerificationDetailsResponse = {
  otpVerificationDetails: {
    isAuthenticated: true,
    isMobile: true,
    phoneNumberSuffix: "123",
  },
};

describe("OtpVerificationDetails Graphql", () => {
  it("should return details for successful response", async () => {
    headerGetMock.mockReturnValueOnce("This is a user agent");
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockRequestResponse }));

    expect(await getOtpVerificationDetails("mock_session_key")).toEqual(mockRequestResponse.otpVerificationDetails);

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "https://graphql.com",
        sourceSystem: "myRAC",
        variables: { key: "mock_session_key" },
        headers: { "User-Agent": "This is a user agent", CorrelationID: expect.any(String) as unknown as string },
      }),
    );
  });

  it("should throw an error for error response", async () => {
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(
      Promise.resolve({
        data: { otpVerificationDetails: null },
        errors: [{ name: "Error", message: "Couldn't get session" }],
      }),
    );

    await expect(getOtpVerificationDetails("mock_session_key")).rejects.toThrow("Couldn't get session");
  });
});

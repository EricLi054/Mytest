import HeadersBuilder from "#testing/builders/HeadersBuilder";
import { NPE_CONTAINER_APP_ENVS } from "#testing/constants";
import { describe, expect, it, vi } from "vitest";

import { NpeOtpFeatureHeaders } from "@racwa/mfa/types";

import { getNpeFeatureHeaders } from "./npe";

vi.mock("server-only", () => ({}));

const headerGetMock = vi.fn();
vi.mock("next/headers", () => ({
  headers: () => {
    return {
      get: headerGetMock,
    };
  },
}));

describe("npe", () => {
  describe("getNpeFeatureHeaders", () => {
    const mockCorrelationId = "123456789-987654321";

    it("should return empty object when containerAppEnv is prd", async () => {
      process.env.CONTAINER_APP_ENV = "prd";
      const consoleMock = vi.spyOn(console, "log");

      const result = await getNpeFeatureHeaders(mockCorrelationId);

      expect(result).toEqual({});
      expect(consoleMock).not.toHaveBeenCalled();
    });

    it.each([...NPE_CONTAINER_APP_ENVS])(
      "should return default NPE Feature Headers when containerAppEnv is %s",
      async (npeContainerAppEnv) => {
        process.env.CONTAINER_APP_ENV = npeContainerAppEnv;
        const consoleMock = vi.spyOn(console, "log");
        const expectedDefaultBypassOtp = "true";
        const expectedDefaultOverrideToNumber = "";

        const result = await getNpeFeatureHeaders(mockCorrelationId);

        expect(Object.keys(result).length).toBe(2);
        expect(result[NpeOtpFeatureHeaders.BypassOtp]).toBe(expectedDefaultBypassOtp);
        expect(result[NpeOtpFeatureHeaders.OverrideToNumber]).toBe(expectedDefaultOverrideToNumber);
        expect(consoleMock).toHaveBeenCalledWith(
          `NPE Feature Headers for request with CorrelationId [${mockCorrelationId}]: [Feature_BypassOtp: ${expectedDefaultBypassOtp}], [Feature_OverrideToNumber: ${expectedDefaultOverrideToNumber}]`,
        );
      },
    );

    it.each([...NPE_CONTAINER_APP_ENVS])(
      "should return NPE Feature Headers when headers are set and containerAppEnv is %s",
      async (npeContainerAppEnv) => {
        process.env.CONTAINER_APP_ENV = npeContainerAppEnv;
        const consoleMock = vi.spyOn(console, "log");
        const expectedBypassOtp = false;
        const expectedOverrideToNumber = "+61400000000";
        const expectedHeaders = new HeadersBuilder()
          .withBypassOtp(expectedBypassOtp)
          .withOverrideToNumber(expectedOverrideToNumber)
          .build();
        headerGetMock
          .mockReturnValueOnce(expectedHeaders[NpeOtpFeatureHeaders.BypassOtp])
          .mockReturnValueOnce(expectedHeaders[NpeOtpFeatureHeaders.OverrideToNumber]);

        const result = await getNpeFeatureHeaders(mockCorrelationId);

        expect(Object.keys(result).length).toBe(2);
        expect(result[NpeOtpFeatureHeaders.BypassOtp]).toBe(expectedHeaders[NpeOtpFeatureHeaders.BypassOtp]);
        expect(result[NpeOtpFeatureHeaders.OverrideToNumber]).toBe(
          expectedHeaders[NpeOtpFeatureHeaders.OverrideToNumber],
        );
        expect(consoleMock).toHaveBeenCalledWith(
          `NPE Feature Headers for request with CorrelationId [${mockCorrelationId}]: [Feature_BypassOtp: ${expectedBypassOtp}], [Feature_OverrideToNumber: ${expectedOverrideToNumber}]`,
        );
      },
    );
  });
});

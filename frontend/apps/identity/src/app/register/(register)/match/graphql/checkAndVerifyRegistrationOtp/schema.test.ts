import { describe, expect, it } from "vitest";

import { schema } from "./schema";

describe("CheckAndVerifyRegistrationOtp Schema", () => {
  it("should be valid when verifyOtpResponse is defined", () => {
    const data = {
      checkAndVerifyRegistrationOtp: {
        verifyOtpResponse: {
          isVerified: true,
        },
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.checkAndVerifyRegistrationOtp).toEqual(data.checkAndVerifyRegistrationOtp);
  });

  it.each([undefined, null])("should be valid when verifyOtpResponse is %s", (verifyOtpResponse) => {
    const data = {
      checkAndVerifyRegistrationOtp: {
        verifyOtpResponse: verifyOtpResponse,
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.checkAndVerifyRegistrationOtp).toEqual(data.checkAndVerifyRegistrationOtp);
  });

  it("should be valid when errors is defined", () => {
    const data = {
      checkAndVerifyRegistrationOtp: {
        errors: [{ __typename: "SomeError" }, { __typename: "SomeOtherError" }],
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.checkAndVerifyRegistrationOtp).toEqual(data.checkAndVerifyRegistrationOtp);
  });

  it.each([undefined, null])("should be valid when errors is %s", (errors) => {
    const data = {
      checkAndVerifyRegistrationOtp: {
        errors,
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.checkAndVerifyRegistrationOtp).toEqual(data.checkAndVerifyRegistrationOtp);
  });
});

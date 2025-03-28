import { describe, expect, it } from "vitest";

import { schema } from "./schema";

describe("VerifyRegistrationOtp Schema", () => {
  it("should be valid when verifyOtpResponse is defined", () => {
    const data = {
      verifyRegistrationOtp: {
        verifyOtpResponse: {
          isVerified: true,
        },
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.verifyRegistrationOtp).toEqual(data.verifyRegistrationOtp);
  });

  it.each([undefined, null])("should be valid when verifyOtpResponse is %s", (verifyOtpResponse) => {
    const data = {
      verifyRegistrationOtp: {
        verifyOtpResponse: verifyOtpResponse,
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.verifyRegistrationOtp).toEqual(data.verifyRegistrationOtp);
  });

  it("should be valid when errors is defined", () => {
    const data = {
      verifyRegistrationOtp: {
        errors: [{ __typename: "SomeError" }, { __typename: "SomeOtherError" }],
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.verifyRegistrationOtp).toEqual(data.verifyRegistrationOtp);
  });

  it.each([undefined, null])("should be valid when errors is %s", (errors) => {
    const data = {
      verifyRegistrationOtp: {
        errors,
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.verifyRegistrationOtp).toEqual(data.verifyRegistrationOtp);
  });
});

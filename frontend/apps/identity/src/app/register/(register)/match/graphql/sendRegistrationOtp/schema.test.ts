import { describe, expect, it } from "vitest";

import { schema } from "./schema";

describe("SendRegistrationOtp Schema", () => {
  it("should be valid when sendRegistrationOtp is defined", () => {
    const data = {
      sendRegistrationOtp: {
        sendOtpResponse: {
          hasSendAttemptsRemaining: true,
        },
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.sendRegistrationOtp).toEqual(data.sendRegistrationOtp);
  });

  it.each([undefined, null])("should be valid when sendOtpResponse is %s", (sendOtpResponse) => {
    const data = {
      sendRegistrationOtp: {
        sendOtpResponse,
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.sendRegistrationOtp).toEqual(data.sendRegistrationOtp);
  });

  it("should be valid when errors is defined", () => {
    const data = {
      sendRegistrationOtp: {
        errors: [{ __typename: "SomeError" }, { __typename: "SomeOtherError" }],
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.sendRegistrationOtp).toEqual(data.sendRegistrationOtp);
  });

  it.each([undefined, null])("should be valid when errors is %s", (errors) => {
    const data = {
      sendRegistrationOtp: {
        errors,
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.sendRegistrationOtp).toEqual(data.sendRegistrationOtp);
  });
});

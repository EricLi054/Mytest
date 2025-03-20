import { describe, expect, it } from "vitest";

import { schema } from "./schema";

describe("CheckAndSendRegistrationOtp Schema", () => {
  it("should be valid when checkAndSendRegistrationOtp is defined", () => {
    const data = {
      checkAndSendRegistrationOtp: {
        sendOtpResponse: {
          hasSendAttemptsRemaining: true,
        },
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.checkAndSendRegistrationOtp).toEqual(data.checkAndSendRegistrationOtp);
  });

  it.each([undefined, null])("should be valid when sendOtpResponse is %s", (sendOtpResponse) => {
    const data = {
      checkAndSendRegistrationOtp: {
        sendOtpResponse,
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.checkAndSendRegistrationOtp).toEqual(data.checkAndSendRegistrationOtp);
  });

  it("should be valid when errors is defined", () => {
    const data = {
      checkAndSendRegistrationOtp: {
        errors: [{ __typename: "SomeError" }, { __typename: "SomeOtherError" }],
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.checkAndSendRegistrationOtp).toEqual(data.checkAndSendRegistrationOtp);
  });

  it.each([undefined, null])("should be valid when errors is %s", (errors) => {
    const data = {
      checkAndSendRegistrationOtp: {
        errors,
      },
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data?.checkAndSendRegistrationOtp).toEqual(data.checkAndSendRegistrationOtp);
  });
});

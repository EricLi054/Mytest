import { describe, expect, it } from "vitest";

import { schema } from "./schema";

describe("GetRegistrationOtpVerificationDetails Schema", () => {
  it("should be valid when data is defined", () => {
    const data = {
      isAuthenticated: false,
      isMobile: true,
      phoneNumberSuffix: "123",
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(data);
  });

  it.each([undefined, null])("should be valid when data is defined and isMobile is %s", (isMobile) => {
    const data = {
      isAuthenticated: false,
      isMobile: isMobile,
      phoneNumberSuffix: "123",
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(data);
  });

  it.each([undefined, null])(
    "should be valid when data is defined and phoneNumberSuffix is %s",
    (phoneNumberSuffix) => {
      const data = {
        isAuthenticated: false,
        isMobile: true,
        phoneNumberSuffix: phoneNumberSuffix,
      };

      const result = schema.safeParse(data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    },
  );

  it.each([undefined, null])("should be invalid when data is %s", (data) => {
    const result = schema.safeParse(data);

    expect(result.success).toBe(false);
  });
});

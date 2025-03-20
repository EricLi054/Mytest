import { describe, expect, it } from "vitest";

import { verifyOtpSchema } from "./schema";

describe("VerifyOtpSchema", () => {
  const validationErrorMessage = "Please enter a valid verification code.";

  it("should be valid when verificationCode is valid", () => {
    const validData = {
      verificationCode: "123456",
    };

    const validationResult = verifyOtpSchema.safeParse(validData);

    expect(validationResult.success).toBe(true);
    expect(validationResult.data?.verificationCode).toEqual(validData.verificationCode);
  });

  it.each([undefined, null, "1", "12", "123", "1234", "12345", "1234567", "12345678", "123456789"])(
    "should return required field errors when verificationCode is: %s",
    (invalidInput) => {
      const invalidData = {
        verificationCode: invalidInput,
      };

      const validationResult = verifyOtpSchema.safeParse(invalidData);

      expect(validationResult.success).toBe(false);
      expect(validationResult.error?.errors.length).toBe(1);
      expect(validationResult.error?.errors[0]?.message).toBe(validationErrorMessage);
    },
  );
});

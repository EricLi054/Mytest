import { expectGtmCustomEvent } from "#testing/analytics";
import { describe, expect, it } from "vitest";

import { fireMfaOtpEvent, getContactMethod, getMaskedMobilePhoneNumber, mfaOtpEvent } from ".";
import { ContactMethod, VerifyOptions } from "../types/internal";

describe("Utils", () => {
  describe("getMaskedMobilePhoneNumber", () => {
    it("should return masked mobile phone number using phoneNumberSuffix", () => {
      expect(getMaskedMobilePhoneNumber("123")).toBe("04** *** 123");
    });
  });

  describe("getContactMethod", () => {
    it("should return Sms Contact method when isSms is true", () => {
      expect(getContactMethod({ isSms: true, memberStatus: VerifyOptions.HasMobile })).toBe(ContactMethod.Sms);
    });

    it("should return MobileCall Contact method when isSms is false and memberStatus is HasMobile VerifyOption", () => {
      expect(getContactMethod({ isSms: false, memberStatus: VerifyOptions.HasMobile })).toBe(ContactMethod.MobileCall);
    });

    it("should return LandlineCall Contact method when isSms is false and memberStatus is HasLandline VerifyOption", () => {
      expect(getContactMethod({ isSms: false, memberStatus: VerifyOptions.HasLandline })).toBe(
        ContactMethod.LandlineCall,
      );
    });

    it("should return LandlineCall Contact method when isSms is false and memberStatus is None VerifyOption", () => {
      expect(getContactMethod({ isSms: false, memberStatus: VerifyOptions.None })).toBe(ContactMethod.LandlineCall);
    });
  });

  describe("mfaOtpEvent", () => {
    it("should return mfaOtpEvent when only description is set", () => {
      const eventDescription = "mfaOtpEvent description";

      const result = mfaOtpEvent({ description: eventDescription });

      expect(result).toBe(`MFA - ${eventDescription}`);
    });
  });

  describe("fireMfaOtpEvent", () => {
    it("should call gtm when fireMfaOtpEvent is triggered when only description is set", () => {
      const eventDescription = "fireMfaOtpEvent description";

      fireMfaOtpEvent({ description: eventDescription });

      expectGtmCustomEvent(`MFA - ${eventDescription}`);
    });
  });
});

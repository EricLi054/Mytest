import { describe, expect, it } from "vitest";

import { createMfaSessionKey } from ".";
import { MfaJourneyType } from "../types";

describe("Utils", () => {
  describe("createMfaSessionKey", () => {
    it.each([MfaJourneyType.AccountRegistration, MfaJourneyType.ContactDetails])(
      "should create mfa session key",
      (mfaJourneyType) => {
        const sessionId = crypto.randomUUID();

        expect(createMfaSessionKey(mfaJourneyType, sessionId)).toBe(`${mfaJourneyType}-${sessionId}`);
      },
    );

    it.each(["", " "])("should throw an error when Session ID is [%s]", (sessionId) => {
      expect(() => createMfaSessionKey(MfaJourneyType.AccountRegistration, sessionId)).toThrow(
        "Session ID is required",
      );
    });
  });
});

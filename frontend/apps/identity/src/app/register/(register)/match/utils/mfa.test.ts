import PersonBuilder from "#testing/builders/PersonBuilder";
import SessionBuilder from "#testing/builders/SessionBuilder";
import { getRegistrationSession } from "#utils/session";
import { describe, expect, it, vi } from "vitest";

import { getCrmId, getMfaSessionKeyAndCrmId } from "./mfa";

vi.mock("server-only", () => ({}));
vi.mock("#utils/session");

describe("mfa", () => {
  const mockCrmId = "aaa-bbb-ccc";
  const mockSessionId = "123456789-987654321";
  const mockMfaSessionKey = `my-rac-account-registration-${mockSessionId}`;

  describe("getCrmId", () => {
    it("should crmId from person in the registration session", async () => {
      const person = new PersonBuilder().withPersonId(mockCrmId).build();
      const session = new SessionBuilder().withPerson(person).build();
      vi.mocked(getRegistrationSession).mockResolvedValue(session);

      const crmId = await getCrmId();

      expect(crmId).toEqual(mockCrmId);
    });

    it("should throw an error when person is undefined in the registration session", async () => {
      const session = new SessionBuilder().withPerson(undefined).build();
      vi.mocked(getRegistrationSession).mockResolvedValue(session);

      await expect(getCrmId()).rejects.toThrow("Person does not exist on the registration session");
    });

    it.each(["", " "])(
      "should throw an error when crmId is [%s] on the person in the registration session",
      async (crmId) => {
        const person = new PersonBuilder().withPersonId(crmId).build();
        const session = new SessionBuilder().withPerson(person).build();
        vi.mocked(getRegistrationSession).mockResolvedValue(session);

        await expect(getCrmId()).rejects.toThrow("CRM ID is not defined on the Person in registration session");
      },
    );
  });

  describe("getMfaSessionKeyAndCrmId", () => {
    it("should return MfaSessionKey and CrmId from registration session", async () => {
      const person = new PersonBuilder().withPersonId(mockCrmId).build();
      const session = new SessionBuilder().withSessionId(mockSessionId).withPerson(person).build();
      vi.mocked(getRegistrationSession).mockResolvedValue(session);

      const [mfaSessionKey, crmId] = await getMfaSessionKeyAndCrmId();

      expect(mfaSessionKey).toEqual(mockMfaSessionKey);
      expect(crmId).toEqual(mockCrmId);
    });

    it.each(["", " "])(
      "should throw an error when mfaSessionKey is [%s] on the person in the registration session",
      async (mfaSessionKey) => {
        const person = new PersonBuilder().withPersonId(mockCrmId).build();
        const session = new SessionBuilder().withPerson(person).build();
        session.mfaSessionKey = mfaSessionKey;
        vi.mocked(getRegistrationSession).mockResolvedValue(session);

        await expect(getMfaSessionKeyAndCrmId()).rejects.toThrow(
          "MFA Session Key does not exist on the registration session",
        );
      },
    );

    it("should throw an error when person is undefined in the registration session", async () => {
      const session = new SessionBuilder().withSessionId(mockSessionId).withPerson(undefined).build();
      vi.mocked(getRegistrationSession).mockResolvedValue(session);

      await expect(getMfaSessionKeyAndCrmId()).rejects.toThrow("Person does not exist on the registration session");
    });

    it.each(["", " "])(
      "should throw an error when crmId is [%s] on the person in the registration session",
      async (crmId) => {
        const person = new PersonBuilder().withPersonId(crmId).build();
        const session = new SessionBuilder().withSessionId(mockSessionId).withPerson(person).build();
        vi.mocked(getRegistrationSession).mockResolvedValue(session);

        await expect(getMfaSessionKeyAndCrmId()).rejects.toThrow(
          "CRM ID is not defined on the Person in registration session",
        );
      },
    );
  });
});

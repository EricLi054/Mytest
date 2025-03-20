import PersonBuilder from "#testing/builders/PersonBuilder";
import SessionBuilder from "#testing/builders/SessionBuilder";
import { getRegistrationSession } from "#utils/session";
import { describe, expect, it, vi } from "vitest";

import { getCrmId, getMatchedPerson } from "./mfa";

vi.mock("server-only", () => ({}));
vi.mock("#utils/session");

describe("mfa", () => {
  describe("getMatchedPerson", () => {
    it("should matched person in the registration session", async () => {
      const person = new PersonBuilder().withPersonId("aaa-bbb-ccc").build();
      const session = new SessionBuilder().withPerson(person).build();
      vi.mocked(getRegistrationSession).mockResolvedValue(session);

      const matchedPerson = await getMatchedPerson();

      expect(matchedPerson).toEqual(person);
    });

    it("should throw an error when person is undefined in the registration session", async () => {
      const session = new SessionBuilder().withPerson(undefined).build();
      vi.mocked(getRegistrationSession).mockResolvedValue(session);

      await expect(getCrmId()).rejects.toThrow(
        "Person does not exist on the registration session for the '/match' page",
      );
    });
  });

  describe("getCrmId", () => {
    it("should crmId from person in the registration session", async () => {
      const expectedCrmId = "aaa-bbb-ccc";
      const person = new PersonBuilder().withPersonId(expectedCrmId).build();
      const session = new SessionBuilder().withPerson(person).build();
      vi.mocked(getRegistrationSession).mockResolvedValue(session);

      const crmId = await getCrmId();

      expect(crmId).toEqual(expectedCrmId);
    });

    it("should throw an error when person is undefined in the registration session", async () => {
      const session = new SessionBuilder().withPerson(undefined).build();
      vi.mocked(getRegistrationSession).mockResolvedValue(session);

      await expect(getCrmId()).rejects.toThrow(
        "Person does not exist on the registration session for the '/match' page",
      );
    });

    it.each(["", " "])(
      "should throw an error when crmId is [%s] on the person in the registration session",
      async (crmId) => {
        const person = new PersonBuilder().withPersonId(crmId).build();
        const session = new SessionBuilder().withPerson(person).build();
        vi.mocked(getRegistrationSession).mockResolvedValue(session);

        await expect(getCrmId()).rejects.toThrow(
          "CRM ID is not defined on the Person in registration session for the '/match' page",
        );
      },
    );
  });
});

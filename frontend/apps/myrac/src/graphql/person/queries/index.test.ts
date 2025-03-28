import type { z } from "zod";
import { getOtpVerificationDetails } from "#graphql/mfa/getOtpVerificationDetails";
import { getCrmId } from "#utils/session/getCrmId";
import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { RawPersonSchema } from "./schema";
import { getPerson } from ".";
import { getPersonCache } from "../cache";
import { basicAddress } from "./testData";

vi.mock("server-only", () => ({}));
vi.mock("#utils/session/getCrmId", () => ({
  getCrmId: vi.fn(() => "123"),
}));
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("#graphql/mfa/getOtpVerificationDetails", () => ({
  getOtpVerificationDetails: vi.fn(),
}));
vi.mock("../cache", () => ({
  upsertPersonCache: vi.fn(),
  getPersonCache: vi.fn(),
  invalidatePersonCache: vi.fn(),
}));

const mockPerson: z.infer<typeof RawPersonSchema> = {
  racId: "123412341234",
  tier: "Blue",
  membershipCardNumber: "1234",
  membershipType: "Voting Member",
  title: "Mr",
  firstName: "John",
  middleName: "",
  surname: "Smith",
  homePhone: "0893001234",
  mobilePhone: "0400123456",
  personalEmailAddress: "testing@rac.com.au",
  workPhone: "",
};

const mockPersonWithAddress = {
  ...mockPerson,
  postalAddress: basicAddress,
};

const personResponse: z.infer<typeof RawPersonSchema> = {
  racId: "123412341234",
  tier: "Blue",
  membershipCardNumber: "1234",
  membershipType: "Voting Member",
  title: "Mr",
  firstName: "John",
  middleName: "",
  surname: "Smith",
  homePhone: "08 9300 1234",
  mobilePhone: "0400 123 456",
  personalEmailAddress: "testing@rac.com.au",
  workPhone: "",
};

const maskedPersonResponse: z.infer<typeof RawPersonSchema> = {
  racId: "123412341234",
  tier: "Blue",
  membershipCardNumber: "1234",
  membershipType: "Voting Member",
  title: "Mr",
  firstName: "John",
  middleName: "",
  surname: "Smith",
  homePhone: "08 **** *234",
  mobilePhone: "04** *** 456",
  personalEmailAddress: "t*****g@rac.com.au",
  workPhone: "",
  postalAddress: basicAddress,
};

const unauthenticatedResponse = {
  errors: [{ message: "Unauthenticated", name: "error" }],
  data: null,
};

describe("Person GraphQL", () => {
  it("should return an cached person when found", async () => {
    vi.mocked(getPersonCache).mockResolvedValueOnce(personResponse);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));

    const data = await getPerson({ overrideMasking: true });

    expect(data).toEqual({
      ...personResponse,
      cardColour: "Blue",
    });

    expect(execute).not.toHaveBeenCalled();
  });

  it("should return an unmasked person when masking disabled", async () => {
    vi.mocked(getPersonCache).mockResolvedValueOnce(null);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: { me: mockPerson } }));
    const data = await getPerson({ overrideMasking: true });

    expect(data).toEqual({
      ...personResponse,
      cardColour: "Blue",
    });
  });

  it("should return an unmasked person with formatted if address is there", async () => {
    vi.mocked(getPersonCache).mockResolvedValueOnce(null);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: { me: mockPersonWithAddress } }));
    const data = await getPerson({ overrideMasking: true });

    expect(data).toEqual({
      ...personResponse,
      postalAddress: basicAddress,
      cardColour: "Blue",
      formattedAddress: "HouseNumber StreetName Suburb, State Postcode",
    });
  });

  it("should return an masked person by default", async () => {
    vi.mocked(getPersonCache).mockResolvedValueOnce(null);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: { me: mockPersonWithAddress } }));
    const data = await getPerson();

    expect(data).toEqual({
      ...maskedPersonResponse,
      cardColour: "Blue",
      formattedAddress: "*********** ********** Suburb, State Postcode",
    });
  });

  it("should return an unmasked person when getOtpVerificationDetails returns authenticated", async () => {
    vi.mocked(getPersonCache).mockResolvedValueOnce(null);
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: true,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: { me: mockPersonWithAddress } }));
    const data = await getPerson({ mfaSessionKey: "mock_session_key" });

    expect(data).toEqual({
      ...personResponse,
      postalAddress: basicAddress,
      cardColour: "Blue",
      formattedAddress: "HouseNumber StreetName Suburb, State Postcode",
    });
  });

  it("should return an masked person when getOtpVerificationDetails returns unauthenticated", async () => {
    vi.mocked(getPersonCache).mockResolvedValueOnce(null);
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: false,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: { me: mockPersonWithAddress } }));
    const data = await getPerson({ mfaSessionKey: "mock_session_key" });

    expect(data).toEqual({
      ...maskedPersonResponse,
      cardColour: "Blue",
      formattedAddress: "*********** ********** Suburb, State Postcode",
    });
  });

  it("should throw an error with no CRMID", async () => {
    vi.mocked(getPersonCache).mockResolvedValueOnce(null);
    vi.mocked(getCrmId).mockResolvedValueOnce("");
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));

    await expect(getPerson()).rejects.toThrow("No CRM ID found.");
  });

  it("should redirect to login page when getPerson returns an unauthenticated error response", async () => {
    vi.mocked(getPersonCache).mockResolvedValueOnce(null);
    vi.mocked(getCrmId).mockResolvedValueOnce("123");
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve(unauthenticatedResponse));

    await expect(getPerson()).rejects.toThrow("NEXT_REDIRECT");
  });
});

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getServerSession } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { updatePerson } from ".";
import { invalidatePersonCache, upsertPersonCache } from "../cache";
import { basicAddress } from "../queries/testData";

vi.mock("server-only", () => ({}));
vi.mock("#utils/session/getCrmId");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("../cache", () => ({
  upsertPersonCache: vi.fn(),
  getPersonCache: vi.fn(),
  invalidatePersonCache: vi.fn(),
}));

const mockPerson = {
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
  postalAddress: basicAddress,
  digitalCardDetails: null,
};

describe("UpdatePerson Graphql", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true for successful update", async () => {
    const mockRequestResponse = {
      updatePerson: { person: mockPerson },
    };

    vi.mocked(upsertPersonCache).mockResolvedValueOnce(true);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockRequestResponse }));

    expect(await updatePerson({ person: { request: { surname: "Smith" } } })).toEqual(true);
  });

  it("should throw an error on successful response if the caching doesn't work", async () => {
    const mockRequestResponse = {
      updatePerson: { person: mockPerson },
    };

    vi.mocked(upsertPersonCache).mockResolvedValueOnce(false);
    vi.mocked(invalidatePersonCache).mockResolvedValueOnce(false);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockRequestResponse }));

    await expect(updatePerson({ person: { request: { surname: "Smith" } } })).rejects.toThrow(
      "Could not update the Person Cache.",
    );
  });

  it("should return false for error response", async () => {
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(
      Promise.resolve({ data: { updatePerson: null }, errors: [{ name: "Error", message: "Couldn't update" }] }),
    );

    expect(await updatePerson({ person: { request: { surname: "Smith" } } })).toEqual(false);
  });

  it("should not update person firstName", async () => {
    const mockRequestResponse = {
      updatePerson: { person: mockPerson },
    };

    vi.mocked(upsertPersonCache).mockResolvedValueOnce(true);
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockRequestResponse }));

    const variables = { person: { request: { firstName: "Jonty", surname: "Smith" } } };
    await updatePerson(variables);

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          person: expect.objectContaining({
            request: expect.not.objectContaining({
              firstName: expect.any(String),
            }),
          }),
        }),
      }),
    );
  });
});

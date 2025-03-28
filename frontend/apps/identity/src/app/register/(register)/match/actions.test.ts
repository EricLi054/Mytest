import type { RegistrationSession } from "#utils/session";
import { redirect } from "next/navigation";
import SessionBuilder from "#testing/builders/SessionBuilder";
import { getAccessToken } from "#utils/Authentication";
import { getRegistrationSession, updateRegistrationSession } from "#utils/session";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { Person, PersonMatchError } from "./types";
import { matchFormAction } from "./actions";
import { LapsedMembershipStatus } from "./types";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: () => {
    return {
      get: vi.fn(),
    };
  },
}));
vi.mock("next/navigation");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("#utils/Authentication");
vi.mock("#utils/session", async () => {
  const actual = await vi.importActual("#utils/session");
  return {
    ...actual,
    getRegistrationSession: vi.fn(),
    updateRegistrationSession: vi.fn(),
  };
});

const mockSessionId = "123456789-987654321";

vi.mock("#utils/Authentication");

const reCaptchaToken = "reCaptchaToken";

function getMockData() {
  return {
    data: {
      match: {
        matchedPerson: {
          personId: "00000000-0000-0000-0000-00000000000",
          racId: "00000001",
          firstName: "John",
          mobilePhone: "0400000000",
          membershipType: "Member",
        },
        errors: undefined,
      },
    },
  };
}

const getSession = () => new SessionBuilder().withSessionId(mockSessionId).build();

const getFormData = () => {
  const data = new FormData();
  data.append("firstName", "John");
  data.append("lastName", "Wick");
  data.append("dateOfBirth", "10/01/1980");
  data.append("identificationMethod", "mobile");
  data.append("mobileNumber", "0400000000");
  return data;
};

const setupMockAccessToken = () => {
  vi.mocked(getAccessToken).mockResolvedValue("mockToken");
};

const setupMockSession = (session?: RegistrationSession) => {
  vi.mocked(getRegistrationSession).mockResolvedValue(session ?? getSession());
};

describe("matchFormAction", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, score: 1 }),
      }),
    );
  });

  it("should reject requests when reCAPTCHA fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false, score: 1 }),
      }),
    );
    setupMockSession();
    await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(redirect).toHaveBeenCalledWith("/register/error/system-unavailable");
  });

  it("should reject requests when reCAPTCHA score is below threshold", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, score: 0.2 }),
      }),
    );
    setupMockSession();
    await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(redirect).toHaveBeenCalledWith("/register/error/system-unavailable");
  });

  it("should match a member", async () => {
    const mockData = getMockData();
    setupMockAccessToken();
    setupMockSession();
    vi.mocked(execute).mockResolvedValue(mockData);

    const result = await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(result).toBeDefined();
    expect(result?.status).toBe("success");
    expect(redirect).not.toHaveBeenCalled();
    expect(updateRegistrationSession).toHaveBeenCalledWith(
      expect.objectContaining({
        session: expect.objectContaining({
          person: expect.objectContaining({
            personId: mockData.data.match.matchedPerson.personId,
          }) as Partial<Person>,
          steps: expect.objectContaining({
            match: expect.anything() as Partial<RegistrationSession["steps"]["match"]>,
          }) as Partial<RegistrationSession["steps"]>,
        }) as Partial<RegistrationSession>,
      }),
    );
  });

  it("should handle a No Match attempt", async () => {
    const noMatchErrorType = "NoMatchError";
    const mockData = {
      data: {
        match: {
          matchedPerson: null,
          errors: [
            {
              type: noMatchErrorType,
            },
          ],
        },
      },
    };
    setupMockAccessToken();
    setupMockSession();
    vi.mocked(execute).mockResolvedValue(mockData);

    const result = await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(result).toBeDefined();
    expect(result?.status).toBe("error");
    expect(result?.error).toStrictEqual({ "": [noMatchErrorType satisfies PersonMatchError] });
    expect(updateRegistrationSession).toHaveBeenCalledWith(
      expect.objectContaining({
        session: expect.objectContaining({ incorrectMatchAttempts: 1 }) as Partial<RegistrationSession>,
      }),
    );
  });

  it("should handle a Duplicate Match attempt", async () => {
    const duplicateMatchErrorType = "DuplicateMatchError";
    const mockData = {
      data: {
        match: {
          matchedPerson: null,
          errors: [
            {
              type: duplicateMatchErrorType,
            },
          ],
        },
      },
    };
    setupMockAccessToken();
    setupMockSession();
    vi.mocked(execute).mockResolvedValue(mockData);

    const result = await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(result).toBeDefined();
    expect(result?.status).toBe("error");
    expect(result?.error).toStrictEqual({ "": [duplicateMatchErrorType satisfies PersonMatchError] });
    expect(updateRegistrationSession).toHaveBeenCalledWith(
      expect.objectContaining({
        session: expect.objectContaining({ incorrectMatchAttempts: 1 }) as Partial<RegistrationSession>,
      }),
    );
  });

  it("should redirect on an unhandled error", async () => {
    const mockData = {
      errors: [
        {
          message: "Unexpected Execution Error",
          path: ["match"],
          name: "Error",
          extensions: {
            code: "DOWNSTREAM_SERVICE_ERROR",
          },
        },
      ],
      data: null,
    };
    setupMockAccessToken();
    setupMockSession();
    vi.mocked(execute).mockResolvedValue(mockData);

    await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(updateRegistrationSession).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/register/error/system-unavailable");
  });

  it("should redirect to cant-find-you error page when too many attempts have already been made", async () => {
    const session = getSession();
    session.incorrectMatchAttempts = 10;
    setupMockSession(session);

    await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(execute).not.toHaveBeenCalled();
    expect(updateRegistrationSession).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/register/error/cant-find-you");
  });

  it("should redirect on final failed attempt", async () => {
    const session = getSession();
    session.incorrectMatchAttempts = 2;
    const mockData = {
      data: {
        match: {
          matchedPerson: null,
          errors: ["DuplicateMatchError"],
        },
      },
    };
    setupMockAccessToken();
    setupMockSession(session);
    vi.mocked(execute).mockResolvedValue(mockData);

    await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(redirect).toHaveBeenCalledWith("/register/error/cant-find-you");
    expect(updateRegistrationSession).toHaveBeenCalledWith(
      expect.objectContaining({
        session: expect.objectContaining({ incorrectMatchAttempts: 3 }) as Partial<RegistrationSession>,
      }),
    );
  });

  it("should return an error if incorrect data provided", async () => {
    const consoleMock = vi.spyOn(console, "log");
    setupMockSession();

    const result = await matchFormAction(undefined, new FormData(), reCaptchaToken);

    expect(result).toBeDefined();
    expect(result?.status).toBe("error");
    expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining("Form data invalid"));
  });

  it("should redirect to lapsed-membership error page when membership status is non member", async () => {
    const session = getSession();
    const mockData = getMockData();
    mockData.data.match.matchedPerson.membershipType = LapsedMembershipStatus;
    setupMockSession(session);
    vi.mocked(execute).mockResolvedValue(mockData);

    await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(updateRegistrationSession).toHaveBeenCalledWith({
      session: expect.objectContaining({ person: mockData.data.match.matchedPerson }) as Partial<RegistrationSession>,
    });
    expect(redirect).toHaveBeenCalledWith("/register/error/lapsed-membership");
  });

  it("should redirect to already-matched error page when a person already exists on the session", async () => {
    const mockData = getMockData();
    const session = new SessionBuilder()
      .withSessionId(mockSessionId)
      .withPerson(mockData.data.match.matchedPerson)
      .build();
    setupMockSession(session);

    await matchFormAction(undefined, getFormData(), reCaptchaToken);

    expect(execute).not.toHaveBeenCalled();
    expect(updateRegistrationSession).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/register/error/already-matched");
  });
});

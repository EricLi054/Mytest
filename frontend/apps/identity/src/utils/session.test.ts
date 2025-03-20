import { redirect } from "next/navigation";
import SessionBuilder from "#testing/builders/SessionBuilder";
import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import type { DataCache } from "@racwa/cache";
import { DataCacheError } from "@racwa/cache";

import type { RegistrationSession } from "./session";
import { getRegistrationErrorPageUrl } from "./routing";
import {
  createRegistrationSession,
  ensureServerSession,
  extractRedirectUrl,
  initialSession,
  validateCurrentPage,
} from "./session";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");
vi.mock("next/headers");
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

const mockSessionId = "mock-session-id";
const expectedAbsoluteTtl = 18_000_000;
const expectedSlidingTtl = 1_800_000;

type MockDataCache<T> = Pick<DataCache<T>, "create" | "get" | "set">;

export const mockDataCache = <T>(props: Partial<MockDataCache<T>> = {}) =>
  ({
    create: vi.fn<MockDataCache<T>["create"]>(),
    get: vi.fn<MockDataCache<T>["get"]>(),
    set: vi.fn<MockDataCache<T>["set"]>(),
    ...props,
  }) satisfies MockDataCache<T>;

const mockCacheCreate = vi.hoisted(() => vi.fn<DataCache<RegistrationSession>["create"]>());
const mockCacheGet = vi.hoisted(() => vi.fn<DataCache<RegistrationSession>["get"]>());
const mockCacheSet = vi.hoisted(() => vi.fn<DataCache<RegistrationSession>["set"]>());

vi.mock("@racwa/cache", async () => {
  const actual = await vi.importActual("@racwa/cache");

  return {
    ...actual,
    getCacheFor: () => mockDataCache({ create: mockCacheCreate, get: mockCacheGet, set: mockCacheSet }),
  };
});

describe("createRegistrationSession", () => {
  it("should throw unauthorised if no session", async () => {
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve(null));

    await expect(ensureServerSession()).rejects.toThrow("Unauthorized");
  });

  it("should create session with initial session and return a new session ID when successful", async () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockSessionId);
    mockCacheCreate.mockResolvedValue({ success: true, key: mockSessionId });

    const key = await createRegistrationSession();

    expect(key).toBe(mockSessionId);
    expect(mockCacheCreate).toHaveBeenCalledTimes(1);
    expect(mockCacheCreate).toHaveBeenCalledWith<Parameters<typeof mockCacheCreate>>({
      cacheKey: mockSessionId,
      data: { ...initialSession, id: mockSessionId },
      absoluteTtlMillis: expectedAbsoluteTtl,
      slidingTtlMillis: expectedSlidingTtl,
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should create session with redirect", async () => {
    const redirectUrl = "www.google.com";
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockSessionId);
    mockCacheCreate.mockResolvedValue({ success: true, key: mockSessionId });

    const key = await createRegistrationSession(redirectUrl);

    expect(key).toBe(mockSessionId);
    expect(mockCacheCreate).toHaveBeenCalledTimes(1);
    expect(mockCacheCreate).toHaveBeenCalledWith<Parameters<typeof mockCacheCreate>>({
      cacheKey: mockSessionId,
      data: { ...initialSession, id: mockSessionId, redirectUrl },
      absoluteTtlMillis: expectedAbsoluteTtl,
      slidingTtlMillis: expectedSlidingTtl,
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it.each([DataCacheError.KeyConflict, DataCacheError.KeyLocked] as const)(
    "should redirect to /system-unavailable when creating a session fails: %s",
    async (error) => {
      vi.spyOn(crypto, "randomUUID").mockReturnValue(mockSessionId);
      mockCacheCreate.mockResolvedValue({ success: false, error });

      await createRegistrationSession();

      expect(redirect).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
    },
  );
});

describe("getRegistrationSession", () => {
  it.todo("should redirect when there is no session ID cookie");

  it.todo("should redirect when there is a session ID cookie but no session");

  it.todo("should validate the page is accessible with the current session");
});

describe("updateRegistrationSession", () => {
  it.todo("should update the session");

  it.todo("should redirect when there is no session ID cookie");

  it.todo("should redirect when there is a session ID cookie but no session");
});

describe("validateCurrentPage", () => {
  it("should not redirect a valid session", () => {
    const session = new SessionBuilder().build();

    validateCurrentPage({ currentPage: "/", session });

    expect(redirect).not.toHaveBeenCalled();
  });

  it("should redirect when match attempts exceeded", () => {
    const session = new SessionBuilder().withIncorrectMatchAttempts(10).build();

    validateCurrentPage({ currentPage: "/", session });

    expect(redirect).toHaveBeenCalledWith("/register/error/cant-find-you");
  });
});

function createUrl(redirectUrl: string) {
  const url = new URL("https://www.rac.com.au");
  url.searchParams.set("redirectUrl", redirectUrl);
  return url.toString();
}

describe("extractRedirectUrl", () => {
  it.each([
    { referer: null, expected: undefined },
    { referer: "", expected: undefined },
    { referer: "not a url", expected: undefined },
    { referer: "https://www.rac.com.au?other=https%3A%2F%2Frac.com.au", expected: undefined },
    { referer: createUrl("not a url"), expected: undefined },
    { referer: createUrl("https://rac.com.au"), expected: "https://rac.com.au" },
    { referer: createUrl("https://claims.rac.com.au"), expected: "https://claims.rac.com.au" },
    { referer: createUrl("https://new.claims.rac.com.au"), expected: undefined },
  ])("should validate a $referer referer", ({ referer, expected }) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(extractRedirectUrl(referer, ["rac.com.au"], () => {})).toBe(expected);
  });
});

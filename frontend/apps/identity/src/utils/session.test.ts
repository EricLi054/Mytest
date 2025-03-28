import type { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PersonBuilder from "#testing/builders/PersonBuilder";
import SessionBuilder from "#testing/builders/SessionBuilder";
import { mockDataCache } from "#testing/cache";
import { mockReadonlyRequestCookies } from "#testing/next";
import { getServerSession } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DataCache } from "@racwa/cache";
import { DataCacheError } from "@racwa/cache";
import { createMfaSessionKey } from "@racwa/mfa";

import type { RegistrationPage } from "./routing";
import type { RegistrationSession } from "./session";
import { getRegistrationErrorPageUrl } from "./routing";
import {
  createRegistrationSession,
  ensureServerSession,
  extractRedirectUrl,
  getRegistrationSession,
  getSessionId,
  initialSession,
  SESSION_COOKIE_NAME,
  updateRegistrationSession,
  validateCurrentPage,
} from "./session";

vi.mock("server-only", () => ({}));
vi.mock("next/headers");
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

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

const mockRedirectError = new Error("Mock NEXT_REDIRECT");
const mockRedirect = vi.fn<typeof redirect>();
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    redirect: (...args: Parameters<typeof redirect>) => mockRedirect(...args),
  };
});

const mockSessionId = "mock-session-id";
const mockMfaSessionKey = createMfaSessionKey("my-rac-account-registration", mockSessionId);
const expectedAbsoluteTtl = 18_000_000;
const expectedSlidingTtl = 1_800_000;

const formPages: RegistrationPage["formPage"][] = ["/", "/match", "/link-member"];

describe("Session", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockRedirect.mockImplementation(() => {
      throw mockRedirectError; // Ensure execution halts
    });
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
        data: { ...initialSession, id: mockSessionId, mfaSessionKey: mockMfaSessionKey },
        absoluteTtlMillis: expectedAbsoluteTtl,
        slidingTtlMillis: expectedSlidingTtl,
      });
      expect(mockRedirect).not.toHaveBeenCalled();
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
        data: { ...initialSession, id: mockSessionId, mfaSessionKey: mockMfaSessionKey, redirectUrl },
        absoluteTtlMillis: expectedAbsoluteTtl,
        slidingTtlMillis: expectedSlidingTtl,
      });
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it.each([DataCacheError.KeyConflict, DataCacheError.KeyLocked] as const)(
      "should redirect to /system-unavailable when creating a session fails: %s",
      async (error) => {
        vi.spyOn(crypto, "randomUUID").mockReturnValue(mockSessionId);
        mockCacheCreate.mockResolvedValue({ success: false, error });

        await expect(async () => await createRegistrationSession()).rejects.toThrow(mockRedirectError);

        expect(mockRedirect).toHaveBeenCalledTimes(1);
        expect(mockRedirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
      },
    );
  });

  describe("getSessionId", () => {
    it("should return session ID when there is a session ID cookie", async () => {
      const mockRequestCookies = mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue({ name: SESSION_COOKIE_NAME, value: mockSessionId }),
      });
      vi.mocked(cookies).mockResolvedValue(mockRequestCookies);

      const result = await getSessionId();

      expect(result).toBe(mockSessionId);
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should redirect to /system-unavailable when there is no session ID cookie", async () => {
      const mockRequestCookies = mockReadonlyRequestCookies();
      vi.mocked(cookies).mockResolvedValue(mockRequestCookies);

      await expect(async () => await getSessionId()).rejects.toThrow(mockRedirectError);

      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
    });
  });

  describe("getRegistrationSession", () => {
    it.each(formPages)(
      "should redirect when there is a session ID cookie but no session and current page is %s",
      async (page) => {
        const mockRequestCookies = mockReadonlyRequestCookies({
          get: vi.fn().mockReturnValue({ name: SESSION_COOKIE_NAME, value: mockSessionId }),
        });
        vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
        mockCacheGet.mockResolvedValue({
          success: false,
          error: DataCacheError.KeyNotFound,
        });

        await expect(async () => await getRegistrationSession({ currentPage: page })).rejects.toThrow(
          mockRedirectError,
        );

        expect(mockCacheGet).toHaveBeenCalledTimes(1);
        expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
          cacheKey: mockSessionId,
        });
        expect(mockRedirect).toHaveBeenCalledTimes(1);
        expect(mockRedirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/session-timeout" }));
      },
    );

    it.each(formPages)("should validate the current page %s is accessible with the current session", async (page) => {
      const mockSession = new SessionBuilder().withSessionId(mockSessionId).build();
      const mockRequestCookies = mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue({ name: SESSION_COOKIE_NAME, value: mockSessionId }),
      });
      vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
      mockCacheGet.mockResolvedValue({
        success: true,
        value: mockSession,
        ttlMillis: expectedSlidingTtl,
      });

      const session = await getRegistrationSession({ currentPage: page });

      expect(session).toEqual(mockSession);
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("updateRegistrationSession", () => {
    it("should redirect to /system-unavailable when there is no session ID cookie", async () => {
      const mockRequestCookies = mockReadonlyRequestCookies();
      vi.mocked(cookies).mockResolvedValue(mockRequestCookies);

      await expect(
        async () =>
          await updateRegistrationSession({ session: new SessionBuilder().withSessionId(mockSessionId).build() }),
      ).rejects.toThrow(mockRedirectError);

      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
    });

    it("should redirect when there is a session ID cookie but no session", async () => {
      const mockRequestCookies = mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue({ name: SESSION_COOKIE_NAME, value: mockSessionId }),
      });
      vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
      mockCacheGet.mockResolvedValue({
        success: false,
        error: DataCacheError.KeyNotFound,
      });

      await expect(
        async () =>
          await updateRegistrationSession({ session: new SessionBuilder().withSessionId(mockSessionId).build() }),
      ).rejects.toThrow(mockRedirectError);

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/session-timeout" }));
    });

    it("should update the session successfully", async () => {
      const mockInitialSession = new SessionBuilder().withSessionId(mockSessionId).build();
      const mockUpdatedSession: RegistrationSession = { ...mockInitialSession, person: new PersonBuilder().build() };
      const mockRequestCookies = mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue({ name: SESSION_COOKIE_NAME, value: mockSessionId }),
      });
      vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
      mockCacheGet.mockResolvedValue({
        success: true,
        value: mockInitialSession,
        ttlMillis: expectedSlidingTtl,
      });
      mockCacheSet.mockResolvedValue({ success: true });

      await updateRegistrationSession({ session: mockUpdatedSession });

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockCacheSet).toHaveBeenCalledTimes(1);
      expect(mockCacheSet).toHaveBeenCalledWith<Parameters<typeof mockCacheSet>>({
        cacheKey: mockSessionId,
        data: mockUpdatedSession,
      });
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should redirect to the system-unavailable error page when updating the session fails with error DataCacheError.KeyNotFound", async () => {
      const mockInitialSession = new SessionBuilder().withSessionId(mockSessionId).build();
      const mockUpdatedSession: RegistrationSession = { ...mockInitialSession, person: new PersonBuilder().build() };
      const mockRequestCookies = mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue({ name: SESSION_COOKIE_NAME, value: mockSessionId }),
      });
      vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
      mockCacheGet.mockResolvedValue({
        success: true,
        value: mockInitialSession,
        ttlMillis: expectedSlidingTtl,
      });
      mockCacheSet.mockResolvedValue({ success: false, error: DataCacheError.KeyNotFound });

      await expect(async () => await updateRegistrationSession({ session: mockUpdatedSession })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockCacheSet).toHaveBeenCalledTimes(1);
      expect(mockCacheSet).toHaveBeenCalledWith<Parameters<typeof mockCacheSet>>({
        cacheKey: mockSessionId,
        data: mockUpdatedSession,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/session-timeout" }));
    });

    it("should redirect to the session-timeout error page when updating the session fails with error DataCacheError.KeyLocked", async () => {
      const mockInitialSession = new SessionBuilder().withSessionId(mockSessionId).build();
      const mockUpdatedSession: RegistrationSession = { ...mockInitialSession, person: new PersonBuilder().build() };
      const mockRequestCookies = mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue({ name: SESSION_COOKIE_NAME, value: mockSessionId }),
      });
      vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
      mockCacheGet.mockResolvedValue({
        success: true,
        value: mockInitialSession,
        ttlMillis: expectedSlidingTtl,
      });
      mockCacheSet.mockResolvedValue({ success: false, error: DataCacheError.KeyLocked });

      await expect(async () => await updateRegistrationSession({ session: mockUpdatedSession })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockCacheSet).toHaveBeenCalledTimes(1);
      expect(mockCacheSet).toHaveBeenCalledWith<Parameters<typeof mockCacheSet>>({
        cacheKey: mockSessionId,
        data: mockUpdatedSession,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
    });

    it.todo("should redirect to session-timeout error page when updating the session fails");

    it.todo("should redirect to system-unavailable error page when updating the session fails");
  });

  describe("validateCurrentPage", () => {
    it.each(formPages)("should not redirect a valid session when current page is %s", (page) => {
      const session = new SessionBuilder().build();

      validateCurrentPage({ currentPage: page, session });

      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it.each(formPages)("should redirect when match attempts exceeded and current page is %s", (page) => {
      mockRedirect.mockReset();
      const session = new SessionBuilder().withIncorrectMatchAttempts(10).build();

      validateCurrentPage({ currentPage: page, session });

      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/cant-find-you" }));
    });
  });

  describe("extractRedirectUrl", () => {
    function createUrl(redirectUrl: string) {
      const url = new URL("https://www.rac.com.au");
      url.searchParams.set("redirectUrl", redirectUrl);
      return url.toString();
    }

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
});

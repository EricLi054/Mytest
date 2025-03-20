import type { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { mockDataCache } from "#testing/cache";
import { mockReadonlyRequestCookies } from "#testing/next";
import { getCrmId } from "#utils/getCrmId";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DataCache } from "@racwa/cache";
import { DataCacheError } from "@racwa/cache";

import type { CreateUpdateYourVehicleSessionArgs } from ".";
import type { UpdateYourVehiclePage } from "../routing";
import type { UpdateYourVehicleSession } from "./types";
import {
  createUpdateYourVehicleSession,
  getUpdateYourVehicleSession,
  setUpdateYourVehicleSession,
  uyvSessionIdCookieName,
} from ".";
import { getUpdateYourVehiclePageUrl, getUpdateYourVehicleTimeoutUrl } from "../routing";

vi.mock("server-only", () => ({}));
vi.mock("next/headers");

const mockRedirectError = new Error("Mock NEXT_REDIRECT");
const mockRedirect = vi.fn<typeof redirect>();
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    redirect: (...args: Parameters<typeof redirect>) => mockRedirect(...args),
  };
});

const mockCacheCreate = vi.hoisted(() => vi.fn<DataCache<UpdateYourVehicleSession>["create"]>());
const mockCacheGet = vi.hoisted(() => vi.fn<DataCache<UpdateYourVehicleSession>["get"]>());
const mockCacheSet = vi.hoisted(() => vi.fn<DataCache<UpdateYourVehicleSession>["set"]>());
vi.mock("@racwa/cache", async () => {
  const actual = await vi.importActual("@racwa/cache");

  return {
    ...actual,
    getCacheFor: () => mockDataCache({ create: mockCacheCreate, get: mockCacheGet, set: mockCacheSet }),
  };
});

vi.mock("#utils/getCrmId");

const mockTtlMillis = 12345;
const mockCrmId = "mock-crm-id";
const mockSessionId = "mock-session-id";

const mockInitialSessionData = {
  firstName: "Anurag",
  productHoldingHeaderId: "phh-id",
  productHoldingLineId: "phl-id",
  currentVehicleDetails: {
    year: 2024,
    make: "Volkswagen",
    model: "Tiguan",
    variant: null,
    series: null,
    body: null,
    height: null,
    length: null,
    width: null,
    kerbWeight: null,
    transmission: null,
    fuel: null,
    cylinder: null,
    cc: null,
    co2Emission: null,
    registrationNumber: "MU5TB3N1C3",
    vin: null,
    nvic: null,
    color: null,
    vehicleType: "CAR",
  },
} as const satisfies CreateUpdateYourVehicleSessionArgs;

const initialSessionSteps = {
  yourVehicle: undefined,
  updateVehicle: undefined,
  confirmVehicle: { vehicleUpdated: false },
} as const satisfies UpdateYourVehicleSession["steps"];

describe("session", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    const mockCookies = mockReadonlyRequestCookies({
      get: vi.fn().mockReturnValue({ name: uyvSessionIdCookieName, value: mockSessionId }),
    });

    vi.mocked(cookies).mockResolvedValue(mockCookies);
    vi.mocked(getCrmId).mockResolvedValue(mockCrmId);

    mockRedirect.mockImplementation(() => {
      throw mockRedirectError;
    });
  });

  describe("createUpdateYourVehicleSession", () => {
    const expectedAbsoluteTtl = 18_000_000;
    const expectedSlidingTtl = 1_800_000;

    it("should create session with initial session and return a new session ID when successful", async () => {
      vi.spyOn(crypto, "randomUUID").mockReturnValue(mockSessionId);
      mockCacheCreate.mockResolvedValue({ success: true, key: mockSessionId });

      const result = await createUpdateYourVehicleSession(mockInitialSessionData);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.sessionId).toBe(mockSessionId);
      }

      expect(getCrmId).toHaveBeenCalledTimes(1);
      expect(mockCacheCreate).toHaveBeenCalledTimes(1);
      expect(mockCacheCreate).toHaveBeenCalledWith<Parameters<typeof mockCacheCreate>>({
        cacheKey: mockSessionId,
        data: {
          ...mockInitialSessionData,
          searchedVehicleDetails: undefined,
          crmId: mockCrmId,
          steps: initialSessionSteps,
        },
        absoluteTtlMillis: expectedAbsoluteTtl,
        slidingTtlMillis: expectedSlidingTtl,
      });
    });

    it("should return a failure result when there is no crmId", async () => {
      vi.mocked(getCrmId).mockResolvedValue(undefined);

      const result = await createUpdateYourVehicleSession(mockInitialSessionData);

      expect(result.success).toBe(false);
      expect(getCrmId).toHaveBeenCalledTimes(1);
      expect(mockCacheCreate).toHaveBeenCalledTimes(0);
    });

    it.each([DataCacheError.KeyConflict, DataCacheError.KeyLocked] as const)(
      "should return a failure result when creating a session fails: %s",
      async (error) => {
        vi.spyOn(crypto, "randomUUID").mockReturnValue(mockSessionId);
        mockCacheCreate.mockResolvedValue({ success: false, error });

        const result = await createUpdateYourVehicleSession(mockInitialSessionData);

        expect(result.success).toBe(false);
        expect(getCrmId).toHaveBeenCalledTimes(1);
        expect(mockCacheCreate).toHaveBeenCalledTimes(1);
        expect(mockCacheCreate).toHaveBeenCalledWith<Parameters<typeof mockCacheCreate>>({
          cacheKey: mockSessionId,
          data: {
            crmId: mockCrmId,
            searchedVehicleDetails: undefined,
            ...mockInitialSessionData,
            steps: initialSessionSteps,
          },
          absoluteTtlMillis: expectedAbsoluteTtl,
          slidingTtlMillis: expectedSlidingTtl,
        });
      },
    );
  });

  describe("getUpdateYourVehicleSession", () => {
    it("should redirect to /system-unavailable when there is no session ID cookie", async () => {
      const mockCookies = mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue(undefined),
      });

      vi.mocked(cookies).mockResolvedValue(mockCookies);

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/your-vehicle" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).not.toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    });

    it("should redirect to /session-timeout when there is a session ID cookie but no session", async () => {
      mockCacheGet.mockResolvedValue({
        success: false,
        error: DataCacheError.KeyNotFound,
      });

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/your-vehicle" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehicleTimeoutUrl({ previousPage: "/your-vehicle" }));
    });

    it("should redirect to /system-unavailable when the request is missing a crmID", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: { yourVehicle: undefined, updateVehicle: undefined, confirmVehicle: { vehicleUpdated: false } },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });
      vi.mocked(getCrmId).mockResolvedValue(undefined);

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/your-vehicle" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    });

    it("should redirect to /system-unavailable when the current CRM ID does not match the one in session", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: { yourVehicle: undefined, updateVehicle: undefined, confirmVehicle: { vehicleUpdated: false } },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });
      vi.mocked(getCrmId).mockResolvedValue("someone else's CRM ID");

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/your-vehicle" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    });

    it("should redirect to /your-vehicle when /your-vehicle is not completed and currentPage is /", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: { yourVehicle: undefined, updateVehicle: undefined, confirmVehicle: { vehicleUpdated: false } },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/your-vehicle" }));
    });

    it("should redirect to /update-vehicle when /your-vehicle is not completed and currentPage is /", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: {
          yourVehicle: { vehicleUse: "Private use", isBrokenDown: "Yes" },
          updateVehicle: undefined,
          confirmVehicle: { vehicleUpdated: false },
        },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/update-vehicle" }));
    });

    it("should redirect to /confirm-vehicle when /update-vehicle is not completed and currentPage is /", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: {
          yourVehicle: { vehicleUse: "Private use", isBrokenDown: "Yes" },
          updateVehicle: {
            vehicleType: "Car",
            vehicleRego: "MU5TB3N1C3",
            vehicleColour: "Gold",
            vehicleSelect: "true",
            vehicleNotFound: "false",
          },
          confirmVehicle: { vehicleUpdated: false },
        },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/confirm-vehicle" }));
    });

    it("should return session when /your-vehicle is not completed and currentPage is /your-vehicle", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: { yourVehicle: undefined, updateVehicle: undefined, confirmVehicle: { vehicleUpdated: false } },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const { session, sessionTtl } = await getUpdateYourVehicleSession({ currentPage: "/your-vehicle" });

      expect(session).toEqual(expectedSession);
      expect(sessionTtl).toBe(mockTtlMillis);
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should redirect to /your-vehicle when /your-vehicle is not completed and currentPage is /update-vehicle", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: { yourVehicle: undefined, updateVehicle: undefined, confirmVehicle: { vehicleUpdated: false } },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/update-vehicle" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/your-vehicle" }));
    });

    it.each(["/your-vehicle", "/update-vehicle"] as const satisfies UpdateYourVehiclePage["formPage"][])(
      "should return session when /your-vehicle is completed and currentPage is %s",
      async (currentPage) => {
        const expectedSession = {
          ...mockInitialSessionData,
          crmId: mockCrmId,
          searchedVehicleDetails: undefined,
          steps: {
            yourVehicle: { vehicleUse: "Private use", isBrokenDown: "Yes" },
            updateVehicle: undefined,
            confirmVehicle: { vehicleUpdated: false },
          },
        } as const satisfies UpdateYourVehicleSession;

        mockCacheGet.mockResolvedValue({
          success: true,
          value: expectedSession,
          ttlMillis: mockTtlMillis,
        });

        const { session, sessionTtl } = await getUpdateYourVehicleSession({ currentPage });

        expect(session).toEqual(expectedSession);
        expect(sessionTtl).toBe(mockTtlMillis);
        expect(mockCacheGet).toHaveBeenCalledTimes(1);
        expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
          cacheKey: mockSessionId,
        });
        expect(mockRedirect).not.toHaveBeenCalled();
      },
    );

    it("should redirect to /update-vehicle when /update-vehicle is not completed and currentPage is /confirm-vehicle", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: {
          yourVehicle: { vehicleUse: "Private use", isBrokenDown: "Yes" },
          updateVehicle: undefined,
          confirmVehicle: { vehicleUpdated: false },
        },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/confirm-vehicle" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/update-vehicle" }));
    });

    it.each([
      "/your-vehicle",
      "/update-vehicle",
      "/confirm-vehicle",
    ] as const satisfies UpdateYourVehiclePage["formPage"][])(
      "should return session when /update-vehicle is completed and currentPage is %s",
      async (currentPage) => {
        const expectedSession = {
          ...mockInitialSessionData,
          crmId: mockCrmId,
          searchedVehicleDetails: undefined,
          steps: {
            yourVehicle: { vehicleUse: "Private use", isBrokenDown: "Yes" },
            updateVehicle: {
              vehicleType: "Car",
              vehicleRego: "MU5TB3N1C3",
              vehicleColour: "Gold",
              vehicleSelect: "true",
              vehicleNotFound: "false",
            },
            confirmVehicle: { vehicleUpdated: false },
          },
        } as const satisfies UpdateYourVehicleSession;

        mockCacheGet.mockResolvedValue({
          success: true,
          value: expectedSession,
          ttlMillis: mockTtlMillis,
        });

        const { session, sessionTtl } = await getUpdateYourVehicleSession({ currentPage });

        expect(session).toEqual(expectedSession);
        expect(sessionTtl).toBe(mockTtlMillis);
        expect(mockCacheGet).toHaveBeenCalledTimes(1);
        expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
          cacheKey: mockSessionId,
        });
        expect(mockRedirect).not.toHaveBeenCalled();
      },
    );

    it("should redirect to /confirm-vehicle when /confirm-vehicle is not completed and currentPage is /confirmation", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: {
          yourVehicle: { vehicleUse: "Private use", isBrokenDown: "Yes" },
          updateVehicle: {
            vehicleType: "Car",
            vehicleRego: "MU5TB3N1C3",
            vehicleColour: "Gold",
            vehicleSelect: "true",
            vehicleNotFound: "false",
          },
          confirmVehicle: { vehicleUpdated: false },
        },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      await expect(async () => await getUpdateYourVehicleSession({ currentPage: "/confirmation" })).rejects.toThrow(
        mockRedirectError,
      );

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/confirm-vehicle" }));
    });

    it("should return session when /confirm-vehicle is completed and currentPage is /confirmation", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        crmId: mockCrmId,
        searchedVehicleDetails: undefined,
        steps: {
          yourVehicle: { vehicleUse: "Private use", isBrokenDown: "Yes" },
          updateVehicle: {
            vehicleType: "Car",
            vehicleRego: "MU5TB3N1C3",
            vehicleColour: "Gold",
            vehicleSelect: "true",
            vehicleNotFound: "false",
          },
          confirmVehicle: { vehicleUpdated: true },
        },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const { session, sessionTtl } = await getUpdateYourVehicleSession({ currentPage: "/confirmation" });

      expect(session).toEqual(expectedSession);
      expect(sessionTtl).toBe(mockTtlMillis);
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it.each([
      "/",
      "/your-vehicle",
      "/update-vehicle",
      "/confirm-vehicle",
    ] as const satisfies UpdateYourVehiclePage["formPage"][])(
      "should redirect to /confirmation when /confirm-vehicle is completed and currentPage is %s",
      async (currentPage) => {
        const expectedSession = {
          ...mockInitialSessionData,
          crmId: mockCrmId,
          searchedVehicleDetails: undefined,
          steps: {
            yourVehicle: { vehicleUse: "Private use", isBrokenDown: "Yes" },
            updateVehicle: {
              vehicleType: "Car",
              vehicleRego: "MU5TB3N1C3",
              vehicleColour: "Gold",
              vehicleSelect: "true",
              vehicleNotFound: "false",
            },
            confirmVehicle: { vehicleUpdated: true },
          },
        } as const satisfies UpdateYourVehicleSession;

        mockCacheGet.mockResolvedValue({
          success: true,
          value: expectedSession,
          ttlMillis: mockTtlMillis,
        });

        await expect(async () => await getUpdateYourVehicleSession({ currentPage })).rejects.toThrow(mockRedirectError);

        expect(mockCacheGet).toHaveBeenCalledTimes(1);
        expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
          cacheKey: mockSessionId,
        });
        expect(mockRedirect).toHaveBeenCalledTimes(1);
        expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/confirmation" }));
      },
    );
  });

  describe("setUpdateYourVehicleSession", () => {
    const existingSession = {
      ...mockInitialSessionData,
      crmId: mockCrmId,
      searchedVehicleDetails: undefined,
      steps: { yourVehicle: undefined, updateVehicle: undefined, confirmVehicle: { vehicleUpdated: false } },
    } as const satisfies UpdateYourVehicleSession;

    const updatedSession = {
      ...mockInitialSessionData,
      crmId: mockCrmId,
      searchedVehicleDetails: undefined,
      steps: {
        yourVehicle: { vehicleUse: "Private use", isBrokenDown: "Yes" },
        updateVehicle: undefined,
        confirmVehicle: { vehicleUpdated: false },
      },
    } as const satisfies UpdateYourVehicleSession;

    it("should update the session", async () => {
      mockCacheGet.mockResolvedValue({
        success: true,
        value: existingSession,
        ttlMillis: mockTtlMillis,
      });
      mockCacheSet.mockResolvedValue({ success: true });

      await setUpdateYourVehicleSession({ session: updatedSession, currentPage: "/your-vehicle" });

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockCacheSet).toHaveBeenCalledTimes(1);
      expect(mockCacheSet).toHaveBeenCalledWith<Parameters<typeof mockCacheSet>>({
        cacheKey: mockSessionId,
        data: updatedSession,
      });
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should redirect to /system-unavailable when there is no session ID cookie", async () => {
      const mockCookies = mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue(undefined),
      });

      vi.mocked(cookies).mockResolvedValue(mockCookies);

      await expect(
        async () => await setUpdateYourVehicleSession({ session: updatedSession, currentPage: "/your-vehicle" }),
      ).rejects.toThrow(mockRedirectError);

      expect(mockCacheGet).not.toHaveBeenCalled();
      expect(mockCacheSet).not.toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    });

    it("should redirect to /session-timeout when there is a session ID cookie but existing session is not found", async () => {
      mockCacheGet.mockResolvedValue({
        success: false,
        error: DataCacheError.KeyNotFound,
      });

      await expect(
        async () => await setUpdateYourVehicleSession({ session: updatedSession, currentPage: "/your-vehicle" }),
      ).rejects.toThrow(mockRedirectError);

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockCacheSet).not.toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehicleTimeoutUrl({ previousPage: "/your-vehicle" }));
    });

    it("should redirect to /system-unavailable when the request is missing a crmID", async () => {
      mockCacheGet.mockResolvedValue({
        success: true,
        value: existingSession,
        ttlMillis: mockTtlMillis,
      });
      vi.mocked(getCrmId).mockResolvedValue(undefined);

      await expect(
        async () => await setUpdateYourVehicleSession({ session: updatedSession, currentPage: "/your-vehicle" }),
      ).rejects.toThrow(mockRedirectError);

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockCacheSet).not.toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    });

    it("should redirect to /system-unavailable when the current CRM ID does not match the one in session", async () => {
      mockCacheGet.mockResolvedValue({
        success: true,
        value: existingSession,
        ttlMillis: mockTtlMillis,
      });
      vi.mocked(getCrmId).mockResolvedValue("someone else's CRM ID");

      await expect(
        async () => await setUpdateYourVehicleSession({ session: updatedSession, currentPage: "/your-vehicle" }),
      ).rejects.toThrow(mockRedirectError);

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockCacheSet).not.toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    });

    it("should redirect to /session-timeout when there is a session ID cookie but no session to update", async () => {
      mockCacheGet.mockResolvedValue({
        success: true,
        value: existingSession,
        ttlMillis: mockTtlMillis,
      });
      mockCacheSet.mockResolvedValue({
        success: false,
        error: DataCacheError.KeyNotFound,
      });

      await expect(
        async () => await setUpdateYourVehicleSession({ session: updatedSession, currentPage: "/your-vehicle" }),
      ).rejects.toThrow(mockRedirectError);

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockCacheSet).toHaveBeenCalledTimes(1);
      expect(mockCacheSet).toHaveBeenCalledWith<Parameters<typeof mockCacheSet>>({
        cacheKey: mockSessionId,
        data: updatedSession,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehicleTimeoutUrl({ previousPage: "/your-vehicle" }));
    });

    it("should redirect to /system-unavailable when setting the session fails", async () => {
      mockCacheGet.mockResolvedValue({
        success: true,
        value: existingSession,
        ttlMillis: mockTtlMillis,
      });
      mockCacheSet.mockResolvedValue({
        success: false,
        error: DataCacheError.KeyLocked,
      });

      await expect(
        async () => await setUpdateYourVehicleSession({ session: updatedSession, currentPage: "/your-vehicle" }),
      ).rejects.toThrow(mockRedirectError);

      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionId,
      });
      expect(mockCacheSet).toHaveBeenCalledTimes(1);
      expect(mockCacheSet).toHaveBeenCalledWith<Parameters<typeof mockCacheSet>>({
        cacheKey: mockSessionId,
        data: updatedSession,
      });
      expect(mockRedirect).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    });
  });
});

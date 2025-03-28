import { mockDataCache } from "#testing/cache";
import { describe, expect, it, vi } from "vitest";

import type { DataCache } from "@racwa/cache";
import { DataCacheError } from "@racwa/cache";

import type { UpdateYourVehicleFormPage } from "./routing";
import type { UpdateYourVehicleSession } from "./UpdateYourVehicleSession";
import {
  createUpdateYourVehicleSession,
  getUpdateYourVehicleSession,
  setUpdateYourVehicleSession,
} from "./UpdateYourVehicleSession";

vi.mock("server-only", () => ({}));

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

const mockTtlMillis = 12345;

const mockSessionIds = {
  sessionId: "mock-session-id",
  crmId: "mock-crm-id",
} as const satisfies { sessionId: string; crmId: string };

const mockInitialSessionData = {
  crmId: mockSessionIds.crmId,
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
} as const satisfies Parameters<typeof createUpdateYourVehicleSession>[0];

const initialSessionSteps = {
  yourVehicle: undefined,
  updateVehicle: undefined,
  confirmVehicle: { vehicleUpdated: false },
} as const satisfies UpdateYourVehicleSession["steps"];

describe("UpdateYourVehicleSession", () => {
  describe("createUpdateYourVehicleSession", () => {
    const expectedAbsoluteTtl = 18_000_000;
    const expectedSlidingTtl = 1_800_000;

    it("should create session with initial session and return a new session ID when successful", async () => {
      const { sessionId } = mockSessionIds;

      vi.spyOn(crypto, "randomUUID").mockReturnValue(sessionId);
      mockCacheCreate.mockResolvedValue({ success: true, key: sessionId });

      const result = await createUpdateYourVehicleSession(mockInitialSessionData);

      expect(result).toEqual({ success: true, sessionId });
      expect(mockCacheCreate).toHaveBeenCalledTimes(1);
      expect(mockCacheCreate).toHaveBeenCalledWith<Parameters<typeof mockCacheCreate>>({
        cacheKey: sessionId,
        data: {
          ...mockInitialSessionData,
          searchedVehicleDetails: undefined,
          steps: initialSessionSteps,
        },
        absoluteTtlMillis: expectedAbsoluteTtl,
        slidingTtlMillis: expectedSlidingTtl,
      });
    });

    it.each([DataCacheError.KeyConflict, DataCacheError.KeyLocked] as const)(
      "should return a failure result with redirectTo /system-unavailable when creating a session fails for reason %s",
      async (error) => {
        const { sessionId } = mockSessionIds;

        vi.spyOn(crypto, "randomUUID").mockReturnValue(sessionId);
        mockCacheCreate.mockResolvedValue({ success: false, error });

        const result = await createUpdateYourVehicleSession(mockInitialSessionData);

        expect(result).toEqual({ success: false });
        expect(mockCacheCreate).toHaveBeenCalledTimes(1);
        expect(mockCacheCreate).toHaveBeenCalledWith<Parameters<typeof mockCacheCreate>>({
          cacheKey: sessionId,
          data: {
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
    it("should return failure result with redirectTo /session-timeout when session is not found", async () => {
      mockCacheGet.mockResolvedValue({ success: false, error: DataCacheError.KeyNotFound });

      const result = await getUpdateYourVehicleSession({ currentPage: "/your-vehicle", ...mockSessionIds });

      expect(result).toEqual({ success: false, redirectTo: "/session-timeout" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
    });

    it("should return failure result with redirectTo /system-unavailable when CRM ID does not match the CRM ID in session", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const result = await getUpdateYourVehicleSession({
        currentPage: "/your-vehicle",
        ...mockSessionIds,
        crmId: "🧑‍💻 Hacker",
      });

      expect(result).toEqual({ success: false, redirectTo: "/system-unavailable" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
    });

    it.each(["/your-vehicle", "/update-vehicle", "/confirm-vehicle"] as const satisfies Exclude<
      UpdateYourVehicleFormPage,
      "confirmation"
    >[])(
      "should return failure result with redirectTo /confirmation when current page is %p and vehicle is already updated",
      async (currentPage) => {
        const expectedSession = {
          ...mockInitialSessionData,
          searchedVehicleDetails: undefined,
          steps: { ...initialSessionSteps, confirmVehicle: { vehicleUpdated: true } },
        } as const satisfies UpdateYourVehicleSession;

        mockCacheGet.mockResolvedValue({
          success: true,
          value: expectedSession,
          ttlMillis: mockTtlMillis,
        });

        const result = await getUpdateYourVehicleSession({ currentPage, ...mockSessionIds });

        expect(result).toEqual({ success: false, redirectTo: "/confirmation" });
        expect(mockCacheGet).toHaveBeenCalledTimes(1);
        expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
          cacheKey: mockSessionIds.sessionId,
        });
      },
    );

    it("should return failure result with redirectTo /your-vehicle when current page is /update-vehicle and /your-vehicle has not been completed", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const result = await getUpdateYourVehicleSession({ currentPage: "/update-vehicle", ...mockSessionIds });

      expect(result).toEqual({ success: false, redirectTo: "/your-vehicle" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
    });

    it("should return failure result with redirectTo /your-vehicle when current page is /confirm-vehicle and /your-vehicle has not been completed", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const result = await getUpdateYourVehicleSession({ currentPage: "/confirm-vehicle", ...mockSessionIds });

      expect(result).toEqual({ success: false, redirectTo: "/your-vehicle" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
    });

    it("should return failure result with redirectTo /update-vehicle when current page is /confirm-vehicle and /update-vehicle has not been completed", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: { ...initialSessionSteps, yourVehicle: { vehicleUse: "Private use", isBrokenDown: "No" } },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const result = await getUpdateYourVehicleSession({ currentPage: "/confirm-vehicle", ...mockSessionIds });

      expect(result).toEqual({ success: false, redirectTo: "/update-vehicle" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
    });

    it("should return failure result with redirectTo /your-vehicle when current page is /confirmation and /your-vehicle has not been completed", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const result = await getUpdateYourVehicleSession({ currentPage: "/confirmation", ...mockSessionIds });

      expect(result).toEqual({ success: false, redirectTo: "/your-vehicle" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
    });

    it("should return failure result with redirectTo /update-vehicle when current page is /confirmation and /update-vehicle has not been completed", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: { ...initialSessionSteps, yourVehicle: { vehicleUse: "Private use", isBrokenDown: "No" } },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const result = await getUpdateYourVehicleSession({ currentPage: "/confirmation", ...mockSessionIds });

      expect(result).toEqual({ success: false, redirectTo: "/update-vehicle" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
    });

    it("should return failure result with redirectTo /confirm-vehicle when current page is /confirmation and /confirm-vehicle has not been completed", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: {
          yourVehicle: { vehicleUse: "Private use", isBrokenDown: "No" },
          updateVehicle: {
            vehicleType: "Car",
            vehicleSelect: "true",
            vehicleRego: "ANURAG",
            vehicleNotFound: "false",
            vehicleColour: "Black",
          },
          confirmVehicle: { vehicleUpdated: false },
        },
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const result = await getUpdateYourVehicleSession({ currentPage: "/confirmation", ...mockSessionIds });

      expect(result).toEqual({ success: false, redirectTo: "/confirm-vehicle" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
    });

    it("should return success result with session and session TTL when session exists", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const result = await getUpdateYourVehicleSession({ currentPage: "/your-vehicle", ...mockSessionIds });

      expect(result).toEqual({ success: true, session: expectedSession, sessionTtl: mockTtlMillis });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
    });
  });

  describe("setUpdateYourVehicleSession", () => {
    it("should return failure result with redirectTo /session-timeout when session is not found when retrieving session", async () => {
      mockCacheGet.mockResolvedValue({ success: false, error: DataCacheError.KeyNotFound });

      const result = await setUpdateYourVehicleSession({
        session: { ...mockInitialSessionData, searchedVehicleDetails: undefined, steps: initialSessionSteps },
        ...mockSessionIds,
      });

      expect(result).toEqual({ success: false, redirectTo: "/session-timeout" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
      expect(mockCacheSet).not.toHaveBeenCalled();
    });

    it("should return failure result with redirectTo /system-unavailable when CRM ID does not match the CRM ID in session", async () => {
      const expectedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      } as const satisfies UpdateYourVehicleSession;

      mockCacheGet.mockResolvedValue({
        success: true,
        value: expectedSession,
        ttlMillis: mockTtlMillis,
      });

      const result = await setUpdateYourVehicleSession({
        session: { ...mockInitialSessionData, searchedVehicleDetails: undefined, steps: initialSessionSteps },
        ...mockSessionIds,
        crmId: "🧑‍💻 Hacker",
      });

      expect(result).toEqual({ success: false, redirectTo: "/system-unavailable" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
      expect(mockCacheSet).not.toHaveBeenCalled();
    });

    it("should return failure result with redirectTo /session-timeout when session is not found when setting session", async () => {
      const existingSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      };
      const updatedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      };

      mockCacheGet.mockResolvedValue({
        success: true,
        value: existingSession,
        ttlMillis: mockTtlMillis,
      });

      mockCacheSet.mockResolvedValue({ success: false, error: DataCacheError.KeyNotFound });

      const result = await setUpdateYourVehicleSession({ session: updatedSession, ...mockSessionIds });

      expect(result).toEqual({ success: false, redirectTo: "/session-timeout" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
      expect(mockCacheSet).toHaveBeenCalledTimes(1);
      expect(mockCacheSet).toHaveBeenCalledWith<Parameters<typeof mockCacheSet>>({
        cacheKey: mockSessionIds.sessionId,
        data: updatedSession,
      });
    });

    it("should return failure result with redirectTo /system-unavailable when setting session fails", async () => {
      const existingSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      };
      const updatedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      };

      mockCacheGet.mockResolvedValue({
        success: true,
        value: existingSession,
        ttlMillis: mockTtlMillis,
      });

      mockCacheSet.mockResolvedValue({ success: false, error: DataCacheError.KeyLocked });

      const result = await setUpdateYourVehicleSession({ session: updatedSession, ...mockSessionIds });

      expect(result).toEqual({ success: false, redirectTo: "/system-unavailable" });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
      expect(mockCacheSet).toHaveBeenCalledTimes(1);
      expect(mockCacheSet).toHaveBeenCalledWith<Parameters<typeof mockCacheSet>>({
        cacheKey: mockSessionIds.sessionId,
        data: updatedSession,
      });
    });

    it("should return success result when session is updated", async () => {
      const existingSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      };
      const updatedSession = {
        ...mockInitialSessionData,
        searchedVehicleDetails: undefined,
        steps: initialSessionSteps,
      };

      mockCacheGet.mockResolvedValue({
        success: true,
        value: existingSession,
        ttlMillis: mockTtlMillis,
      });

      mockCacheSet.mockResolvedValue({ success: true });

      const result = await setUpdateYourVehicleSession({ session: updatedSession, ...mockSessionIds });

      expect(result).toEqual({ success: true });
      expect(mockCacheGet).toHaveBeenCalledTimes(1);
      expect(mockCacheGet).toHaveBeenCalledWith<Parameters<typeof mockCacheGet>>({
        cacheKey: mockSessionIds.sessionId,
      });
      expect(mockCacheSet).toHaveBeenCalledTimes(1);
      expect(mockCacheSet).toHaveBeenCalledWith<Parameters<typeof mockCacheSet>>({
        cacheKey: mockSessionIds.sessionId,
        data: updatedSession,
      });
    });
  });
});

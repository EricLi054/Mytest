/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { z } from "zod";
import { redirect } from "next/navigation";
import { mockSessionIds, mockUpdateYourVehicleSession } from "#mocks/session";
import { mockVehicleDetails } from "#mocks/vehicle";
import { mockTracer } from "#testing/otel";
import { getSessionIds } from "#utils/getSessionIds";
import { getVehicleCardInfo } from "#utils/getVehicleCardInfo";
import { describe, expect, it, vi } from "vitest";

import type { UpdateVehicleFormSchema } from "./schema";
import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import { getVehicleByRego, updateVehicle } from "./actions";
import { getVehicleDetailsByRego } from "./data";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", { spy: true });
vi.mock("#utils/getSessionIds");
vi.mock("#utils/getVehicleCardInfo");
vi.mock("../../UpdateYourVehicleSession");
vi.mock("./data");
vi.mock("@opentelemetry/api", () => ({
  trace: { getTracer: mockTracer },
}));

const sessionIds = mockSessionIds();

describe("UpdateVehicleActions", () => {
  describe("updateVehicle", () => {
    const validFormAnswers = {
      vehicleType: "Car",
      vehicleRego: "1ANURAG",
      vehicleSelect: "true",
      vehicleNotFound: "false",
      vehicleColour: "Blue",
    } as const satisfies z.infer<typeof UpdateVehicleFormSchema>;

    const formData = ({
      vehicleType,
      vehicleRego,
      vehicleSelect,
      vehicleNotFound,
      vehicleColour,
    }: Partial<z.infer<typeof UpdateVehicleFormSchema>>) => {
      const formData = new FormData();
      vehicleType && formData.append("vehicleType", vehicleType);
      vehicleRego && formData.append("vehicleRego", vehicleRego);
      vehicleSelect && formData.append("vehicleSelect", vehicleSelect);
      vehicleNotFound && formData.append("vehicleNotFound", vehicleNotFound);
      vehicleColour && formData.append("vehicleColour", vehicleColour);
      return formData;
    };

    it("should redirect to /system-unavailable when getting session IDs fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: false, error: "Missing CRM ID" });

      await expect(async () => await updateVehicle(undefined, formData(validFormAnswers))).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should return errors when form validation fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const { status } = await updateVehicle(undefined, formData({ vehicleRego: "" }));

      expect(status).toBe("error");
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(redirect).not.toHaveBeenCalled();
      expect(getUpdateYourVehicleSession).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirect to redirectTo page when getting session fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const getSessionResult = { success: false, redirectTo: "/confirmation" } as const satisfies Awaited<
        ReturnType<typeof getUpdateYourVehicleSession>
      >;
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue(getSessionResult);

      await expect(async () => await updateVehicle(undefined, formData(validFormAnswers))).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(
        getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/update-vehicle",
        ...sessionIds,
      });
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirect to redirectTo page when setting session fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const existingSession = mockUpdateYourVehicleSession({ searchedVehicleDetails: mockVehicleDetails() });

      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        session: existingSession,
        sessionTtl: 123456,
      });

      const setSessionResult = { success: false, redirectTo: "/system-unavailable" } as const satisfies Awaited<
        ReturnType<typeof setUpdateYourVehicleSession>
      >;
      vi.mocked(setUpdateYourVehicleSession).mockResolvedValue(setSessionResult);

      const updatedSession = mockUpdateYourVehicleSession({
        ...existingSession,
        steps: { updateVehicle: validFormAnswers },
      });

      await expect(async () => await updateVehicle(undefined, formData(validFormAnswers))).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(
        getUpdateYourVehiclePageUrl({ page: setSessionResult.redirectTo }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/update-vehicle",
        ...sessionIds,
      });
      expect(setUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof setUpdateYourVehicleSession>
      >({
        session: updatedSession,
        ...sessionIds,
      });
    });

    it("should update session and redirect to /confirm-vehicle when form is valid", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const existingSession = mockUpdateYourVehicleSession({ searchedVehicleDetails: mockVehicleDetails() });

      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        session: existingSession,
        sessionTtl: 123456,
      });
      vi.mocked(setUpdateYourVehicleSession).mockResolvedValue({ success: true });

      const updatedSession = mockUpdateYourVehicleSession({
        ...existingSession,
        steps: { updateVehicle: validFormAnswers },
      });

      await expect(async () => await updateVehicle(undefined, formData(validFormAnswers))).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith<Parameters<typeof redirect>>(
        getUpdateYourVehiclePageUrl({ page: "/confirm-vehicle" }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/update-vehicle",
        ...sessionIds,
      });
      expect(setUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof setUpdateYourVehicleSession>
      >({
        session: updatedSession,
        ...sessionIds,
      });
    });
  });

  describe("getVehicleByRego", () => {
    it("should redirect to /system-unavailable when getting session IDs fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: false, error: "Missing CRM ID" });

      await expect(
        async () => await getVehicleByRego({ vehicleType: "CAR", registrationNumber: "1ANURAG" }),
      ).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).not.toHaveBeenCalled();
      expect(getVehicleDetailsByRego).not.toHaveBeenCalled();
      expect(getVehicleCardInfo).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirect to redirectTo page when getting session fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const getSessionResult = { success: false, redirectTo: "/confirmation" } as const satisfies Awaited<
        ReturnType<typeof getUpdateYourVehicleSession>
      >;
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue(getSessionResult);

      await expect(
        async () => await getVehicleByRego({ vehicleType: "CAR", registrationNumber: "1ANURAG" }),
      ).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(
        getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/update-vehicle",
        ...sessionIds,
      });
      expect(getVehicleDetailsByRego).not.toHaveBeenCalled();
      expect(getVehicleCardInfo).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirect to /system-unavailable when getVehicleDetailsByRego returns errors", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        session: mockUpdateYourVehicleSession(),
        sessionTtl: 12345,
      });
      vi.mocked(getVehicleDetailsByRego).mockResolvedValue({
        errors: [{ name: "Error", message: "Error" }],
        data: { vehicleByRego: null },
      });

      const query = { vehicleType: "CAR", registrationNumber: "1ANURAG" } as const satisfies Parameters<
        typeof getVehicleByRego
      >[0];

      await expect(async () => await getVehicleByRego(query)).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith<Parameters<typeof redirect>>(
        getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/update-vehicle",
        ...sessionIds,
      });
      expect(getVehicleDetailsByRego).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getVehicleDetailsByRego>>({
        vehicleByRego: { ...query, state: "WA" },
      });
      expect(getVehicleCardInfo).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should return undefined if no vehicle is found", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        session: mockUpdateYourVehicleSession(),
        sessionTtl: 12345,
      });
      vi.mocked(getVehicleDetailsByRego).mockResolvedValue({
        errors: undefined,
        data: { vehicleByRego: null },
      });

      const query = { vehicleType: "CAR", registrationNumber: "1ANURAG" } as const satisfies Parameters<
        typeof getVehicleByRego
      >[0];

      const vehicleInfo = await getVehicleByRego(query);

      expect(vehicleInfo).toBeUndefined();
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/update-vehicle",
        ...sessionIds,
      });
      expect(getVehicleDetailsByRego).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getVehicleDetailsByRego>>({
        vehicleByRego: { ...query, state: "WA" },
      });
      expect(getVehicleCardInfo).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
      expect(redirect).not.toHaveBeenCalled();
    });

    it("should redirect to /system-unavailable when found vehicle is missing required details", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        session: mockUpdateYourVehicleSession(),
        sessionTtl: 12345,
      });

      const searchedVehicleDetails = mockVehicleDetails();
      vi.mocked(getVehicleDetailsByRego).mockResolvedValue({
        errors: undefined,
        data: { vehicleByRego: searchedVehicleDetails },
      });
      vi.mocked(getVehicleCardInfo).mockReturnValue({ success: false });

      const query = { vehicleType: "CAR", registrationNumber: "1ANURAG" } as const satisfies Parameters<
        typeof getVehicleByRego
      >[0];

      await expect(async () => await getVehicleByRego(query)).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith<Parameters<typeof redirect>>(
        getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/update-vehicle",
        ...sessionIds,
      });
      expect(getVehicleDetailsByRego).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getVehicleDetailsByRego>>({
        vehicleByRego: { ...query, state: "WA" },
      });
      expect(getVehicleCardInfo).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getVehicleCardInfo>>(
        searchedVehicleDetails,
      );
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirect to redirectTo page when setting session with searched vehicle details fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const existingSession = mockUpdateYourVehicleSession({ searchedVehicleDetails: undefined });

      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        session: existingSession,
        sessionTtl: 12345,
      });

      const searchedVehicleDetails = mockVehicleDetails();
      vi.mocked(getVehicleDetailsByRego).mockResolvedValue({
        errors: undefined,
        data: { vehicleByRego: searchedVehicleDetails },
      });

      const expectedVehicleInfo = {
        title: "Vehicle title",
        subtitle: "Vehicle subtitle",
        isOverweightOrOversize: false,
      } as const satisfies Awaited<ReturnType<typeof getVehicleByRego>>;

      vi.mocked(getVehicleCardInfo).mockReturnValue({
        success: true,
        ...expectedVehicleInfo,
      });

      const setSessionResult = {
        success: false,
        redirectTo: "/system-unavailable",
      } as const satisfies Awaited<ReturnType<typeof setUpdateYourVehicleSession>>;

      vi.mocked(setUpdateYourVehicleSession).mockResolvedValue(setSessionResult);

      const query = { vehicleType: "CAR", registrationNumber: "1ANURAG" } as const satisfies Parameters<
        typeof getVehicleByRego
      >[0];

      const updatedSession = mockUpdateYourVehicleSession({
        ...existingSession,
        searchedVehicleDetails: { ...searchedVehicleDetails, vehicleType: query.vehicleType },
      });

      await expect(async () => await getVehicleByRego(query)).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith<Parameters<typeof redirect>>(
        getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/update-vehicle",
        ...sessionIds,
      });
      expect(getVehicleDetailsByRego).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getVehicleDetailsByRego>>({
        vehicleByRego: { ...query, state: "WA" },
      });
      expect(getVehicleCardInfo).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getVehicleCardInfo>>(
        searchedVehicleDetails,
      );
      expect(setUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith({
        session: updatedSession,
        ...sessionIds,
      });
    });

    it("should update session and return vehicle info when a valid vehicle is found", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const existingSession = mockUpdateYourVehicleSession({ searchedVehicleDetails: undefined });

      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        session: existingSession,
        sessionTtl: 12345,
      });

      const searchedVehicleDetails = mockVehicleDetails();
      vi.mocked(getVehicleDetailsByRego).mockResolvedValue({
        errors: undefined,
        data: { vehicleByRego: searchedVehicleDetails },
      });

      const expectedVehicleInfo = {
        title: "Vehicle title",
        subtitle: "Vehicle subtitle",
        isOverweightOrOversize: false,
      } as const satisfies Awaited<ReturnType<typeof getVehicleByRego>>;

      vi.mocked(getVehicleCardInfo).mockReturnValue({
        success: true,
        ...expectedVehicleInfo,
      });

      vi.mocked(setUpdateYourVehicleSession).mockResolvedValue({
        success: true,
      });

      const query = { vehicleType: "CAR", registrationNumber: "1ANURAG" } as const satisfies Parameters<
        typeof getVehicleByRego
      >[0];

      const updatedSession = mockUpdateYourVehicleSession({
        ...existingSession,
        searchedVehicleDetails: { ...searchedVehicleDetails, vehicleType: query.vehicleType },
      });

      const vehicleInfo = await getVehicleByRego(query);

      expect(vehicleInfo).toMatchObject(expectedVehicleInfo);
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/update-vehicle",
        ...sessionIds,
      });
      expect(getVehicleDetailsByRego).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getVehicleDetailsByRego>>({
        vehicleByRego: { ...query, state: "WA" },
      });
      expect(getVehicleCardInfo).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getVehicleCardInfo>>(
        searchedVehicleDetails,
      );
      expect(setUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith({
        session: updatedSession,
        ...sessionIds,
      });
      expect(redirect).not.toHaveBeenCalled();
    });
  });
});

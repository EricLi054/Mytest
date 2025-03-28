import { redirect } from "next/navigation";
import { mockSessionIds, mockUpdateYourVehicleSession } from "#mocks/session";
import { mockVehicleDetails } from "#mocks/vehicle";
import { mockTracer } from "#testing/otel";
import { getSessionIds } from "#utils/getSessionIds";
import { describe, expect, it, vi } from "vitest";

import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import { confirmVehicle } from "./actions";
import { updateRoadsideVehicle } from "./data";

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

describe("ConfirmVehicleActions", () => {
  describe("confirmVehicle", () => {
    it("should redirect to /system-unavailable when getting session IDs fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: false, error: "Missing CRM ID" });

      await expect(async () => await confirmVehicle()).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).not.toHaveBeenCalled();
      expect(updateRoadsideVehicle).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirect to redirectTo page when getting session fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const getSessionResult = { success: false, redirectTo: "/confirmation" } as const satisfies Awaited<
        ReturnType<typeof getUpdateYourVehicleSession>
      >;
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue(getSessionResult);

      await expect(async () => await confirmVehicle()).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(
        getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/confirm-vehicle",
        ...sessionIds,
      });
      expect(updateRoadsideVehicle).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirectTo /system-unavailable when updateVehicle step is not in session", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        sessionTtl: 12345,
        session: mockUpdateYourVehicleSession({
          searchedVehicleDetails: mockVehicleDetails(),
          steps: {
            updateVehicle: undefined,
          },
        }),
      });

      await expect(async () => await confirmVehicle()).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/confirm-vehicle",
        ...sessionIds,
      });
      expect(updateRoadsideVehicle).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirectTo /system-unavailable when searchedVehicleDetails in not in session", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        sessionTtl: 12345,
        session: mockUpdateYourVehicleSession({
          searchedVehicleDetails: undefined,
          steps: {
            updateVehicle: {
              vehicleType: "Car",
              vehicleSelect: "true",
              vehicleNotFound: "false",
              vehicleRego: "1ANURAG",
              vehicleColour: "Black",
            },
          },
        }),
      });

      await expect(async () => await confirmVehicle()).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/confirm-vehicle",
        ...sessionIds,
      });
      expect(updateRoadsideVehicle).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirectTo /system-unavailable when updateRoadsideVehicle returns errors", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const searchedVehicleDetails = mockVehicleDetails();
      const existingSession = mockUpdateYourVehicleSession({
        searchedVehicleDetails,
        steps: {
          updateVehicle: {
            vehicleType: "Car",
            vehicleSelect: "true",
            vehicleNotFound: "false",
            vehicleRego: "1ANURAG",
            vehicleColour: "Black",
          },
        },
      });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        sessionTtl: 12345,
        session: existingSession,
      });

      vi.mocked(updateRoadsideVehicle).mockResolvedValue({
        data: { updateRoadsideVehicle: { __typename: "RoadsideProduct" } },
        errors: [{ name: "Error", message: "Error" }],
      });

      await expect(async () => await confirmVehicle()).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/confirm-vehicle",
        ...sessionIds,
      });

      expect(updateRoadsideVehicle).toHaveBeenCalledExactlyOnceWith<Parameters<typeof updateRoadsideVehicle>>({
        productId: existingSession.productHoldingHeaderId,
        lineId: existingSession.productHoldingLineId,
        newVehicleDetail: {
          ...searchedVehicleDetails,
          color: existingSession.steps.updateVehicle?.vehicleColour,
        },
      });
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirect to redirectTo page when setting session fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const searchedVehicleDetails = mockVehicleDetails();
      const existingSession = mockUpdateYourVehicleSession({
        searchedVehicleDetails,
        steps: {
          updateVehicle: {
            vehicleType: "Car",
            vehicleSelect: "true",
            vehicleNotFound: "false",
            vehicleRego: "1ANURAG",
            vehicleColour: "Black",
          },
        },
      });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        sessionTtl: 12345,
        session: existingSession,
      });

      vi.mocked(updateRoadsideVehicle).mockResolvedValue({
        data: { updateRoadsideVehicle: { __typename: "RoadsideProduct" } },
        errors: undefined,
      });

      const setSessionResult = { success: false, redirectTo: "/system-unavailable" } as const satisfies Awaited<
        ReturnType<typeof setUpdateYourVehicleSession>
      >;
      vi.mocked(setUpdateYourVehicleSession).mockResolvedValue(setSessionResult);

      const updatedSession = mockUpdateYourVehicleSession({
        ...existingSession,
        steps: { ...existingSession.steps, confirmVehicle: { vehicleUpdated: true } },
      });

      await expect(async () => await confirmVehicle()).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(
        getUpdateYourVehiclePageUrl({ page: setSessionResult.redirectTo }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/confirm-vehicle",
        ...sessionIds,
      });

      expect(updateRoadsideVehicle).toHaveBeenCalledExactlyOnceWith<Parameters<typeof updateRoadsideVehicle>>({
        productId: existingSession.productHoldingHeaderId,
        lineId: existingSession.productHoldingLineId,
        newVehicleDetail: {
          ...searchedVehicleDetails,
          color: existingSession.steps.updateVehicle?.vehicleColour,
        },
      });
      expect(setUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof setUpdateYourVehicleSession>
      >({
        session: updatedSession,
        ...sessionIds,
      });
    });

    it("should update session and redirect to /confirmation", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const searchedVehicleDetails = mockVehicleDetails();
      const existingSession = mockUpdateYourVehicleSession({
        searchedVehicleDetails,
        steps: {
          updateVehicle: {
            vehicleType: "Car",
            vehicleSelect: "true",
            vehicleNotFound: "false",
            vehicleRego: "1ANURAG",
            vehicleColour: "Black",
          },
        },
      });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        sessionTtl: 12345,
        session: existingSession,
      });

      vi.mocked(updateRoadsideVehicle).mockResolvedValue({
        data: { updateRoadsideVehicle: { __typename: "RoadsideProduct" } },
        errors: undefined,
      });

      vi.mocked(setUpdateYourVehicleSession).mockResolvedValue({ success: true });

      const updatedSession = mockUpdateYourVehicleSession({
        ...existingSession,
        steps: { ...existingSession.steps, confirmVehicle: { vehicleUpdated: true } },
      });

      await expect(async () => await confirmVehicle()).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/confirmation" }));
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/confirm-vehicle",
        ...sessionIds,
      });

      expect(updateRoadsideVehicle).toHaveBeenCalledExactlyOnceWith<Parameters<typeof updateRoadsideVehicle>>({
        productId: existingSession.productHoldingHeaderId,
        lineId: existingSession.productHoldingLineId,
        newVehicleDetail: {
          ...searchedVehicleDetails,
          color: existingSession.steps.updateVehicle?.vehicleColour,
        },
      });
      expect(setUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof setUpdateYourVehicleSession>
      >({
        session: updatedSession,
        ...sessionIds,
      });
    });
  });
});

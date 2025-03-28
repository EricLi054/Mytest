import type { z } from "zod";
import { redirect } from "next/navigation";
import { mockSessionIds, mockUpdateYourVehicleSession } from "#mocks/session";
import { mockTracer } from "#testing/otel";
import { getSessionIds } from "#utils/getSessionIds";
import { describe, expect, it, vi } from "vitest";

import type { YourVehicleFormSchema } from "./schema";
import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import { yourVehicle } from "./actions";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", { spy: true });
vi.mock("#utils/getSessionIds");
vi.mock("../../UpdateYourVehicleSession");
vi.mock("@opentelemetry/api", () => ({
  trace: { getTracer: mockTracer },
}));

const sessionIds = mockSessionIds();

describe("YourVehicleActions", () => {
  describe("yourVehicle", () => {
    const formData = ({ vehicleUse, isBrokenDown }: z.infer<typeof YourVehicleFormSchema>) => {
      const formData = new FormData();
      formData.append("vehicleUse", vehicleUse);
      formData.append("isBrokenDown", isBrokenDown);
      return formData;
    };

    it("should redirect to /system-unavailable when getting session IDs fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: false, error: "Missing CRM ID" });

      await expect(
        async () => await yourVehicle(undefined, formData({ vehicleUse: "Private use", isBrokenDown: "No" })),
      ).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).not.toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it.each([
      { vehicleUse: "Business use", isBrokenDown: "No" },
      { vehicleUse: "Business use", isBrokenDown: "Yes" },
      { vehicleUse: "Private use", isBrokenDown: "Yes" },
    ] as const)(
      "should fail validation with vehicleUse: $vehicleUse and isBrokenDown: $isBrokenDown",
      async ({ vehicleUse, isBrokenDown }) => {
        vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

        const { status } = await yourVehicle(undefined, formData({ vehicleUse, isBrokenDown }));

        expect(status).toBe("error");
        expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
          cookieName: "rac-motoring-uyv-session-id",
        });
        expect(redirect).not.toHaveBeenCalled();
        expect(getUpdateYourVehicleSession).not.toHaveBeenCalled();
        expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
      },
    );

    it("should redirect to redirectTo page when getting session fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

      const getSessionResult = { success: false, redirectTo: "/confirmation" } as const satisfies Awaited<
        ReturnType<typeof getUpdateYourVehicleSession>
      >;
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue(getSessionResult);

      await expect(
        async () => await yourVehicle(undefined, formData({ vehicleUse: "Private use", isBrokenDown: "No" })),
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
        currentPage: "/your-vehicle",
        ...sessionIds,
      });
      expect(setUpdateYourVehicleSession).not.toHaveBeenCalled();
    });

    it("should redirect to redirectTo page when setting session fails", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        session: mockUpdateYourVehicleSession(),
        sessionTtl: 123456,
      });

      const setSessionResult = { success: false, redirectTo: "/system-unavailable" } as const satisfies Awaited<
        ReturnType<typeof setUpdateYourVehicleSession>
      >;
      vi.mocked(setUpdateYourVehicleSession).mockResolvedValue(setSessionResult);

      const updatedSession = mockUpdateYourVehicleSession({
        steps: { yourVehicle: { vehicleUse: "Private use", isBrokenDown: "No" } },
      });

      await expect(
        async () => await yourVehicle(undefined, formData({ vehicleUse: "Private use", isBrokenDown: "No" })),
      ).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith(
        getUpdateYourVehiclePageUrl({ page: setSessionResult.redirectTo }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/your-vehicle",
        ...sessionIds,
      });
      expect(setUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof setUpdateYourVehicleSession>
      >({
        session: updatedSession,
        ...sessionIds,
      });
    });

    it("should update session and redirect to /update-vehicle when vehicleUse is 'Private use' and isBrokenDown is 'No'", async () => {
      vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });
      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        success: true,
        session: mockUpdateYourVehicleSession(),
        sessionTtl: 123456,
      });
      vi.mocked(setUpdateYourVehicleSession).mockResolvedValue({ success: true });

      const updatedSession = mockUpdateYourVehicleSession({
        steps: { yourVehicle: { vehicleUse: "Private use", isBrokenDown: "No" } },
      });

      await expect(
        async () => await yourVehicle(undefined, formData({ vehicleUse: "Private use", isBrokenDown: "No" })),
      ).rejects.toThrow();

      expect(redirect).toHaveBeenCalledExactlyOnceWith<Parameters<typeof redirect>>(
        getUpdateYourVehiclePageUrl({ page: "/update-vehicle" }),
      );
      expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
        cookieName: "rac-motoring-uyv-session-id",
      });
      expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<
        Parameters<typeof getUpdateYourVehicleSession>
      >({
        currentPage: "/your-vehicle",
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
});

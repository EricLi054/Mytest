import { redirect, useRouter } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { getContentfulFormPageData } from "#contentful/getFormPageData";
import { serverEnv } from "#env/server";
import { mockYourVehicleContentfulData } from "#mocks/contentful";
import { mockSessionIds, mockUpdateYourVehicleSession } from "#mocks/session";
import { mockAppRouterInstance } from "#testing/next";
import { getSessionIds } from "#utils/getSessionIds";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import YourVehicle from "./page";
import { YourVehicleContentfulSchema } from "./schema";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", { spy: true });
vi.mock("#contentful/getFormPageData");
vi.mock("#utils/getSessionIds");
vi.mock("../../UpdateYourVehicleSession");

const sessionIds = mockSessionIds();

describe("YourVehiclePage", () => {
  beforeEach(() => {
    const mockRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    vi.mocked(getContentfulFormPageData).mockResolvedValue(mockYourVehicleContentfulData);
  });

  it("should redirect to /system-unavailable when getting session IDs fails", async () => {
    vi.mocked(getSessionIds).mockResolvedValue({ success: false, error: "Missing CRM ID" });

    await expect(async () => render(await YourVehicle())).rejects.toThrow();

    expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
      cookieName: "rac-motoring-uyv-session-id",
    });
    expect(getUpdateYourVehicleSession).not.toHaveBeenCalled();
    expect(getContentfulFormPageData).not.toHaveBeenCalled();
  });

  it("should redirect to redirectTo page when getting session fails", async () => {
    vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

    const getSessionResult = { success: false, redirectTo: "/confirmation" } as const satisfies Awaited<
      ReturnType<typeof getUpdateYourVehicleSession>
    >;
    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue(getSessionResult);

    await expect(async () => render(await YourVehicle())).rejects.toThrow();

    expect(redirect).toHaveBeenCalledExactlyOnceWith(
      getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }),
    );
    expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
      cookieName: "rac-motoring-uyv-session-id",
    });
    expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getUpdateYourVehicleSession>>(
      {
        currentPage: "/your-vehicle",
        ...sessionIds,
      },
    );
    expect(getContentfulFormPageData).not.toHaveBeenCalled();
  });

  it("should be able to render", async () => {
    vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });
    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
      success: true,
      session: mockUpdateYourVehicleSession(),
      sessionTtl: 12345,
    });

    render(await YourVehicle());

    expect(screen.getByText(mockYourVehicleContentfulData.heading)).toBeVisible();
    expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
      cookieName: "rac-motoring-uyv-session-id",
    });
    expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getUpdateYourVehicleSession>>(
      {
        currentPage: "/your-vehicle",
        ...sessionIds,
      },
    );
    expect(getContentfulFormPageData).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getContentfulFormPageData>>({
      id: serverEnv().CONTENTFUL_YOUR_VEHICLE_ID,
      schema: YourVehicleContentfulSchema,
    });
    expect(redirect).not.toHaveBeenCalled();
  });
});

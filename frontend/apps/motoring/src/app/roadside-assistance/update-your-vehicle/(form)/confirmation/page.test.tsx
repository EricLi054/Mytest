import { redirect, useRouter } from "next/navigation";
import { render } from "@testing-library/react";
import { getContentfulConfirmationPageData } from "#contentful/getConfirmationPageData";
import { serverEnv } from "#env/server";
import { mockConfirmationContentfulData } from "#mocks/contentful";
import { mockSessionIds, mockUpdateYourVehicleSession } from "#mocks/session";
import { mockVehicleDetails } from "#mocks/vehicle";
import { mockAppRouterInstance } from "#testing/next";
import { getSessionIds } from "#utils/getSessionIds";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import Confirmation from "./page";
import { ConfirmationPageSchema } from "./schema";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", { spy: true });
vi.mock("#contentful/getConfirmationPageData");
vi.mock("#utils/getSessionIds");
vi.mock("../../UpdateYourVehicleSession");

const sessionIds = mockSessionIds();

describe("ConfirmationPage", () => {
  beforeEach(() => {
    const mockRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    vi.mocked(getContentfulConfirmationPageData).mockResolvedValue(mockConfirmationContentfulData);
  });

  it("should redirect to /system-unavailable when getting session IDs fails", async () => {
    vi.mocked(getSessionIds).mockResolvedValue({ success: false, error: "Missing CRM ID" });

    await expect(async () => render(await Confirmation())).rejects.toThrow();

    expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
      cookieName: "rac-motoring-uyv-session-id",
    });
    expect(getUpdateYourVehicleSession).not.toHaveBeenCalled();
    expect(getContentfulConfirmationPageData).not.toHaveBeenCalled();
  });

  it("should redirect to redirectTo page when getting session fails", async () => {
    vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

    const getSessionResult = { success: false, redirectTo: "/confirmation" } as const satisfies Awaited<
      ReturnType<typeof getUpdateYourVehicleSession>
    >;
    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue(getSessionResult);

    await expect(async () => render(await Confirmation())).rejects.toThrow();

    expect(redirect).toHaveBeenCalledExactlyOnceWith(
      getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }),
    );
    expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
      cookieName: "rac-motoring-uyv-session-id",
    });
    expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getUpdateYourVehicleSession>>(
      {
        currentPage: "/confirmation",
        ...sessionIds,
      },
    );
    expect(getContentfulConfirmationPageData).not.toHaveBeenCalled();
  });

  it("should redirect to /system-unavailable when searchedVehicleDetails is not in session", async () => {
    vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });
    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
      success: true,
      sessionTtl: 12345,
      session: mockUpdateYourVehicleSession({
        searchedVehicleDetails: undefined,
      }),
    });

    await expect(async () => render(await Confirmation())).rejects.toThrow();

    expect(redirect).toHaveBeenCalledExactlyOnceWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
      cookieName: "rac-motoring-uyv-session-id",
    });
    expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getUpdateYourVehicleSession>>(
      {
        currentPage: "/confirmation",
        ...sessionIds,
      },
    );
    expect(getContentfulConfirmationPageData).not.toHaveBeenCalled();
  });

  it("should be able to render", async () => {
    vi.mocked(getSessionIds).mockResolvedValue({ success: true, ...sessionIds });

    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
      success: true,
      sessionTtl: 12345,
      session: mockUpdateYourVehicleSession({
        searchedVehicleDetails: mockVehicleDetails(),
      }),
    });

    render(await Confirmation());

    expect(getSessionIds).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getSessionIds>>({
      cookieName: "rac-motoring-uyv-session-id",
    });
    expect(getUpdateYourVehicleSession).toHaveBeenCalledExactlyOnceWith<Parameters<typeof getUpdateYourVehicleSession>>(
      {
        currentPage: "/confirmation",
        ...sessionIds,
      },
    );
    expect(getContentfulConfirmationPageData).toHaveBeenCalledExactlyOnceWith<
      Parameters<typeof getContentfulConfirmationPageData>
    >(serverEnv().CONTENTFUL_CONFIRMATION_ID, ConfirmationPageSchema);
    expect(redirect).not.toHaveBeenCalled();
  });
});

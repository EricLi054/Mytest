import { useRouter } from "next/navigation";
import { render, screen, waitFor } from "@testing-library/react";
import { mockAppRouterInstance } from "#testing/next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getUpdateYourVehiclePageUrl } from "../routing";
import { createSession } from "./actions";
import CreateSession from "./CreateSession";

vi.mock("next/navigation");
vi.mock("./actions");
vi.mock("server-only", () => ({}));

const defaultProps = {
  productHoldingHeaderId: "PHH ID",
  productHoldingLineId: "PHL ID",
} as const satisfies React.ComponentProps<typeof CreateSession>;

describe("CreateSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should be able to render", () => {
    const mockAppRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockAppRouter);

    render(<CreateSession {...defaultProps} />);

    expect(screen.getByTestId("update-your-vehicle-session-splash-screen")).toBeVisible();
  });

  it("should call createSession and redirect to next page", async () => {
    const nextPage = "/your-vehicle";
    const mockAppRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockAppRouter);
    vi.mocked(createSession).mockResolvedValue(nextPage);

    render(<CreateSession {...defaultProps} />);

    await waitFor(() => {
      expect(mockAppRouter.replace).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: nextPage }));
    });

    expect(mockAppRouter.replace).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledWith<Parameters<typeof createSession>>(defaultProps);
  });

  it("should redirect to /system-unavailable when createSession fails", async () => {
    const mockAppRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockAppRouter);
    vi.mocked(createSession).mockRejectedValue(undefined);

    render(<CreateSession {...defaultProps} />);

    await waitFor(() => {
      expect(mockAppRouter.replace).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
    });

    expect(mockAppRouter.replace).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledWith<Parameters<typeof createSession>>(defaultProps);
  });
});

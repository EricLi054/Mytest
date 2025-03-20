import { useRouter } from "next/navigation";
import { render, waitFor } from "@testing-library/react";
import {
  mockAppRouterInstance,
  mockAuthenticatedUseSessionInstance,
  mockUnauthenticatedUseSessionInstance,
} from "#testing/next";
import { getRegistrationErrorPageUrl } from "#utils/routing";
import { useSession } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import { linkMemberAction } from "./actions";
import LinkMemberPage from "./page";

vi.mock("server-only", () => ({}));
vi.mock("./actions");
vi.mock("next-auth/react");
vi.mock("next/navigation");

describe("LinkMemberPage", () => {
  it("should redirect if the member is not authenticated", () => {
    const mockAppRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockAppRouter);
    vi.mocked(useSession).mockReturnValue(mockUnauthenticatedUseSessionInstance());
    render(<LinkMemberPage />);

    expect(mockAppRouter.replace).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  });

  it("should call linking action", async () => {
    vi.mocked(useSession).mockReturnValue(mockAuthenticatedUseSessionInstance());
    render(<LinkMemberPage />);

    await waitFor(() => {
      expect(linkMemberAction).toHaveBeenCalled();
    });
  });
});

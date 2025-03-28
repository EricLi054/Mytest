import { useRouter } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { mockAppRouterInstance } from "#testing/next";
import { describe, expect, it, vi } from "vitest";

import type { CreateSessionArgs } from "./actions";
import UpdateYourVehicle from "./page";

vi.mock("next/navigation");
vi.mock("./session/actions");
vi.mock("server-only", () => ({}));

const searchParams = {
  productHoldingHeaderId: "PHH ID",
  productHoldingLineId: "PHL ID",
} satisfies CreateSessionArgs;

describe("UpdateYourVehiclePage", () => {
  it("should be able to render", async () => {
    const mockAppRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockAppRouter);

    render(
      await UpdateYourVehicle({
        searchParams: new Promise<CreateSessionArgs>((resolve) => resolve(searchParams)),
      }),
    );

    expect(screen.getByTestId("update-your-vehicle-session-splash-screen")).toBeVisible();
  });
});

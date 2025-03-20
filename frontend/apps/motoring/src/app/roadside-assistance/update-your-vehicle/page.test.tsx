import { useRouter } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { mockAppRouterInstance } from "#testing/next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CreateSessionArgs } from "./session/actions";
import UpdateYourVehicle from "./page";

vi.mock("next/navigation");
vi.mock("./session/actions");
vi.mock("server-only", () => ({}));

const searchParams = {
  productHoldingHeaderId: "PHH ID",
  productHoldingLineId: "PHL ID",
} satisfies CreateSessionArgs;

describe("UpdateYourVehicle", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

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

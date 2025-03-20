import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import ensureServerSession from "./ensureServerSession";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Ensure Server Session", () => {
  it("should do nothing with a valid session", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce("12345");

    await expect(ensureServerSession()).resolves.toBeUndefined();
    expect(vi.mocked(redirect)).toBeCalledTimes(0);
  });

  it("should redirect with no valid session", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);
    await ensureServerSession();

    expect(vi.mocked(redirect)).toHaveBeenCalledWith("/signIn");
  });
});

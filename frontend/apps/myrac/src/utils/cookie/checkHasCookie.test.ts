import { describe, expect, it, vi } from "vitest";

import checkHasCookie from "./checkHasCookie";

const mockedHas = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    has: mockedHas,
  })),
}));

describe("checkHasCookie", () => {
  it("should find cookie", async () => {
    mockedHas.mockReturnValueOnce(true);
    const res = await checkHasCookie("testCookie");

    expect(res).toBeTruthy();
  });

  it("should not find cookie", async () => {
    mockedHas.mockReturnValueOnce(false);
    const res = await checkHasCookie("testCookie");

    expect(res).toBeFalsy();
  });
});

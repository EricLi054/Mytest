import { decode } from "next-auth/jwt";
import { describe, expect, it, vi } from "vitest";

import { getNextAuthAccessToken } from "./getNextAuthAccessToken";

vi.mock("server-only", () => ({}));
vi.mock("next-auth/jwt");

const mockedGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: mockedGet,
  })),
}));

describe("getAccessToken", () => {
  it("should get access token from cookie and decode", async () => {
    vi.mocked(decode).mockResolvedValue({ access_token: "token" });
    mockedGet.mockReturnValueOnce({ value: { access_token: "token" } });
    const res = await getNextAuthAccessToken("", "");

    expect(res).toBe("token");
  });
});

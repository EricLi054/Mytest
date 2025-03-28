import { cookies } from "next/headers";
import { uyvSessionIdCookieName } from "#constants";
import { mockReadonlyRequestCookies } from "#testing/next";
import { describe, expect, it, vi } from "vitest";

import { deleteSessionCookie } from "./actions";

vi.mock("next/headers");
vi.mock("server-only", () => ({}));

describe("SessionTimeoutActions", () => {
  describe("deleteSessionCookie", () => {
    it("should delete the UpdateYourVehicle sessionId cookie", async () => {
      const mockRequestCookies = mockReadonlyRequestCookies();
      vi.mocked(cookies).mockResolvedValue(mockRequestCookies);

      await deleteSessionCookie();

      expect(mockRequestCookies.delete).toHaveBeenCalledTimes(1);
      expect(mockRequestCookies.delete).toHaveBeenCalledWith(uyvSessionIdCookieName);
    });
  });
});

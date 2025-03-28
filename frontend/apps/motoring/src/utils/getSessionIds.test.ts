import { cookies } from "next/headers";
import { mockReadonlyRequestCookies } from "#testing/next";
import { describe, expect, it, vi } from "vitest";

import { getCrmId } from "./getCrmId";
import { getSessionIds } from "./getSessionIds";

vi.mock("server-only", () => ({}));
vi.mock("next/headers");
vi.mock("./getCrmId");

const mockCrmId = "mock-crm-id";
const mockSessionId = "mock-session-id";

describe("getSessionIds", () => {
  it("should return failure result with Error 'Missing CRM ID' when CRM ID is undefined", async () => {
    vi.mocked(getCrmId).mockResolvedValue(undefined);

    const result = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

    expect(result).toEqual({ success: false, error: "Missing CRM ID" });
  });

  it("should return failure result with Error 'Missing session ID' when session ID is undefined", async () => {
    vi.mocked(getCrmId).mockResolvedValue(mockCrmId);
    vi.mocked(cookies).mockResolvedValue(
      mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue(undefined),
      }),
    );

    const result = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

    expect(result).toEqual({ success: false, error: "Missing session ID" });
  });

  it("should return success result with CRM ID and session ID when both are found", async () => {
    vi.mocked(getCrmId).mockResolvedValue(mockCrmId);
    vi.mocked(cookies).mockResolvedValue(
      mockReadonlyRequestCookies({
        get: vi.fn().mockReturnValue({ value: mockSessionId }),
      }),
    );

    const result = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

    expect(result).toEqual({ success: true, crmId: mockCrmId, sessionId: mockSessionId });
  });
});

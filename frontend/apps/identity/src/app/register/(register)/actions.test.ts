import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { mockReadonlyRequestCookies } from "#testing/next";
import { createRegistrationSession, SESSION_COOKIE_NAME } from "#utils/session";
import { describe, expect, it, vi } from "vitest";

import { createSessionAction, deleteSessionAction } from "./actions";

let mockValidationStatus = "success";
const mockSubmissionReply = vi.fn();
vi.mock("server-only", () => ({}));
vi.mock("next/headers");
vi.mock("next/navigation");
vi.mock("#utils/session");

vi.mock("@conform-to/zod", () => ({
  parseWithZod: () => ({ status: mockValidationStatus, reply: mockSubmissionReply }),
}));

describe("createSessionAction", () => {
  it("should delete existing session cookie, create a new session, set the session ID cookie and redirect to /match", async () => {
    mockValidationStatus = "success";
    const mockRequestCookies = mockReadonlyRequestCookies();
    const mockSessionId = crypto.randomUUID();

    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(headers).mockResolvedValue({ get: vi.fn() } as unknown as ReadonlyHeaders);
    vi.mocked(createRegistrationSession).mockReturnValue(Promise.resolve(mockSessionId));

    await createSessionAction(undefined, { hasAcceptedTerms: "on" } as unknown as FormData);

    expect(mockSubmissionReply).toHaveBeenCalledTimes(0);
    expect(mockRequestCookies.delete).toHaveBeenCalledTimes(1);
    expect(mockRequestCookies.delete).toHaveBeenCalledWith(SESSION_COOKIE_NAME);
    expect(createRegistrationSession).toHaveBeenCalledTimes(1);
    expect(mockRequestCookies.set).toHaveBeenCalledTimes(1);
    expect(mockRequestCookies.set).toHaveBeenCalledWith(SESSION_COOKIE_NAME, mockSessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    });
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/register/match");
  });

  it("should not continue with invalid data", async () => {
    mockValidationStatus = "failure";

    await createSessionAction(undefined, { hasAcceptedTerms: "off" } as unknown as FormData);

    expect(mockSubmissionReply).toHaveBeenCalledTimes(1);
  });
});

describe("deleteSessionAction", () => {
  it("should delete cookie", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);

    await deleteSessionAction();

    expect(mockSubmissionReply).toHaveBeenCalledTimes(0);
    expect(mockRequestCookies.delete).toHaveBeenCalledTimes(1);
    expect(mockRequestCookies.delete).toHaveBeenCalledWith(SESSION_COOKIE_NAME);
  });
});

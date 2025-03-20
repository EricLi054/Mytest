import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

import { ensureAuthenticatedResponse } from "./ensureAuthenticatedResponse";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const mockAuthenticatedResponse = {
  errors: undefined,
  data: {
    test: "test",
  },
};

const mockUnauthenticatedResponse = {
  errors: [
    {
      extensions: { code: "AUTH_NOT_AUTHENTICATED" },
    },
  ],
  data: null,
};

describe("Ensure Authenticated Response", () => {
  it("should do nothing with a valid response", () => {
    expect(ensureAuthenticatedResponse(mockAuthenticatedResponse)).toBeUndefined();
    expect(vi.mocked(redirect)).toBeCalledTimes(0);
  });

  it("should redirect with a backend AUTH_NOT_AUTHENTICATED error", () => {
    ensureAuthenticatedResponse(mockUnauthenticatedResponse);

    expect(vi.mocked(redirect)).toHaveBeenCalledWith("/signIn");
  });
});

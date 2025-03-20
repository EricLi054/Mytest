import type { Session } from "next-auth";
import * as nav from "next/navigation";
import { useSearchParams } from "next/navigation";
import { render, waitFor } from "@testing-library/react";
import { signIn, useSession } from "next-auth/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Signin from "./page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  useSession: vi.fn(),
}));

const useRouterMocked = vi.spyOn(nav, "useRouter");
const router = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

useRouterMocked.mockReturnValue(router);

describe("Signin", () => {
  const mockSession: Session = {
    expires: "1",
    user: { email: "a", name: "Delta", image: "c" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchParams).mockReturnValue({
      get: () => null,
      append: vi.fn(),
      delete: vi.fn(),
      set: vi.fn(),
      sort: vi.fn(),
      size: 0,
      getAll: vi.fn(),
      has: vi.fn(),
      forEach: vi.fn(),
      entries: vi.fn(),
      keys: vi.fn(),
      values: vi.fn(),
      [Symbol.iterator]: vi.fn(),
    });
  });

  it("should set document title to 'Log In to RAC WA'", () => {
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: mockSession, status: "authenticated" });
    render(<Signin />);

    expect(document.title).toBe("Log In to RAC WA");
  });

  it("should throw an error if there is an error in search params", async () => {
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: mockSession, status: "authenticated" });
    vi.mocked(useSearchParams).mockReturnValue({
      get: () => "error",
      append: vi.fn(),
      delete: vi.fn(),
      set: vi.fn(),
      sort: vi.fn(),
      size: 0,
      getAll: vi.fn(),
      has: vi.fn(),
      forEach: vi.fn(),
      entries: vi.fn(),
      keys: vi.fn(),
      values: vi.fn(),
      [Symbol.iterator]: vi.fn(),
    });

    await waitFor(() => expect(() => render(Signin())).toThrow());
  });

  it("should call signIn if status is unauthenticated", () => {
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: null, status: "unauthenticated" });
    render(<Signin />);

    expect(signIn).toHaveBeenCalledWith("azure-ad-b2c", { callbackUrl: "/myRAC" });
  });

  it("should redirect to callbackUrl if status is authenticated", () => {
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: mockSession, status: "authenticated" });
    render(<Signin />);

    expect(router.push).toHaveBeenCalledWith("/myRAC");
  });

  it("should call signIn if refresh is in search params", () => {
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: mockSession, status: "authenticated" });
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key) => (key === "refresh" ? "true" : null),
      append: vi.fn(),
      delete: vi.fn(),
      set: vi.fn(),
      sort: vi.fn(),
      size: 0,
      getAll: vi.fn(),
      has: vi.fn(),
      forEach: vi.fn(),
      entries: vi.fn(),
      keys: vi.fn(),
      values: vi.fn(),
      [Symbol.iterator]: vi.fn(),
    });
    render(<Signin />);

    expect(signIn).toHaveBeenCalledWith("azure-ad-b2c", { callbackUrl: "/myRAC" });
  });

  it("should not call signIn or push if status is loading", () => {
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: null, status: "loading" });
    render(<Signin />);

    expect(signIn).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });
});

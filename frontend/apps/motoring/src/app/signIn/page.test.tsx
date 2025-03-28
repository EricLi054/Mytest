import type { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { render, waitFor } from "@testing-library/react";
import { mockAppRouterInstance, mockReadonlyURLSearchParams } from "#testing/next";
import { signIn, useSession } from "next-auth/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Signin from "./page";

vi.mock("next/navigation");
vi.mock("next-auth/react");

const mockSession = {
  expires: "1",
  user: { email: "a", name: "Delta", image: "c" },
} as const satisfies Session;

describe("Signin", () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(mockAppRouterInstance());
    vi.mocked(useSearchParams).mockReturnValue(mockReadonlyURLSearchParams());
  });

  it("should set document title to 'Log In to RAC WA'", () => {
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: mockSession, status: "authenticated" });

    render(<Signin />);

    expect(document.title).toBe("Log In to RAC WA");
  });

  it("should throw an error if there is an error in search params", async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      mockReadonlyURLSearchParams({ get: (name: string) => (name === "error" ? "found error" : null) }),
    );
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: mockSession, status: "authenticated" });

    await waitFor(() => expect(() => render(Signin())).toThrow());
  });

  it("should call signIn if status is unauthenticated", () => {
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: null, status: "unauthenticated" });

    render(<Signin />);

    expect(signIn).toHaveBeenCalledExactlyOnceWith<Parameters<typeof signIn>>("azure-ad-b2c", {
      callbackUrl: "/myRAC",
    });
  });

  it("should redirect to callbackUrl if status is authenticated", () => {
    const mockAppRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockAppRouter);
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: mockSession, status: "authenticated" });

    render(<Signin />);

    expect(mockAppRouter.push).toHaveBeenCalledExactlyOnceWith<Parameters<typeof mockAppRouter.push>>("/myRAC");
  });

  it("should call signIn if refresh is in search params", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      mockReadonlyURLSearchParams({
        get: (name: string) => (name === "refresh" ? "found refresh" : null),
      }),
    );
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: mockSession, status: "authenticated" });

    render(<Signin />);

    expect(signIn).toHaveBeenCalledExactlyOnceWith<Parameters<typeof signIn>>("azure-ad-b2c", {
      callbackUrl: "/myRAC",
    });
  });

  it("should not call signIn or push if status is loading", () => {
    const mockAppRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockAppRouter);
    vi.mocked(useSession).mockReturnValue({ update: vi.fn(), data: null, status: "loading" });

    render(<Signin />);

    expect(signIn).not.toHaveBeenCalled();
    expect(mockAppRouter.push).not.toHaveBeenCalled();
  });
});

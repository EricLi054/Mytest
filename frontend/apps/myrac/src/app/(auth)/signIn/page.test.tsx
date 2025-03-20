import { render, waitFor } from "@testing-library/react";
import checkHasCookie from "#utils/cookie/checkHasCookie";
import { signIn, useSession } from "next-auth/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import Signin from "./page";

const pushMock = vi.fn();
const getMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
  useSearchParams: () => {
    return {
      get: getMock,
    };
  },
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("#utils/cookie/checkHasCookie", () => ({
  default: vi.fn(),
}));

const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: "test-email@test.com" },
};

describe("Sign In", () => {
  beforeAll(() => {
    getMock.mockClear();
  });

  it("should go to callback when authenticated on both with callback url", async () => {
    getMock.mockReturnValueOnce(null); // get error
    getMock.mockReturnValueOnce("/myrac/test"); // get callback
    getMock.mockReturnValueOnce(null); // get refresh
    vi.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: "authenticated", update: vi.fn() });
    vi.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true));

    render(<Signin />);

    expect(useSession).toHaveBeenCalled();
    expect(vi.mocked(checkHasCookie)).toHaveBeenCalled();

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/myrac/test");
    });
  });

  it("should go to myrac when authenticated on both with no callback url", async () => {
    getMock.mockReturnValue(null); // no search params
    vi.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: "authenticated", update: vi.fn() });
    vi.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true));

    render(<Signin />);

    expect(useSession).toHaveBeenCalled();
    expect(vi.mocked(checkHasCookie)).toHaveBeenCalled();

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/myrac");
    });
  });

  it("should go to myrac when authenticated on next on non-rac domain", async () => {
    getMock.mockReturnValue(null); // no search params
    vi.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: "authenticated", update: vi.fn() });
    vi.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(false));

    render(<Signin />);

    expect(useSession).toHaveBeenCalled();
    expect(vi.mocked(checkHasCookie)).toHaveBeenCalled();

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/myrac");
    });
  });

  it("should refresh session when authenticated on both but needs to refresh after find my products", async () => {
    getMock.mockReturnValueOnce(null); // get error
    getMock.mockReturnValueOnce("/myrac/test"); // get callback
    getMock.mockReturnValueOnce(true); // get refresh
    vi.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: "authenticated", update: vi.fn() });
    vi.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true));

    render(<Signin />);

    expect(useSession).toHaveBeenCalled();
    expect(vi.mocked(checkHasCookie)).toHaveBeenCalled();

    await waitFor(() => {
      expect(vi.mocked(signIn)).toHaveBeenCalledWith("azure-ad-b2c", { callbackUrl: "/myrac/test" });
    });
  });

  it("should login when logged in to sitecore with callback set", async () => {
    getMock.mockReturnValueOnce(null); // get error
    getMock.mockReturnValueOnce("/myrac/test"); // get callback
    getMock.mockReturnValueOnce(null); // get refresh
    vi.mocked(useSession).mockReturnValueOnce({ data: null, status: "unauthenticated", update: vi.fn() });
    vi.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true));

    render(<Signin />);

    expect(useSession).toHaveBeenCalled();
    expect(vi.mocked(checkHasCookie)).toHaveBeenCalled();

    await waitFor(() => {
      expect(vi.mocked(signIn)).toHaveBeenCalledWith("azure-ad-b2c", { callbackUrl: "/myrac/test" });
    });
  });

  it("should login when logged in to sitecore with callback not set", async () => {
    getMock.mockReturnValue(null); // no search params
    vi.mocked(useSession).mockReturnValueOnce({ data: null, status: "unauthenticated", update: vi.fn() });
    vi.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true));

    render(<Signin />);

    expect(useSession).toHaveBeenCalled();
    expect(vi.mocked(checkHasCookie)).toHaveBeenCalled();

    await waitFor(() => {
      expect(vi.mocked(signIn)).toHaveBeenCalledWith("azure-ad-b2c", { callbackUrl: "/myrac" });
    });
  });

  it("should have a title of Log In to RAC WA", async () => {
    getMock.mockReturnValueOnce(null);
    vi.mocked(useSession).mockReturnValueOnce({ data: null, status: "unauthenticated", update: vi.fn() });
    vi.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true));
    render(<Signin />);
    await waitFor(() => {
      expect(document.title).toBe("Log In to RAC WA");
    });
  });
});

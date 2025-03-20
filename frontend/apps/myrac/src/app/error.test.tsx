import { usePathname } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { logPageView } from "#utils/analyticsTagging";
import { signIn } from "next-auth/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ErrorPage from "./error";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
  usePathname: vi.fn(),
}));

vi.mock("#utils/analyticsTagging", () => ({
  logPageView: vi.fn(),
}));

describe("Error", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render error page", () => {
    render(<ErrorPage error={new Error()} reset={() => null} />);

    expect(screen.getByRole("link", { name: "Back to myRAC" })).toBeInTheDocument();
  });

  it("should redirect to sign in", () => {
    render(<ErrorPage error={new Error("Unauthorized")} reset={() => null} />);

    expect(vi.mocked(signIn)).toHaveBeenCalled();
  });

  it("should log virtual page view", () => {
    vi.mocked(usePathname).mockReturnValueOnce("Initial Path");

    render(<ErrorPage error={new Error()} reset={() => null} />);

    expect(screen.getByRole("link", { name: "Back to myRAC" })).toBeInTheDocument();
    expect(logPageView).toHaveBeenCalledTimes(1);
  });
});

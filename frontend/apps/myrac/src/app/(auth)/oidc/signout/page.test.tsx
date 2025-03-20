import { render, screen, waitFor } from "@testing-library/react";
import getHeader from "#utils/headers/getHeader";
import { signOut } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import Logout from "./page";

const baseUrl = "http://localhost:3000";

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
}));

vi.mock("@racwa/auth/adb2c", () => ({
  getADB2CLogoutUrl: vi.fn(async () => await Promise.resolve("logout")),
}));

vi.mock("#utils/headers/getHeader", () => ({
  default: vi.fn(),
}));

describe("Logout Component", () => {
  it("should call signOut on render for external call", async () => {
    vi.mocked(getHeader).mockReturnValueOnce(Promise.resolve("externalUrl.com.au"));
    render(<Logout />);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
    });
  });

  it("should call signOut and navigates to logout page on render for internal call", async () => {
    vi.mocked(getHeader).mockReturnValueOnce(Promise.resolve(baseUrl));
    render(<Logout />);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ redirect: false });
    });

    expect(pushMock).toHaveBeenCalledWith("logout");
  });

  it("should render loading modal", () => {
    render(<Logout />);

    const loadingIndictor = screen.getByRole("img", { hidden: true });

    expect(loadingIndictor).toBeInTheDocument();
  });
});

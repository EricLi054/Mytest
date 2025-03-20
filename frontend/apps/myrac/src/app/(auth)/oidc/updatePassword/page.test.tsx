import { render } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import { getADB2CUpdatePasswordUrl } from "@racwa/auth/adb2c";

import UpdatePassword from "./page";

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
}));

vi.mock("@racwa/auth/adb2c", () => ({
  getADB2CUpdatePasswordUrl: vi.fn(),
}));

// need a mock session to test the page even though it isn't used
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: "test-email@test.com" },
};

describe("UpdatePassword", () => {
  it("should redirect to adb2c url", () => {
    vi.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: "authenticated", update: vi.fn() });
    vi.mocked(getADB2CUpdatePasswordUrl).mockReturnValue(Promise.resolve("/adb2c/updatePassword"));

    getMock.mockReturnValueOnce(null);

    render(<UpdatePassword />);

    expect(useSession).toHaveBeenCalled();
    expect(getADB2CUpdatePasswordUrl).toHaveBeenCalled();
  });

  it("should update password successfully", () => {
    vi.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: "authenticated", update: vi.fn() });

    getMock.mockReturnValueOnce("/myrac/profile/contact-details");

    render(<UpdatePassword />);

    expect(useSession).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });
});

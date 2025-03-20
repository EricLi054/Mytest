import { render } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import { getADB2CUpdateEmailUrl } from "@racwa/auth/adb2c";

import UpdateEmail from "./page";

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
  getADB2CUpdateEmailUrl: vi.fn(),
}));

// need a mock session to test the page even though it isn't used
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: "test-email@test.com" },
};

describe("UpdateEmail", () => {
  it("should redirect to adb2c url", () => {
    vi.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: "authenticated", update: vi.fn() });
    vi.mocked(getADB2CUpdateEmailUrl).mockReturnValue(Promise.resolve("/adb2c/updateEmail"));

    getMock.mockReturnValueOnce(null);

    render(<UpdateEmail />);

    expect(useSession).toHaveBeenCalled();
    expect(getADB2CUpdateEmailUrl).toHaveBeenCalled();
  });

  it("should handle if the update email journey is cancelled", () => {
    const updateMock = vi.fn();
    updateMock.mockReturnValueOnce(Promise.resolve());
    vi.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: "authenticated", update: updateMock });

    getMock.mockReturnValueOnce("/myrac/profile/contact-details");

    render(<UpdateEmail />);

    expect(pushMock).toHaveBeenCalled();
  });

  it("should update email address successfully", () => {
    const updateMock = vi.fn();
    updateMock.mockReturnValueOnce(Promise.resolve());
    vi.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: "authenticated", update: updateMock });

    getMock.mockReturnValueOnce("/myrac/profile/contact-details");
    getMock.mockReturnValueOnce("code");

    render(<UpdateEmail />);

    expect(useSession).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });
});

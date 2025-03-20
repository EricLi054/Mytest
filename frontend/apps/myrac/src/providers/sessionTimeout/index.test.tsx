import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalProvider } from "#providers/modal";
import { getSession, signOut, useSession } from "next-auth/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getADB2CLogoutUrl } from "@racwa/auth/adb2c";

import SessionTimeoutProvider from ".";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  getSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@racwa/auth/adb2c", () => ({
  getADB2CLogoutUrl: vi.fn(),
}));

vi.spyOn(global, "setTimeout");
vi.spyOn(global, "clearTimeout");

const mockExpiredSession = {
  expires: (Date.now() - 1000).toString(),
  user: { email: "test-email@test.com" },
};

const mockLessThan2LeftSession = {
  expires: (Date.now() + 60000 * 1).toString(),
  user: { email: "test-email@test.com" },
};

describe("Session Timeout Provider", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should logout if session already expired", async () => {
    vi.mocked(useSession).mockReturnValue({
      data: mockExpiredSession,
      status: "authenticated",
      update: vi.fn(),
    });
    vi.mocked(getSession).mockResolvedValue(mockExpiredSession);
    vi.mocked(getADB2CLogoutUrl).mockResolvedValue("/logout");

    render(
      <ModalProvider>
        <SessionTimeoutProvider />
      </ModalProvider>,
    );

    await waitFor(() => expect(getSession).toHaveBeenCalled());
    await waitFor(() => expect(getADB2CLogoutUrl).toHaveBeenCalled());
    await waitFor(() => expect(signOut).toHaveBeenCalled());
    await waitFor(() => expect(pushMock).toHaveBeenCalled());
  });

  it("should show modal immediately if session nearly expired and can refresh token", async () => {
    const updateMock = vi.fn();
    vi.mocked(useSession).mockReturnValue({
      data: mockLessThan2LeftSession,
      status: "authenticated",
      update: updateMock,
    });
    vi.mocked(getSession).mockResolvedValue(mockLessThan2LeftSession);

    render(
      <ModalProvider>
        <SessionTimeoutProvider />
      </ModalProvider>,
    );

    await waitFor(() => expect(getSession).toHaveBeenCalled());
    await waitFor(() => expect(setTimeout).toHaveBeenCalled());

    // Click refresh session
    expect(await screen.findByText("OK")).toBeInTheDocument();

    // Workaround due to fake timers affecting click behavior
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText("OK"));

    // Ensure refresh actions were taken
    await waitFor(() => expect(updateMock).toHaveBeenCalled());
  });

  it("should set a timer ready for a modal to appear and another to force logout", async () => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });

    const now = Date.now();
    const tenMinutesDuration = 60000 * 10;
    const expiresAt = now + tenMinutesDuration;

    const mockNormalSession = {
      expires: expiresAt.toString(),
      user: { email: "test-email@test.com" },
    };

    vi.mocked(useSession).mockReturnValue({
      data: mockNormalSession,
      status: "authenticated",
      update: vi.fn(),
    });

    vi.mocked(getSession).mockResolvedValue(mockNormalSession);

    render(
      <ModalProvider>
        <SessionTimeoutProvider />
      </ModalProvider>,
    );

    await waitFor(() => expect(getSession).toHaveBeenCalled());

    // Advance timer to trigger modal (8 minutes later)
    act(() => {
      vi.advanceTimersByTime(60 * 8 * 1000);
    });

    await waitFor(() => screen.findByText("OK"));

    // Advance timer to force logout (remaining 2 minutes)
    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 2);
    });
    await waitFor(() => expect(getADB2CLogoutUrl).toHaveBeenCalled());
    await waitFor(() => expect(signOut).toHaveBeenCalled());
    await waitFor(() => expect(pushMock).toHaveBeenCalled());

    vi.useRealTimers();
  });
});

import { useState } from "react";
import { Button } from "@mui/material";
import { render, screen, waitFor } from "@testing-library/react";
import { getOtpVerificationDetails } from "#graphql/mfa/getOtpVerificationDetails";
import { sendOtp } from "#graphql/mfa/sendOtp";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import { MFAProvider } from ".";
import { useMFAContext } from "./context";

vi.mock("server-only", () => ({}));
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
}));
vi.mock("#graphql/mfa/getOtpVerificationDetails", () => ({
  getOtpVerificationDetails: vi.fn(),
}));
vi.mock("#graphql/mfa/sendOtp", () => ({
  sendOtp: vi.fn(),
}));

const mockSessionKey = "mock_session_key";

const TestButton = () => {
  const { openMFAModal } = useMFAContext();
  const [status, setStatus] = useState("MFA Incomplete");

  const successHandler = () => {
    setStatus("MFA Complete");
  };

  return (
    <>
      <p>{status}</p>
      <Button
        onClick={() => {
          openMFAModal(successHandler);
        }}
      >
        Open
      </Button>
    </>
  );
};

describe("MFA", () => {
  it("should throw an error if used outside of MFAProvider", () => {
    expect(() => render(<TestButton />)).toThrow("useMFAContext must be used within a MFAProvider");
  });

  it("should render in a closed state", () => {
    render(
      <MFAProvider sessionKey={mockSessionKey}>
        <TestButton />
      </MFAProvider>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should call a success handler if already has a session", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: true,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    render(
      <MFAProvider sessionKey={mockSessionKey}>
        <TestButton />
      </MFAProvider>,
    );
    await testHelper.clickButton("Open", screen);

    await waitFor(() => expect(screen.getByText("MFA Complete")).toBeVisible());
  });

  it("should open MFA with no session", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: false,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    render(
      <MFAProvider sessionKey={mockSessionKey}>
        <TestButton />
      </MFAProvider>,
    );
    await testHelper.clickButton("Open", screen);

    await waitFor(() => expect(screen.getByRole("dialog", { name: "Let's verify it's you" })).toBeVisible());
  });

  it("should call error callback on error from send function", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: false,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    vi.mocked(sendOtp).mockRejectedValueOnce(new Error("MFA Error"));
    render(
      <MFAProvider sessionKey={mockSessionKey}>
        <TestButton />
      </MFAProvider>,
    );
    await testHelper.clickButton("Open", screen);

    await waitFor(() => expect(screen.getByRole("dialog", { name: "Let's verify it's you" })).toBeVisible());

    await testHelper.clickButton("Send code", screen);

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    expect(pushMock).toHaveBeenCalledWith("/something-went-wrong");
  });
});

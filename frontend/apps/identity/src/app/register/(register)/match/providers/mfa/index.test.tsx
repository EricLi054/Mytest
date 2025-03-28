import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT } from "#utils/constants";
import { getRegistrationErrorPageUrl } from "#utils/routing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMfaSessionKey, useMfaModalDialog } from "@racwa/mfa";

import { MfaModalDialogProvider } from ".";
import { getRegistrationOtpVerificationDetails } from "../../graphql/getRegistrationOtpVerificationDetails";
import { sendRegistrationOtp } from "../../graphql/sendRegistrationOtp";
import { verifyRegistrationOtp } from "../../graphql/verifyRegistrationOtp";

vi.mock("server-only", () => ({}));
vi.mock("../../graphql/getRegistrationOtpVerificationDetails", () => ({
  getRegistrationOtpVerificationDetails: vi.fn(),
}));
vi.mock("../../graphql/sendRegistrationOtp", () => ({
  sendRegistrationOtp: vi.fn(),
}));
vi.mock("../../graphql/verifyRegistrationOtp", () => ({
  verifyRegistrationOtp: vi.fn(),
}));

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
}));

const systemUnavailableErrorPageUrl = getRegistrationErrorPageUrl({ page: "/system-unavailable" });
const mockSessionKey = createMfaSessionKey("my-rac-account-registration", "123456789-987654321");
const mockOtpVerificationDetails = {
  sessionKey: mockSessionKey,
  isAuthenticated: false,
  isMobile: true,
  phoneNumberSuffix: "000",
};

const mockMfaIncompleteStatus = "MFA Incomplete";
const mockMfaOnErrorStatus = "MFA Error";
const mockMfaOnSuccessStatus = "MFA Success";

const mockSuccessHandler = vi.fn();

type TestButtonProps = {
  customLoadingMessage?: string;
};

const TestButton = ({ customLoadingMessage }: TestButtonProps) => {
  const { openMfaModal, mfaOnErrorTriggered, mfaOnSuccessTriggered } = useMfaModalDialog();
  const [status, setStatus] = useState(mockMfaIncompleteStatus);
  const onClick = () => {
    openMfaModal(mockSuccessHandler, customLoadingMessage);
  };

  useEffect(() => {
    if (mfaOnErrorTriggered) {
      setStatus(mockMfaOnErrorStatus);
    }
    if (mfaOnSuccessTriggered) {
      setStatus(mockMfaOnSuccessStatus);
    }
  }, [mfaOnErrorTriggered, mfaOnSuccessTriggered]);

  return (
    <>
      <p>{status}</p>
      <Button onClick={onClick}>Open</Button>;
    </>
  );
};

const getTestButton = () => screen.getByRole("button", { name: "Open" });
const getDialog = (name: "Let's verify it's you" | "Enter verification code") =>
  screen.getByRole("dialog", { name: name });
const getFaqLink = () => screen.getByRole("link", { name: "Visit our FAQs" });
const getNeedHelpLink = () => screen.getByRole("link", { name: RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT });
const getSendCodeButton = () => screen.getByRole("button", { name: "Send code" });

/**
 * Inidicates that the `useMfaModalDialog` hook has returned `mfaOnErrorTriggered` value as true on error
 */
const assertMfaOnErrorTriggered = () => expect(screen.getByText(mockMfaOnErrorStatus)).toBeVisible();

/**
 * Inidicates that the `useMfaModalDialog` hook has returned `mfaOnSuccessTriggered` value as true on success
 */
const assertMfaOnSuccessTriggered = () => expect(screen.getByText(mockMfaOnSuccessStatus)).toBeVisible();

const assertLinks = () => {
  const faqLink = getFaqLink();
  const needHelpLink = getNeedHelpLink();

  expect(faqLink).toBeVisible();
  expect(faqLink).toHaveAttribute("href", "/myrac/help");
  expect(needHelpLink).toBeVisible();
  expect(needHelpLink).toHaveAttribute("href", "tel:1300045617");
};

describe("MfaModalDialogProvider", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should throw an error if used outside of MfaModalDialogProvider", () => {
    expect(() => render(<TestButton />)).toThrow(
      "useMfaModalDialog must be used within a MfaModalDialogContext Provider",
    );
  });

  it("should render with dialog in a closed state", () => {
    render(
      <MfaModalDialogProvider getVerificationDetailsAction={vi.fn()} sendOtpAction={vi.fn()} verifyOtpAction={vi.fn()}>
        <TestButton />
      </MfaModalDialogProvider>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(getRegistrationOtpVerificationDetails).not.toHaveBeenCalled();
    expect(sendRegistrationOtp).not.toHaveBeenCalled();
    expect(verifyRegistrationOtp).not.toHaveBeenCalled();

    expect(screen.getByText(mockMfaIncompleteStatus)).toBeVisible();
  });

  it("should render dialogs with expected faqLink and helpDisplayPhoneNumber", async () => {
    const user = userEvent.setup();
    vi.mocked(getRegistrationOtpVerificationDetails).mockResolvedValue(mockOtpVerificationDetails);
    vi.mocked(sendRegistrationOtp).mockResolvedValue({ data: { hasSendAttemptsRemaining: true } });
    render(
      <MfaModalDialogProvider
        getVerificationDetailsAction={getRegistrationOtpVerificationDetails}
        sendOtpAction={sendRegistrationOtp}
        verifyOtpAction={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(getDialog("Let's verify it's you")).toBeVisible());
    assertLinks();

    expect(getRegistrationOtpVerificationDetails).toHaveBeenCalled();

    await user.click(getSendCodeButton());
    await waitFor(() => expect(getDialog("Enter verification code")).toBeVisible());
    assertLinks();

    expect(sendRegistrationOtp).toHaveBeenCalled();
    expect(verifyRegistrationOtp).not.toHaveBeenCalled();

    expect(screen.getByText(mockMfaIncompleteStatus)).toBeVisible();
  });

  it("should call error callback and navigate to error page when getRegistrationOtpVerificationDetails returns an error", async () => {
    const user = userEvent.setup();
    vi.mocked(getRegistrationOtpVerificationDetails).mockRejectedValueOnce(new Error());
    render(
      <MfaModalDialogProvider
        getVerificationDetailsAction={getRegistrationOtpVerificationDetails}
        sendOtpAction={vi.fn()}
        verifyOtpAction={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    expect(pushMock).toHaveBeenCalledWith(systemUnavailableErrorPageUrl);
    expect(getRegistrationOtpVerificationDetails).toHaveBeenCalled();
    expect(sendRegistrationOtp).not.toHaveBeenCalled();
    expect(verifyRegistrationOtp).not.toHaveBeenCalled();

    assertMfaOnErrorTriggered();
  });

  it("should call success callback if person is already authenticated for the session key", async () => {
    const user = userEvent.setup();
    vi.mocked(getRegistrationOtpVerificationDetails).mockResolvedValue({
      ...mockOtpVerificationDetails,
      isAuthenticated: true,
    });
    render(
      <MfaModalDialogProvider
        getVerificationDetailsAction={getRegistrationOtpVerificationDetails}
        sendOtpAction={vi.fn()}
        verifyOtpAction={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(mockSuccessHandler).toHaveBeenCalled());

    expect(getRegistrationOtpVerificationDetails).toHaveBeenCalled();
    expect(sendRegistrationOtp).not.toHaveBeenCalled();
    expect(verifyRegistrationOtp).not.toHaveBeenCalled();

    assertMfaOnSuccessTriggered();
  });

  it("should open dialog if person is not already authenticated for the session key", async () => {
    const user = userEvent.setup();
    vi.mocked(getRegistrationOtpVerificationDetails).mockResolvedValue(mockOtpVerificationDetails);
    render(
      <MfaModalDialogProvider
        getVerificationDetailsAction={getRegistrationOtpVerificationDetails}
        sendOtpAction={vi.fn()}
        verifyOtpAction={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(getDialog("Let's verify it's you")).toBeVisible());

    expect(getRegistrationOtpVerificationDetails).toHaveBeenCalled();
    expect(sendRegistrationOtp).not.toHaveBeenCalled();
    expect(verifyRegistrationOtp).not.toHaveBeenCalled();

    expect(screen.getByText("MFA Incomplete")).toBeVisible();
  });

  it("should call error callback and navigate to error page when sendRegistrationOtp throws an error", async () => {
    const user = userEvent.setup();
    vi.mocked(getRegistrationOtpVerificationDetails).mockResolvedValue(mockOtpVerificationDetails);
    vi.mocked(sendRegistrationOtp).mockResolvedValue({ errorCode: "TooManyRequestsError" });
    render(
      <MfaModalDialogProvider
        getVerificationDetailsAction={getRegistrationOtpVerificationDetails}
        sendOtpAction={sendRegistrationOtp}
        verifyOtpAction={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(getDialog("Let's verify it's you")).toBeVisible());

    await user.click(screen.getByRole("button", { name: "Send code" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    expect(pushMock).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
    expect(getRegistrationOtpVerificationDetails).toHaveBeenCalled();
    expect(sendRegistrationOtp).toHaveBeenCalled();
    expect(verifyRegistrationOtp).not.toHaveBeenCalled();

    assertMfaOnErrorTriggered();
  });

  it("should call error callback and navigate to error page when verifyRegistrationOtp throws an error", async () => {
    // user-event adds a delay between some subsequent inputs.
    // When using fake timers it is necessary to set this option
    // to your test runner's time advancement function.
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(getRegistrationOtpVerificationDetails).mockResolvedValue(mockOtpVerificationDetails);
    vi.mocked(sendRegistrationOtp).mockResolvedValue({ data: { hasSendAttemptsRemaining: true } });
    vi.mocked(verifyRegistrationOtp).mockResolvedValue({ errorCode: "TooManyRequestsError" });
    render(
      <MfaModalDialogProvider
        getVerificationDetailsAction={getRegistrationOtpVerificationDetails}
        sendOtpAction={sendRegistrationOtp}
        verifyOtpAction={verifyRegistrationOtp}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(getDialog("Let's verify it's you")).toBeVisible());

    await user.click(getSendCodeButton());
    await waitFor(() => expect(getDialog("Enter verification code")).toBeVisible());

    const textboxInputs = screen.getAllByRole<HTMLInputElement>("textbox");
    for (let i = 0; i <= textboxInputs.length; i++) {
      const input = textboxInputs[`${i}`];
      if (input) {
        await user.type(input, `${i}`);
      }
    }

    await user.click(screen.getByRole("button", { name: "Verify" }));
    act(() => {
      vi.advanceTimersByTime(1500); // Matches OTP_VERIFY_CLOSURE_DELAY const value in @racwa/mfa package
    });
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith(systemUnavailableErrorPageUrl));

    expect(getRegistrationOtpVerificationDetails).toHaveBeenCalled();
    expect(sendRegistrationOtp).toHaveBeenCalled();
    expect(verifyRegistrationOtp).toHaveBeenCalled();

    assertMfaOnErrorTriggered();
  });

  it("should call success callback when dialog is closed on successful completion", async () => {
    // user-event adds a delay between some subsequent inputs.
    // When using fake timers it is necessary to set this option
    // to your test runner's time advancement function.
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(getRegistrationOtpVerificationDetails).mockResolvedValue(mockOtpVerificationDetails);
    vi.mocked(sendRegistrationOtp).mockResolvedValue({ data: { hasSendAttemptsRemaining: true } });
    vi.mocked(verifyRegistrationOtp).mockResolvedValue({ data: { isVerified: true } });
    render(
      <MfaModalDialogProvider
        getVerificationDetailsAction={getRegistrationOtpVerificationDetails}
        sendOtpAction={sendRegistrationOtp}
        verifyOtpAction={verifyRegistrationOtp}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(getDialog("Let's verify it's you")).toBeVisible());

    await user.click(getSendCodeButton());
    await waitFor(() => expect(getDialog("Enter verification code")).toBeVisible());

    const textboxInputs = screen.getAllByRole<HTMLInputElement>("textbox");
    for (let i = 0; i <= textboxInputs.length; i++) {
      const input = textboxInputs[`${i}`];
      if (input) {
        await user.type(input, `${i}`);
      }
    }

    await user.click(screen.getByRole("button", { name: "Verify" }));
    act(() => {
      vi.advanceTimersByTime(1500); // Matches OTP_VERIFY_CLOSURE_DELAY const value in @racwa/mfa package
    });
    await waitFor(() => expect(mockSuccessHandler).toHaveBeenCalled());

    expect(getRegistrationOtpVerificationDetails).toHaveBeenCalled();
    expect(sendRegistrationOtp).toHaveBeenCalled();
    expect(verifyRegistrationOtp).toHaveBeenCalled();

    assertMfaOnSuccessTriggered();
  });
});

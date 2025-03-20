import { Button } from "@mui/material";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT } from "#utils/constants";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMfaModalDialog } from "@racwa/mfa";

import type { Person } from "../../types";
import { MfaModalDialogProvider } from ".";
import { checkAndSendRegistrationOtp } from "../../graphql/checkAndSendRegistrationOtp";
import { checkAndVerifyRegistrationOtp } from "../../graphql/checkAndVerifyRegistrationOtp";
import { checkRegistrationOtp } from "../../graphql/checkRegistrationOtp";

vi.mock("server-only", () => ({}));
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
}));
vi.mock("../../graphql/checkRegistrationOtp", () => ({
  checkRegistrationOtp: vi.fn(),
}));
vi.mock("../../graphql/checkAndSendRegistrationOtp", () => ({
  checkAndSendRegistrationOtp: vi.fn(),
}));
vi.mock("../../graphql/checkAndVerifyRegistrationOtp", () => ({
  checkAndVerifyRegistrationOtp: vi.fn(),
}));

const mockGetPerson = vi.fn();

const systemUnavailableErrorPageUrl = "/register/error/system-unavailable";
const mockSessionKey = "my-rac-account-registration-123456789-987654321";
const mockMatchedPerson: Person = {
  personId: "00000000-0000-0000-0000-00000000000",
  racId: "00000001",
  firstName: "John",
  mobilePhone: "0400000000",
  membershipType: "Member",
  otpVerificationDetails: {
    sessionKey: mockSessionKey,
    isAuthenticated: false,
    isMobile: true,
    phoneNumberSuffix: "000",
  },
};

type TestButtonProps = {
  customLoadingMessage?: string;
};

const mockSuccessHandler = vi.fn();

const TestButton = ({ customLoadingMessage }: TestButtonProps) => {
  const { openMfaModal } = useMfaModalDialog();
  const onClick = () => {
    openMfaModal(mockSuccessHandler, customLoadingMessage);
  };

  return <Button onClick={onClick}>Open</Button>;
};

const getTestButton = () => screen.getByRole("button", { name: "Open" });
const getDialog = (name: "Let's verify it's you" | "Enter verification code") =>
  screen.getByRole("dialog", { name: name });
const getFaqLink = () => screen.getByRole("link", { name: "Visit our FAQs" });
const getNeedHelpLink = () => screen.getByRole("link", { name: RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT });
const getSendCodeButton = () => screen.getByRole("button", { name: "Send code" });

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
      <MfaModalDialogProvider
        getPerson={mockGetPerson}
        checkOtp={vi.fn()}
        checkAndSendOtp={vi.fn()}
        checkAndVerifyOtp={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("should render dialogs with expected faqLink and helpDisplayPhoneNumber", async () => {
    const user = userEvent.setup();
    mockGetPerson.mockResolvedValueOnce(mockMatchedPerson);
    vi.mocked(checkRegistrationOtp).mockResolvedValueOnce(false);
    vi.mocked(checkAndSendRegistrationOtp).mockResolvedValueOnce({ data: { hasSendAttemptsRemaining: true } });
    render(
      <MfaModalDialogProvider
        getPerson={mockGetPerson}
        checkOtp={checkRegistrationOtp}
        checkAndSendOtp={checkAndSendRegistrationOtp}
        checkAndVerifyOtp={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(getDialog("Let's verify it's you")).toBeVisible());
    assertLinks();

    await user.click(getSendCodeButton());
    await waitFor(() => expect(getDialog("Enter verification code")).toBeVisible());
    assertLinks();
  });

  it("should should call error callback and navigate to error page when getMatchedPerson returns undefined Person", async () => {
    const user = userEvent.setup();
    mockGetPerson.mockResolvedValueOnce(undefined);
    render(
      <MfaModalDialogProvider
        getPerson={mockGetPerson}
        checkOtp={vi.fn()}
        checkAndSendOtp={vi.fn()}
        checkAndVerifyOtp={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith(systemUnavailableErrorPageUrl));
  });

  it("should call error callback and navigate to error page when getMatchedPerson returns a Person with null otpVerificationDetails", async () => {
    const user = userEvent.setup();
    mockGetPerson.mockResolvedValueOnce({ ...mockMatchedPerson, otpVerificationDetails: null });
    render(
      <MfaModalDialogProvider
        getPerson={mockGetPerson}
        checkOtp={vi.fn()}
        checkAndSendOtp={vi.fn()}
        checkAndVerifyOtp={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    expect(pushMock).toHaveBeenCalledWith(systemUnavailableErrorPageUrl);
  });

  it("should call success callback if person is already authenticated for the session key", async () => {
    const user = userEvent.setup();
    mockGetPerson.mockResolvedValueOnce(mockMatchedPerson);
    vi.mocked(checkRegistrationOtp).mockResolvedValueOnce(true);
    render(
      <MfaModalDialogProvider
        getPerson={mockGetPerson}
        checkOtp={checkRegistrationOtp}
        checkAndSendOtp={vi.fn()}
        checkAndVerifyOtp={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    await waitFor(() => expect(mockSuccessHandler).toHaveBeenCalled());
  });

  it("should open dialog if person is not already authenticated for the session key", async () => {
    const user = userEvent.setup();
    mockGetPerson.mockResolvedValueOnce(mockMatchedPerson);
    vi.mocked(checkRegistrationOtp).mockResolvedValueOnce(false);
    render(
      <MfaModalDialogProvider
        getPerson={mockGetPerson}
        checkOtp={checkRegistrationOtp}
        checkAndSendOtp={vi.fn()}
        checkAndVerifyOtp={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());

    await waitFor(() => expect(getDialog("Let's verify it's you")).toBeVisible());
  });

  it("should call error callback and navigate to error page when checkAndSendRegistrationOtp throws an error", async () => {
    const user = userEvent.setup();
    mockGetPerson.mockResolvedValueOnce(mockMatchedPerson);
    vi.mocked(checkRegistrationOtp).mockResolvedValueOnce(false);
    vi.mocked(checkAndSendRegistrationOtp).mockResolvedValueOnce({ errorCode: "TooManyRequestsError" });
    render(
      <MfaModalDialogProvider
        getPerson={mockGetPerson}
        checkOtp={checkRegistrationOtp}
        checkAndSendOtp={checkAndSendRegistrationOtp}
        checkAndVerifyOtp={vi.fn()}
      >
        <TestButton />
      </MfaModalDialogProvider>,
    );

    await user.click(getTestButton());
    await waitFor(() => expect(getDialog("Let's verify it's you")).toBeVisible());

    await user.click(screen.getByRole("button", { name: "Send code" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    expect(pushMock).toHaveBeenCalledWith(systemUnavailableErrorPageUrl);
  });

  it("should call error callback and navigate to error page when checkAndVerifyRegistrationOtp throws an error", async () => {
    // user-event adds a delay between some subsequent inputs.
    // When using fake timers it is necessary to set this option
    // to your test runner's time advancement function.
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockGetPerson.mockResolvedValueOnce(mockMatchedPerson);
    vi.mocked(checkRegistrationOtp).mockResolvedValueOnce(false);
    vi.mocked(checkAndSendRegistrationOtp).mockResolvedValueOnce({ data: { hasSendAttemptsRemaining: true } });
    vi.mocked(checkAndVerifyRegistrationOtp).mockResolvedValueOnce({ errorCode: "TooManyRequestsError" });
    render(
      <MfaModalDialogProvider
        getPerson={mockGetPerson}
        checkOtp={checkRegistrationOtp}
        checkAndSendOtp={checkAndSendRegistrationOtp}
        checkAndVerifyOtp={checkAndVerifyRegistrationOtp}
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
  });

  it("should call success callback when dialog is closed on successful completion", async () => {
    // user-event adds a delay between some subsequent inputs.
    // When using fake timers it is necessary to set this option
    // to your test runner's time advancement function.
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockGetPerson.mockResolvedValueOnce(mockMatchedPerson);
    vi.mocked(checkRegistrationOtp).mockResolvedValueOnce(false);
    vi.mocked(checkAndSendRegistrationOtp).mockResolvedValueOnce({ data: { hasSendAttemptsRemaining: true } });
    vi.mocked(checkAndVerifyRegistrationOtp).mockResolvedValueOnce({ data: { isVerified: true } });
    render(
      <MfaModalDialogProvider
        getPerson={mockGetPerson}
        checkOtp={checkRegistrationOtp}
        checkAndSendOtp={checkAndSendRegistrationOtp}
        checkAndVerifyOtp={checkAndVerifyRegistrationOtp}
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
  });
});

import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectGtmCustomEvent } from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import type { OneTimePasswordDialogProps } from ".";
import type { CheckAndSendOtpResponse, CheckAndVerifyOtpResponse, OtpVerificationDetails } from "./types";
import OneTimePasswordDialog from ".";
import { DEFAULT_RAC_PHONE_NUMBER } from "./constants";
import { getMockVerificationDetails } from "./testing/mocks";

const defaultMockVerificationDetails = getMockVerificationDetails();
const defaultCheckAndSendOtpResponse: CheckAndSendOtpResponse = {
  data: { hasSendAttemptsRemaining: true },
};
const defaultCheckAndVerifyOtpResponse: CheckAndVerifyOtpResponse = {
  data: { isVerified: true },
};

const mockGetVerificationDetails = vi.fn();
const mockCheckAndSendOtp = vi.fn();
const mockCheckAndVerifyOtp = vi.fn();
const mockOnSuccess = vi.fn();
const mockOnError = vi.fn();

type TestProps = Pick<OneTimePasswordDialogProps, "helpDisplayPhoneNumber"> & {
  verificationDetails?: OtpVerificationDetails;
  checkAndSendOtpResponse?: CheckAndSendOtpResponse;
  checkAndVerifyOtpResponse?: CheckAndVerifyOtpResponse;
};

const TestForm = ({
  verificationDetails = defaultMockVerificationDetails,
  checkAndSendOtpResponse = defaultCheckAndSendOtpResponse,
  checkAndVerifyOtpResponse = defaultCheckAndVerifyOtpResponse,
  helpDisplayPhoneNumber,
}: TestProps) => {
  const [display, setDisplay] = useState<boolean>(true);

  mockGetVerificationDetails.mockReturnValue(verificationDetails);
  mockCheckAndSendOtp.mockReturnValue(checkAndSendOtpResponse);
  mockCheckAndVerifyOtp.mockReturnValue(checkAndVerifyOtpResponse);

  return (
    <OneTimePasswordDialog
      onClickClose={() => setDisplay(false)}
      showDialog={display}
      faqUrl="about:blank"
      helpDisplayPhoneNumber={helpDisplayPhoneNumber}
      getVerificationDetails={mockGetVerificationDetails}
      checkAndSendOtp={mockCheckAndSendOtp}
      checkAndVerifyOtp={mockCheckAndVerifyOtp}
      onSuccess={mockOnSuccess}
      onError={mockOnError}
    />
  );
};

const sendSmsButtonText = "Send code";
const requestCallButtonText = "Request a call";
const sendOtpDialogTitle = "Let's verify it's you";
const verifyOtpDialogTitle = "Enter verification code";
const myRacRegistrationHelpPhoneNumber = "1300 045 617";

const getRequestOtpButton = (isSms = true) =>
  screen.getByRole("button", { name: isSms ? sendSmsButtonText : requestCallButtonText });
const getSendOtpDialogTitle = () => screen.getByRole("heading", { name: sendOtpDialogTitle });
const getVerifyOtpDialogTitle = () => screen.getByRole("heading", { name: verifyOtpDialogTitle });
const getCloseIconButton = () => screen.getByRole("button", { name: "close" });
const getNeedHelpLink = () => screen.getByRole("link", { name: "Visit our FAQs", hidden: false });
const getNotYourNumberLink = (displayPhoneNumber = DEFAULT_RAC_PHONE_NUMBER) =>
  screen.getByRole("link", { name: displayPhoneNumber, hidden: false });
const getCodeViaPhoneCallLink = () => screen.getByRole("link", { name: "Get code via phone call" });
const getValidationErrorMessage = () => screen.getByText("Please enter a valid verification code.");
const getOtpInputs = () => screen.getAllByRole<HTMLInputElement>("textbox");

describe("OneTimePasswordDialog", () => {
  describe("LoadingModal", () => {
    it("should render with backdrop visible", async () => {
      render(<TestForm />);

      await waitFor(() => expect(screen.getByTestId("mfa-otp-backdrop")).toBeVisible());
    });
  });

  describe("SendOtpDialog", () => {
    it("should call getVerificationDetails when rendering SendOtpDialog", async () => {
      render(<TestForm />);

      await waitFor(() => expect(getSendOtpDialogTitle()).toBeVisible());

      expect(mockGetVerificationDetails).toHaveBeenCalled();
    });

    it.each([true, false])("should render SendOtpDialog when isMobile is %s", async (isMobile) => {
      render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile }} />);

      await waitFor(() => expect(getSendOtpDialogTitle()).toBeVisible());

      expect(
        screen.getByText(isMobile ? "We'll send a verification code to " : "We'll phone you on ", { exact: false }),
      ).toBeVisible();
      expect(getRequestOtpButton(isMobile)).toBeVisible();
      expect(getNeedHelpLink()).toBeVisible();
      expect(getNotYourNumberLink()).toBeVisible();
    });

    it("should render SendOtpDialog with custom helpDisplayPhoneNumber", async () => {
      render(<TestForm helpDisplayPhoneNumber={myRacRegistrationHelpPhoneNumber} />);

      await waitFor(() => expect(getSendOtpDialogTitle()).toBeVisible());

      expect(getNotYourNumberLink(myRacRegistrationHelpPhoneNumber)).toBeVisible();
    });

    it("should close SendOtpDialog when dialog close icon button is clicked", async () => {
      const user = userEvent.setup();
      render(<TestForm />);

      await waitFor(() => expect(getCloseIconButton()).toBeVisible());
      await user.click(getCloseIconButton());

      expect(screen.queryByText(sendOtpDialogTitle)).toBeNull();
    });

    it.each([true, false])(
      "should call checkAndSendOtp when isMobile is %s and request OTP button is clicked",
      async (isMobile) => {
        const user = userEvent.setup();
        render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile }} />);

        await waitFor(() => expect(getSendOtpDialogTitle()).toBeVisible());

        await user.click(getRequestOtpButton(isMobile));

        expect(mockCheckAndSendOtp).toHaveBeenCalled();
      },
    );
  });

  describe("VerifyOtpDialog", () => {
    const defaultCopyText = "Please enter the code to verify it's you.";

    const getSubmitOtpButton = () => screen.getByRole("button", { name: "Verify" });

    it("should render VerifyOtpDialog when 'Send code' button is clicked", async () => {
      const isMobile = true;
      const user = userEvent.setup();
      render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile }} />);

      await waitFor(() => expect(getRequestOtpButton(isMobile)).toBeVisible());
      await user.click(getRequestOtpButton(isMobile));

      await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());

      expect(
        screen.getByText(
          `We've sent an SMS to 04** *** ${defaultMockVerificationDetails.phoneNumberSuffix}. ${defaultCopyText}`,
        ),
      ).toBeVisible();
      expect(getSubmitOtpButton()).toBeVisible();
      expect(getNeedHelpLink()).toBeVisible();
      expect(getNotYourNumberLink()).toBeVisible();
      expect(mockGetVerificationDetails).toHaveBeenCalled();
    });

    it("should close VerifyOtpDialog when dialog close icon button is clicked", async () => {
      const user = userEvent.setup();
      render(<TestForm />);

      await waitFor(() => expect(getRequestOtpButton()).toBeVisible());
      await user.click(getRequestOtpButton());

      await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());
      await user.click(getCloseIconButton());

      expect(screen.queryByText(verifyOtpDialogTitle)).toBeNull();
    });

    it("should render VerifyOtpDialog when VerificationDetails isMobile is true and the 'Request a call' button is clicked", async () => {
      const user = userEvent.setup();
      render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile: true }} />);

      await waitFor(() => expect(getCodeViaPhoneCallLink()).toBeVisible());
      await user.click(getCodeViaPhoneCallLink());

      await waitFor(() => expect(getRequestOtpButton(false)).toBeVisible());
      await user.click(getRequestOtpButton(false));

      await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());

      expect(screen.getByText(defaultCopyText)).toBeVisible();
      expect(getSubmitOtpButton()).toBeVisible();
    });

    it("should render VerifyOtpDialog when VerificationDetails isMobile is false and the 'Request a call' button is clicked", async () => {
      const user = userEvent.setup();
      render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile: false }} />);

      await waitFor(() => expect(getRequestOtpButton(false)).toBeVisible());
      await user.click(getRequestOtpButton(false));

      await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());

      expect(screen.getByText(defaultCopyText)).toBeVisible();
      expect(getSubmitOtpButton()).toBeVisible();
    });

    it("should render VerifyOtpDialog with custom helpDisplayPhoneNumber", async () => {
      const user = userEvent.setup();
      render(<TestForm helpDisplayPhoneNumber={myRacRegistrationHelpPhoneNumber} />);

      await waitFor(() => expect(getRequestOtpButton()).toBeVisible());
      await user.click(getRequestOtpButton());

      await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());

      expect(getNotYourNumberLink(myRacRegistrationHelpPhoneNumber)).toBeVisible();
    });

    it("should call checkAndVerifyOtp when VerifyOtpDialog is submitted", async () => {
      const user = userEvent.setup();
      render(<TestForm />);

      await waitFor(() => expect(getRequestOtpButton()).toBeVisible());
      await user.click(getRequestOtpButton());

      await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());

      const textboxInputs = getOtpInputs();
      for (let i = 0; i < textboxInputs.length; i++) {
        const input = textboxInputs[`${i}`];
        if (input) {
          await user.type(input, `${i}`);
        }
      }

      await user.click(getSubmitOtpButton());

      expect(mockCheckAndVerifyOtp).toHaveBeenCalled();
    });

    it("should trigger error on submit when OTP input is not valid when contactMethod is 'Sms'", async () => {
      const user = userEvent.setup();
      render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile: true }} />);

      await waitFor(() => expect(getRequestOtpButton()).toBeVisible());
      await user.click(getRequestOtpButton());

      await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());
      await user.click(getSubmitOtpButton());

      expect(getValidationErrorMessage()).toBeVisible();
    });

    it("should trigger error on submit when OTP input is not valid when contactMethod is 'Mobile call'", async () => {
      const user = userEvent.setup();
      render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile: true }} />);

      await waitFor(() => expect(getCodeViaPhoneCallLink()).toBeVisible());
      await user.click(getCodeViaPhoneCallLink());

      await waitFor(() => expect(getRequestOtpButton(false)).toBeVisible());
      await user.click(getRequestOtpButton(false));

      await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());
      await user.click(getSubmitOtpButton());

      expect(getValidationErrorMessage()).toBeVisible();
    });

    it("should trigger error on submit when OTP input is not valid when contactMethod is 'Landline call'", async () => {
      const user = userEvent.setup();
      render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile: false }} />);

      await waitFor(() => expect(getRequestOtpButton(false)).toBeVisible());
      await user.click(getRequestOtpButton(false));

      await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());
      await user.click(getSubmitOtpButton());

      expect(getValidationErrorMessage()).toBeVisible();
    });

    describe("Analytics", () => {
      it("should fire validation error event when form validation fails on submit contactMethod is 'Sms'", async () => {
        // Ideally this would be tested in the useOneTimePassword hook, but unable to trigger the form submission/validation in the test
        const expectedEventDescription =
          "MFA - Sms - Enter verification code - Please enter a valid verification code.";
        const user = userEvent.setup();
        render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile: true }} />);

        await waitFor(() => expect(getRequestOtpButton()).toBeVisible());
        await user.click(getRequestOtpButton());

        await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());
        await user.click(getSubmitOtpButton());

        await waitFor(() => expectGtmCustomEvent(expectedEventDescription));
      });

      it("should fire validation error event when form validation fails on submit when contactMethod is 'Mobile call'", async () => {
        // Ideally this would be tested in the useOneTimePassword hook, but unable to trigger the form submission/validation in the test
        const expectedEventDescription =
          "MFA - Mobile call - Enter verification code - Please enter a valid verification code.";
        const user = userEvent.setup();
        render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile: true }} />);

        await waitFor(() => expect(getCodeViaPhoneCallLink()).toBeVisible());
        await user.click(getCodeViaPhoneCallLink());

        await waitFor(() => expect(getRequestOtpButton(false)).toBeVisible());
        await user.click(getRequestOtpButton(false));

        await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());
        await user.click(getSubmitOtpButton());

        await waitFor(() => expectGtmCustomEvent(expectedEventDescription));
      });

      it("should fire validation error event when form validation fails on submit contactMethod is 'Landline call'", async () => {
        // Ideally this would be tested in the useOneTimePassword hook, but unable to trigger the form submission/validation in the test
        const expectedEventDescription =
          "MFA - Landline call - Enter verification code - Please enter a valid verification code.";
        const user = userEvent.setup();
        render(<TestForm verificationDetails={{ ...defaultMockVerificationDetails, isMobile: false }} />);

        await waitFor(() => expect(getRequestOtpButton(false)).toBeVisible());
        await user.click(getRequestOtpButton(false));

        await waitFor(() => expect(getVerifyOtpDialogTitle()).toBeVisible());
        await user.click(getSubmitOtpButton());

        await waitFor(() => expectGtmCustomEvent(expectedEventDescription));
      });
    });
  });
});

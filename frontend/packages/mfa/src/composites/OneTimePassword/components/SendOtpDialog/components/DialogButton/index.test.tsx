import type { NotAuthenticatedStateFlowValue } from "#composites/OneTimePassword/types/internal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";
import { expectGtmCustomEvent } from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import type { DialogButtonProps } from ".";
import { DialogButton } from ".";

const mockOnClickSendSms = vi.fn();
const mockOnClickReceiveCall = vi.fn();

const sendSmsButtonText = "Send code";
const requestCallButtonText = "Request a call";

type TestProps = Omit<DialogButtonProps, "onClickReceiveCall" | "onClickSendSms">;

const defaultProps: TestProps = {
  isSubmitting: false,
  memberStatus: VerifyOptions.HasMobile,
  selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
};

const TestComponent = (props: TestProps = defaultProps) => {
  return <DialogButton {...props} onClickSendSms={mockOnClickSendSms} onClickReceiveCall={mockOnClickReceiveCall} />;
};

const getRequestCodeButton = (
  selectionStatus: NotAuthenticatedStateFlowValue = NotAuthenticatedStateFlow.SMSVerificationOption,
) =>
  screen.getByRole("button", {
    name:
      selectionStatus === NotAuthenticatedStateFlow.SMSVerificationOption ? sendSmsButtonText : requestCallButtonText,
  });

describe("DialogButton", () => {
  const selectionStatusTestCases = [
    NotAuthenticatedStateFlow.SMSVerificationOption,
    NotAuthenticatedStateFlow.PhoneCallVerificationOption,
  ];

  it.each(selectionStatusTestCases)(
    "should enable the button when isSubmitting is false and selectionStatus is %s",
    (selectionStatus) => {
      render(<TestComponent {...defaultProps} selectionStatus={selectionStatus} />);

      const button = getRequestCodeButton(selectionStatus);

      expect(button).toBeVisible();
      expect(button).toBeEnabled();
    },
  );

  it.each(selectionStatusTestCases)(
    "should disable the button when isSubmitting is true and selectionStatus is %s",
    (selectionStatus) => {
      render(<TestComponent {...defaultProps} selectionStatus={selectionStatus} isSubmitting={true} />);

      const button = getRequestCodeButton(selectionStatus);

      expect(button).toBeVisible();
      expect(button).toBeDisabled();
    },
  );

  it("should call onClickSendSms when the 'Send code' button is clicked", async () => {
    const selectionStatus = NotAuthenticatedStateFlow.SMSVerificationOption;
    const user = userEvent.setup();
    render(<TestComponent {...defaultProps} selectionStatus={selectionStatus} />);

    await user.click(getRequestCodeButton(selectionStatus));

    expect(mockOnClickSendSms).toHaveBeenCalled();
  });

  it("should call onClickReceiveCall when the 'Request phone call' button is clicked", async () => {
    const selectionStatus = NotAuthenticatedStateFlow.PhoneCallVerificationOption;
    const user = userEvent.setup();
    render(<TestComponent {...defaultProps} selectionStatus={selectionStatus} />);

    await user.click(getRequestCodeButton(selectionStatus));

    expect(mockOnClickReceiveCall).toHaveBeenCalled();
  });

  it("should trigger gtm event when the 'Send code' button is clicked", async () => {
    const selectionStatus = NotAuthenticatedStateFlow.SMSVerificationOption;
    const user = userEvent.setup();
    render(<TestComponent {...defaultProps} selectionStatus={selectionStatus} />);

    await user.click(getRequestCodeButton(selectionStatus));

    expectGtmCustomEvent(`MFA - Sms - Lets verify its you - Send code`);
  });

  it.each([VerifyOptions.HasMobile, VerifyOptions.HasLandline])(
    "should trigger gtm event when the 'Request phone call' button is clicked and memberStatus is %s",
    async (memberStatus) => {
      const selectionStatus = NotAuthenticatedStateFlow.PhoneCallVerificationOption;
      const user = userEvent.setup();
      render(<TestComponent {...defaultProps} selectionStatus={selectionStatus} memberStatus={memberStatus} />);

      await user.click(getRequestCodeButton(selectionStatus));

      expectGtmCustomEvent(
        `MFA - ${memberStatus === VerifyOptions.HasMobile ? "Mobile call" : "Landline call"} - Lets verify its you - Request a call`,
      );
    },
  );
});

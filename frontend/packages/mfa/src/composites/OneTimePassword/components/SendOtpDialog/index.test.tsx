import type {
  ContactMethodValue,
  FlowValues,
  NotAuthenticatedStateFlowValue,
} from "#composites/OneTimePassword/types/internal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEFAULT_RAC_PHONE_NUMBER } from "#composites/OneTimePassword/constants";
import { getMockDefaultFlowState } from "#composites/OneTimePassword/testing/mocks";
import { ContactMethod, NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";
import { expectGtmCustomEvent, expectGtmCustomEventToNotHaveBeenCalled } from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import type { SendOtpDialogProps } from ".";
import { SendOtpDialog } from ".";

const mockDefaultFlowState = getMockDefaultFlowState();

const mockOnClickReceiveCall = vi.fn();
const mockOnClickSendSms = vi.fn();
const mockOnClickClose = vi.fn();

const mockUseFlowState = vi.fn();
const mockSetFlowState = vi.fn();
vi.mock("../../contexts/OtpFlowState", async () => {
  const actual = await vi.importActual("../../contexts/OtpFlowState");
  return {
    ...actual,
    useOtpFlowState: (): { flowState: FlowValues; setFlowState: typeof mockSetFlowState } =>
      mockUseFlowState() as { flowState: FlowValues; setFlowState: typeof mockSetFlowState },
  };
});

const defaultProps: SendOtpDialogProps = {
  phoneNumberSuffix: "123",
  helpDisplayPhoneNumber: DEFAULT_RAC_PHONE_NUMBER,
  faqUrl: "about:blank",
  isSubmitting: false,
  onClickReceiveCall: mockOnClickReceiveCall,
  onClickSendSms: mockOnClickSendSms,
  onClickClose: mockOnClickClose,
};

type TestProps = Partial<SendOtpDialogProps> & {
  flowState?: Partial<FlowValues>;
};

const TestComponent = ({ flowState, ...props }: TestProps) => {
  const mockFlowState: FlowValues = {
    ...mockDefaultFlowState,
    isAuthenticated: flowState?.isAuthenticated ?? mockDefaultFlowState.isAuthenticated,
    hasSendAttemptsRemaining: flowState?.hasSendAttemptsRemaining ?? mockDefaultFlowState.hasSendAttemptsRemaining,
    memberStatus: flowState?.memberStatus ?? mockDefaultFlowState.memberStatus,
    selectionStatus: flowState?.selectionStatus ?? mockDefaultFlowState.selectionStatus,
  };
  mockUseFlowState.mockReturnValue({ flowState: mockFlowState, setFlowState: mockSetFlowState });
  return <SendOtpDialog {...defaultProps} {...props} />;
};

const sendSmsButtonText = "Send code";
const requestCallButtonText = "Request a call";
const smsLinkText = "Send code via SMS";
const phoneCallLinkText = "Get code via phone call";

const getCloseIconButton = () => screen.getByRole("button", { name: "close" });
const getRequestCodeButton = (
  selectionStatus: NotAuthenticatedStateFlowValue = NotAuthenticatedStateFlow.SMSVerificationOption,
) =>
  screen.getByRole("button", {
    name:
      selectionStatus === NotAuthenticatedStateFlow.SMSVerificationOption ? sendSmsButtonText : requestCallButtonText,
  });

describe("SendOtpDialog", () => {
  it.each([NotAuthenticatedStateFlow.SMSVerificationOption, NotAuthenticatedStateFlow.PhoneCallVerificationOption])(
    "should render when selectionStatus is NotAuthenticatedStateFlow %s",
    (selectionStatus) => {
      render(<TestComponent flowState={{ selectionStatus }} />);

      expect(screen.getByRole("heading", { name: "Let's verify it's you" })).toBeVisible();
      expect(
        screen.getByText(
          selectionStatus === NotAuthenticatedStateFlow.SMSVerificationOption
            ? "We'll send a verification code to "
            : "We'll phone you on ",
          { exact: false },
        ),
      ).toBeVisible();
      expect(screen.getByText("Need help?")).toBeVisible();
      expect(screen.getByRole("link", { name: "Visit our FAQs" })).toBeVisible();
      expect(screen.getByText("Not your number? Call")).toBeVisible();
      expect(screen.getByRole("link", { name: DEFAULT_RAC_PHONE_NUMBER })).toBeVisible();
      expect(getRequestCodeButton(selectionStatus)).toBeVisible();
      expect(getCloseIconButton()).toBeVisible();
    },
  );

  it.each([NotAuthenticatedStateFlow.SMSVerificationOption, NotAuthenticatedStateFlow.PhoneCallVerificationOption])(
    "should not render dialog when phoneNumberSuffix is empty string and selectionStatus is NotAuthenticatedStateFlow %s",
    (selectionStatus) => {
      render(<TestComponent phoneNumberSuffix="" flowState={{ selectionStatus }} />);

      expect(screen.queryByText(sendSmsButtonText)).toBeNull();
      expect(screen.queryByText(requestCallButtonText)).toBeNull();
    },
  );

  it("should render `Get code via phone call` when member has mobile", () => {
    render(
      <TestComponent
        flowState={{
          memberStatus: VerifyOptions.HasMobile,
          selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
        }}
      />,
    );

    expect(screen.getByRole("link", { name: phoneCallLinkText })).toBeVisible();
  });

  it("should render `Send code via SMS` when member has mobile, and selected Phone Call option", () => {
    render(
      <TestComponent
        flowState={{
          memberStatus: VerifyOptions.HasMobile,
          selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
        }}
      />,
    );

    expect(screen.getByRole("link", { name: smsLinkText })).toBeVisible();
  });

  it("should not render `Send code via SMS` when member has landline only", () => {
    render(<TestComponent flowState={{ memberStatus: VerifyOptions.HasLandline }} />);

    expect(screen.queryByRole("link", { name: smsLinkText })).toBeNull();
  });

  it.each([NotAuthenticatedStateFlow.SMSVerificationOption, NotAuthenticatedStateFlow.PhoneCallVerificationOption])(
    "should disable the request code button when isSubmitting is true and selectionStatus is %s",
    (selectionStatus) => {
      render(<TestComponent flowState={{ memberStatus: VerifyOptions.HasMobile, selectionStatus }} isSubmitting />);

      expect(getRequestCodeButton(selectionStatus)).toBeDisabled();
    },
  );

  it("should trigger onClickSendSms which 'Send code' button is clicked", async () => {
    const selectionStatus = NotAuthenticatedStateFlow.PhoneCallVerificationOption;
    const user = userEvent.setup();
    render(<TestComponent flowState={{ memberStatus: VerifyOptions.HasMobile, selectionStatus }} />);

    await user.click(getRequestCodeButton(selectionStatus));

    expect(mockOnClickReceiveCall).toHaveBeenCalled();
  });

  it("should trigger onClickReceiveCall which 'Send code' button is clicked", async () => {
    const selectionStatus = NotAuthenticatedStateFlow.SMSVerificationOption;
    const user = userEvent.setup();
    render(<TestComponent flowState={{ memberStatus: VerifyOptions.HasMobile, selectionStatus }} />);

    await user.click(getRequestCodeButton(selectionStatus));

    expect(mockOnClickSendSms).toHaveBeenCalled();
  });

  it("should trigger onClickClose when dialog close icon button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    await user.click(getCloseIconButton());

    expect(mockOnClickClose).toHaveBeenCalled();
  });

  it("should trigger onClickClose when escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    await user.keyboard("{Escape}");

    expect(mockOnClickClose).toHaveBeenCalled();
  });

  describe("Analytics", () => {
    type TestCase = { contactMethod: ContactMethodValue } & Partial<
      Pick<FlowValues, "memberStatus" | "selectionStatus">
    >;

    const dialogShownEventTestCases = [
      {
        contactMethod: ContactMethod.Sms,
        memberStatus: VerifyOptions.HasMobile,
        selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
      },
      {
        contactMethod: ContactMethod.MobileCall,
        memberStatus: VerifyOptions.HasMobile,
        selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
      },
      {
        contactMethod: ContactMethod.LandlineCall,
        memberStatus: VerifyOptions.HasLandline,
        selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
      },
    ] as const satisfies TestCase[];

    it.each(dialogShownEventTestCases)(
      "should fire 'MFA - $contactMethod - Lets verify its you' event when dialog is shown",
      ({ contactMethod, memberStatus, selectionStatus }) => {
        const expectedEventDescription = `MFA - ${contactMethod} - Lets verify its you`;
        render(<TestComponent flowState={{ memberStatus, selectionStatus }} />);

        expectGtmCustomEvent(expectedEventDescription);
      },
    );

    it.each(dialogShownEventTestCases)(
      "should not fire 'MFA - $contactMethod - Lets verify its you' event when dialog is not shown",
      ({ memberStatus, selectionStatus }) => {
        render(<TestComponent flowState={{ isAuthenticated: true, memberStatus, selectionStatus }} />);

        expectGtmCustomEventToNotHaveBeenCalled();
      },
    );

    it("should fire 'MFA - Sms - Lets verify its you - Send code' event when 'Send code' button is clicked", async () => {
      const expectedEventDescription = "MFA - Sms - Lets verify its you - Send code";
      const user = userEvent.setup();
      render(
        <TestComponent
          flowState={{
            memberStatus: VerifyOptions.HasMobile,
            selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
          }}
        />,
      );

      await user.click(getRequestCodeButton());

      expectGtmCustomEvent(expectedEventDescription);
    });

    it("should fire 'MFA - Sms - Lets verify its you - Get code via phone call' event when 'Get code via phone call' link is clicked", async () => {
      const expectedEventDescription = "MFA - Sms - Lets verify its you - Get code via phone call";
      const user = userEvent.setup();
      render(
        <TestComponent
          flowState={{
            memberStatus: VerifyOptions.HasMobile,
            selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
          }}
        />,
      );

      await user.click(screen.getByRole("link", { name: phoneCallLinkText }));

      expectGtmCustomEvent(expectedEventDescription);
    });

    it.each([
      {
        contactMethod: ContactMethod.MobileCall,
        memberStatus: VerifyOptions.HasMobile,
      },
      {
        contactMethod: ContactMethod.LandlineCall,
        memberStatus: VerifyOptions.HasLandline,
      },
    ] satisfies TestCase[])(
      "should fire 'MFA - $contactMethod - Lets verify its you - Request a call' event when 'Request a call' button is clicked",
      async ({ contactMethod, memberStatus }) => {
        const expectedEventDescription = `MFA - ${contactMethod} - Lets verify its you - Request a call`;
        const user = userEvent.setup();
        render(
          <TestComponent
            flowState={{
              memberStatus,
              selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
            }}
          />,
        );

        await user.click(getRequestCodeButton(NotAuthenticatedStateFlow.PhoneCallVerificationOption));

        expectGtmCustomEvent(expectedEventDescription);
      },
    );

    it("should fire 'MFA - Mobile call - Lets verify its you - Send code via SMS' event when 'Get code via SMS' link is clicked", async () => {
      const expectedEventDescription = "MFA - Mobile call - Lets verify its you - Send code via SMS";
      const user = userEvent.setup();
      render(
        <TestComponent
          flowState={{
            memberStatus: VerifyOptions.HasMobile,
            selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
          }}
        />,
      );

      await user.click(screen.getByRole("link", { name: smsLinkText }));

      expectGtmCustomEvent(expectedEventDescription);
    });

    it.each(dialogShownEventTestCases)(
      "should fire 'MFA - $contactMethod - Lets verify its you - Dialog closed by the user' event when dialog is closed by clicking close icon",
      async ({ contactMethod, memberStatus, selectionStatus }) => {
        const expectedEventDescription = `MFA - ${contactMethod} - Lets verify its you - Dialog closed by the user`;
        const user = userEvent.setup();
        render(<TestComponent flowState={{ selectionStatus, memberStatus }} />);

        await user.click(getCloseIconButton());

        expectGtmCustomEvent(expectedEventDescription);
      },
    );

    it.each(dialogShownEventTestCases)(
      "should fire 'MFA - $contactMethod - Lets verify its you - Dialog closed by the user' event when dialog is closed by pressing escape key",
      async ({ contactMethod, memberStatus, selectionStatus }) => {
        const expectedEventDescription = `MFA - ${contactMethod} - Lets verify its you - Dialog closed by the user`;
        const user = userEvent.setup();
        render(<TestComponent flowState={{ selectionStatus, memberStatus }} />);

        await user.keyboard("{Escape}");

        expectGtmCustomEvent(expectedEventDescription);
      },
    );
  });
});

import type {
  ContactMethodValue,
  FlowValues,
  OneTimePasswordFormValues,
} from "#composites/OneTimePassword/types/internal";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEFAULT_RAC_PHONE_NUMBER, OTP_VERIFY_FORM_ID } from "#composites/OneTimePassword/constants";
import { verifyOtpSchema } from "#composites/OneTimePassword/schema";
import { getMockDefaultFlowState } from "#composites/OneTimePassword/testing/mocks";
import {
  ContactMethod,
  NotAuthenticatedStateFlow,
  OneTimePasswordErrorState,
  VerifyOptions,
} from "#composites/OneTimePassword/types/internal";
import {
  expectGtmCalledTimes,
  expectGtmCustomEvent,
  expectGtmCustomEventToNotHaveBeenCalled,
} from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import type { VerifyOtpDialogProps } from ".";
import VerifyOtpDialog from ".";
import { mockGtm } from "../../../../../setupTests";

const mockDefaultFlowState = getMockDefaultFlowState();

const mockOnSubmit = vi.fn();
const mockOnClickClose = vi.fn();
const mockOnSubmitVerifyOtp = vi.fn();

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

type TestProps = Partial<Omit<VerifyOtpDialogProps, "form" | "fields">> & {
  flowState?: Partial<FlowValues>;
};

const defaultProps = {
  phoneNumberSuffix: "123",
  helpDisplayPhoneNumber: DEFAULT_RAC_PHONE_NUMBER,
  faqUrl: "about:blank",
  isSubmitting: false,
  justVerified: false,
  oneTimePasswordError: OneTimePasswordErrorState.None,
  onSubmitVerifyOtp: mockOnSubmitVerifyOtp,
  onClickClose: mockOnClickClose,
} as const satisfies TestProps;

const TestForm = ({ flowState, ...props }: TestProps) => {
  const [form, fields] = useForm<OneTimePasswordFormValues>({
    id: OTP_VERIFY_FORM_ID,
    shouldValidate: "onSubmit",
    shouldRevalidate: "onSubmit",
    onValidate: (context) => parseWithZod(context.formData, { schema: verifyOtpSchema }),
    onSubmit: mockOnSubmit,
  });

  const mockFlowState: FlowValues = {
    ...mockDefaultFlowState,
    isAuthenticated: flowState?.isAuthenticated ?? mockDefaultFlowState.isAuthenticated,
    hasSendAttemptsRemaining: flowState?.hasSendAttemptsRemaining ?? mockDefaultFlowState.hasSendAttemptsRemaining,
    memberStatus: flowState?.memberStatus ?? mockDefaultFlowState.memberStatus,
    selectionStatus: flowState?.selectionStatus ?? mockDefaultFlowState.selectionStatus,
  };
  mockUseFlowState.mockReturnValue({ flowState: mockFlowState, setFlowState: mockSetFlowState });

  return <VerifyOtpDialog form={form} fields={fields} {...defaultProps} {...props} />;
};

const sendNewCodeLinkText = "Send new code";
const getCodeViaPhoneCallLinkText = "Get code via phone call";
const defaultCopyText = "Please enter the code to verify it's you.";
const defaultErrorMessage = "Please enter a valid verification code.";

const getDialogTitle = () => screen.getByRole("heading", { name: "Enter verification code" });
const getNeedHelpText = () => screen.getByText("Need help?", { exact: false });
const getOtpInputs = () => screen.getAllByRole<HTMLInputElement>("textbox");
const getSendNewCodeLink = () => screen.getByRole("link", { name: sendNewCodeLinkText });
const querySendNewCodeLink = () => screen.queryByRole("link", { name: sendNewCodeLinkText });
const getCodeViaPhoneCallLink = () => screen.getByRole("link", { name: getCodeViaPhoneCallLinkText });
const queryGetCodeViaPhoneCallLink = () => screen.queryByRole("link", { name: getCodeViaPhoneCallLinkText });
const getAnotherPhoneCallLink = () => screen.getByRole("link", { name: "Get another phone call" });
const getSendCodeViaSMSLink = () => screen.getByRole("link", { name: "Send code via SMS" });
const getSubmitButton = () => screen.getByRole("button", { name: "Verify" });
const getCloseIconButton = () => screen.getByRole("button", { name: "close" });

const expectOtpInputsToBeDisabled = () => getOtpInputs().forEach((i) => expect(i).toBeDisabled());
const expectOtpInputsToBeCleared = () => getOtpInputs().forEach((i) => expect(i.value).toBe(""));

describe("VerifyOtpDialog", () => {
  it("should render when ReadyToVerifyWithSMS option is selected and member has mobile", () => {
    render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

    expect(getDialogTitle()).toBeVisible();
    expect(
      screen.getByText(`We've sent an SMS to 04** *** ${defaultProps.phoneNumberSuffix}. ${defaultCopyText}`),
    ).toBeVisible();
    expect(getSubmitButton()).toBeVisible();
    expect(getSendNewCodeLink()).toBeVisible();
    expect(getCodeViaPhoneCallLink()).toBeVisible();
    expect(getNeedHelpText()).toBeVisible();
    expect(getCloseIconButton()).toBeVisible();
  });

  it("should not render send new code links when ReadyToVerifyWithSms, member has mobile and hasSendAttemptsRemaining is false", () => {
    render(
      <TestForm
        flowState={{
          hasSendAttemptsRemaining: false,
          selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
        }}
      />,
    );

    expect(getDialogTitle()).toBeVisible();
    expect(
      screen.getByText(`We've sent an SMS to 04** *** ${defaultProps.phoneNumberSuffix}. ${defaultCopyText}`),
    ).toBeVisible();
    expect(getSubmitButton()).toBeVisible();
    expect(getNeedHelpText()).toBeVisible();
    expect(querySendNewCodeLink()).toBeNull();
    expect(queryGetCodeViaPhoneCallLink()).toBeNull();
    expect(getCloseIconButton()).toBeVisible();
  });

  it("should render when ReadyToVerifyWithPhoneCall option is selected and member has landline", () => {
    render(
      <TestForm
        flowState={{
          memberStatus: VerifyOptions.HasLandline,
          selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
        }}
      />,
    );

    expect(getDialogTitle()).toBeVisible();
    expect(screen.getByText(defaultCopyText)).toBeVisible();
    expect(getSubmitButton()).toBeVisible();
    expect(getAnotherPhoneCallLink()).toBeVisible();
    expect(getNeedHelpText()).toBeVisible();
    expect(getCloseIconButton()).toBeVisible();
  });

  it("should not render send new code links when ReadyToVerifyWithPhoneCall, member has landline and hasSendAttemptsRemaining is false", () => {
    render(
      <TestForm
        flowState={{
          hasSendAttemptsRemaining: false,
          memberStatus: VerifyOptions.HasLandline,
          selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
        }}
      />,
    );

    expect(getDialogTitle()).toBeVisible();
    expect(screen.getByText(defaultCopyText)).toBeVisible();
    expect(getSubmitButton()).toBeVisible();
    expect(getNeedHelpText()).toBeVisible();
    expect(querySendNewCodeLink()).toBeNull();
    expect(queryGetCodeViaPhoneCallLink()).toBeNull();
    expect(getCloseIconButton()).toBeVisible();
  });

  it("should render when ReadyToVerifyWithPhoneCall option is selected and member has mobile", () => {
    render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }} />);

    expect(getDialogTitle()).toBeVisible();
    expect(screen.getByText(defaultCopyText)).toBeVisible();
    expect(getSubmitButton()).toBeVisible();
    expect(getAnotherPhoneCallLink()).toBeVisible();
    expect(getSendCodeViaSMSLink()).toBeVisible();
    expect(getNeedHelpText()).toBeVisible();
    expect(getCloseIconButton()).toBeVisible();
  });

  it("should not render send new code links when ReadyToVerifyWithPhoneCall, member has mobile and hasSendAttemptsRemaining is false", () => {
    render(
      <TestForm
        flowState={{
          hasSendAttemptsRemaining: false,
          selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
        }}
      />,
    );

    expect(getDialogTitle()).toBeVisible();
    expect(screen.getByText(defaultCopyText)).toBeVisible();
    expect(getSubmitButton()).toBeVisible();
    expect(getNeedHelpText()).toBeVisible();
    expect(querySendNewCodeLink()).toBeNull();
    expect(queryGetCodeViaPhoneCallLink()).toBeNull();
    expect(getCloseIconButton()).toBeVisible();
  });

  it("should trigger error on submit when OTP inputs not set", async () => {
    const user = userEvent.setup();
    render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }} />);

    await user.click(getSubmitButton());

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnSubmitVerifyOtp).not.toHaveBeenCalled();
    expect(screen.getByText(defaultErrorMessage)).toBeVisible();
  });

  it("should submit without error when OTP inputs set", async () => {
    const user = userEvent.setup();
    render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }} />);

    const textboxInputs = getOtpInputs();
    for (let i = 0; i < textboxInputs.length; i++) {
      const input = textboxInputs[`${i}`];
      if (input) {
        await user.type(input, `${i}`);
      }
    }
    await user.click(getSubmitButton());

    expect(mockOnSubmit).toHaveBeenCalled();
    expect(mockOnSubmitVerifyOtp).toHaveBeenCalled();
    expect(screen.queryByText(defaultErrorMessage)).toBeNull();
  });

  it("should disable the OTP input and submit button when isSubmitting is true", () => {
    render(<TestForm isSubmitting flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

    expectOtpInputsToBeDisabled();

    expect(screen.getByRole("button", { name: "Verifying" })).toBeDisabled();
  });

  it("should disable the OTP input when justVerified is true", () => {
    render(<TestForm justVerified flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

    expectOtpInputsToBeDisabled();
  });

  it("should disable the OTP input when oneTimePasswordError is OneTimePasswordErrorState CodeExpired", () => {
    render(
      <TestForm
        oneTimePasswordError={OneTimePasswordErrorState.CodeExpired}
        flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }}
      />,
    );

    expectOtpInputsToBeDisabled();
  });

  it("should have an OTP wrong code error when oneTimePasswordError is OneTimePasswordErrorState WrongCode", () => {
    render(
      <TestForm
        oneTimePasswordError={OneTimePasswordErrorState.WrongCode}
        flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }}
      />,
    );

    expect(screen.getByText("Sorry, that code doesn't match. Please try again or request a new code.")).toBeVisible();
  });

  it("should have an OTP code expired error and disable the submit button when oneTimePasswordError is OneTimePasswordErrorState CodeExpired", () => {
    render(
      <TestForm
        oneTimePasswordError={OneTimePasswordErrorState.CodeExpired}
        flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }}
      />,
    );

    expect(screen.getByText("Sorry, that code has expired. Please request a new code.")).toBeVisible();

    expectOtpInputsToBeDisabled();

    expect(getSubmitButton()).toBeDisabled();
  });

  it("should clear the OTP input when 'Send new code' is clicked", async () => {
    const user = userEvent.setup();
    render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

    const textboxInputs = getOtpInputs();
    for (let i = 0; i < textboxInputs.length; i++) {
      const input = textboxInputs[`${i}`];
      if (input) {
        await user.type(input, `${i}`);
      }
    }

    await user.click(getSendNewCodeLink());

    expectOtpInputsToBeCleared();
  });

  it("should clear the OTP input when 'Send code via phone call' is clicked", async () => {
    const user = userEvent.setup();
    render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

    const textboxInputs = getOtpInputs();
    for (let i = 0; i < textboxInputs.length; i++) {
      const input = textboxInputs[`${i}`];
      if (input) {
        await user.type(input, `${i}`);
      }
    }

    await user.click(getCodeViaPhoneCallLink());

    expectOtpInputsToBeCleared();
  });

  it("should clear the OTP input when 'Get another phone call' is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TestForm
        flowState={{
          memberStatus: VerifyOptions.HasLandline,
          selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
        }}
      />,
    );

    const textboxInputs = getOtpInputs();
    for (let i = 0; i < textboxInputs.length; i++) {
      const input = textboxInputs[`${i}`];
      if (input) {
        await user.type(input, `${i}`);
      }
    }

    await user.click(getAnotherPhoneCallLink());

    expectOtpInputsToBeCleared();
  });

  it("should clear the OTP input when 'Send code via SMS' is clicked", async () => {
    const user = userEvent.setup();
    render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }} />);

    const textboxInputs = getOtpInputs();
    for (let i = 0; i < textboxInputs.length; i++) {
      const input = textboxInputs[`${i}`];
      if (input) {
        await user.type(input, `${i}`);
      }
    }

    await user.click(getSendCodeViaSMSLink());

    expectOtpInputsToBeCleared();
  });

  it("should trigger onClickClose when dialog close icon button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

    await user.click(getCloseIconButton());

    expect(mockOnClickClose).toHaveBeenCalled();
  });

  it("should trigger onClickClose when escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

    await user.keyboard("{Escape}");

    expect(mockOnClickClose).toHaveBeenCalled();
  });

  describe("Analytics", () => {
    type TestCase = { contactMethod: ContactMethodValue } & Partial<
      Pick<FlowValues, "selectionStatus" | "memberStatus">
    >;

    const testCases = [
      {
        contactMethod: ContactMethod.Sms,
        memberStatus: VerifyOptions.HasMobile,
        selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
      },
      {
        contactMethod: ContactMethod.MobileCall,
        memberStatus: VerifyOptions.HasMobile,
        selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
      },
      {
        contactMethod: ContactMethod.LandlineCall,
        memberStatus: VerifyOptions.HasLandline,
        selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
      },
    ] as const satisfies TestCase[];

    it.each(testCases)(
      "should fire 'MFA - $contactMethod - Enter verification code' event when dialog is shown",
      ({ contactMethod, memberStatus, selectionStatus }) => {
        const expectedEventDescription = `MFA - ${contactMethod} - Enter verification code`;
        render(<TestForm flowState={{ memberStatus, selectionStatus }} />);

        expectGtmCustomEvent(expectedEventDescription);
      },
    );

    it.each(testCases)(
      "should not fire 'MFA - $contactMethod - Enter verification code' event when dialog is not shown",
      ({ memberStatus, selectionStatus }) => {
        render(<TestForm flowState={{ isAuthenticated: true, memberStatus, selectionStatus }} />);

        expectGtmCustomEventToNotHaveBeenCalled();
      },
    );

    it("should fire 'MFA - Sms - Enter verification code - Send new code' event when 'Send new code' link is clicked", async () => {
      const expectedEventDescription = "MFA - Sms - Enter verification code - Send new code";
      const user = userEvent.setup();
      render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

      await user.click(getSendNewCodeLink());

      expectGtmCustomEvent(expectedEventDescription);
    });

    it("should fire 'MFA - Sms - Enter verification code - Get code via a phone call' event when 'Get code via a phone call' link is clicked", async () => {
      const expectedEventDescription = "MFA - Sms - Enter verification code - Get code via phone call";
      const user = userEvent.setup();
      render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

      await user.click(getCodeViaPhoneCallLink());

      expectGtmCustomEvent(expectedEventDescription);
    });

    it("should fire 'MFA - Mobile call - Enter verification code - Send code via SMS' event when 'Send code via SMS' link is clicked", async () => {
      const expectedEventDescription = "MFA - Mobile call - Enter verification code - Send code via SMS";
      const user = userEvent.setup();
      render(<TestForm flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }} />);

      await user.click(getSendCodeViaSMSLink());

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
      "should fire 'MFA - $contactMethod - Enter verification code - Get another phone call' event when 'Get another phone call' link is clicked",
      async ({ contactMethod, memberStatus }) => {
        const expectedEventDescription = `MFA - ${contactMethod} - Enter verification code - Get another phone call`;
        const user = userEvent.setup();
        render(
          <TestForm
            flowState={{
              memberStatus,
              selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
            }}
          />,
        );

        await user.click(getAnotherPhoneCallLink());

        expectGtmCustomEvent(expectedEventDescription);
      },
    );

    it.each(testCases)(
      "should fire 'MFA - $contactMethod - Enter verification code - Please enter the code to verify its you' event when first digit of OTP is entered",
      async ({ contactMethod, memberStatus, selectionStatus }) => {
        const expectedEventDescription = `MFA - ${contactMethod} - Enter verification code - Please enter the code to verify its you`;
        const user = userEvent.setup();
        render(<TestForm flowState={{ selectionStatus, memberStatus }} />);

        // Wait for component to fire showDialog event
        await waitFor(() => expect(mockGtm).toHaveBeenCalled());
        mockGtm.mockReset();

        const textboxInputs = getOtpInputs();
        if (textboxInputs[0]) {
          await user.type(textboxInputs[0], "0");
        }
        expectGtmCustomEvent(expectedEventDescription);

        for (let i = 1; i < textboxInputs.length; i++) {
          const input = textboxInputs[`${i}`];
          if (input) {
            await user.type(input, `${i}`);
          }
        }
        expectGtmCalledTimes(1);
      },
    );

    it.each(testCases)(
      "should fire 'MFA - $contactMethod - Enter verification code - Dialog closed by the user' event when dialog is closed by clicking close icon",
      async ({ contactMethod, memberStatus, selectionStatus }) => {
        const expectedEventDescription = `MFA - ${contactMethod} - Enter verification code - Dialog closed by the user`;
        const user = userEvent.setup();
        render(<TestForm flowState={{ selectionStatus, memberStatus }} />);

        await user.click(getCloseIconButton());

        expectGtmCustomEvent(expectedEventDescription);
      },
    );

    it.each(testCases)(
      "should fire 'MFA - $contactMethod - Enter verification code - Dialog closed by the user' event when dialog is closed by pressing escape key",
      async ({ contactMethod, memberStatus, selectionStatus }) => {
        const expectedEventDescription = `MFA - ${contactMethod} - Enter verification code - Dialog closed by the user`;
        const user = userEvent.setup();
        render(<TestForm flowState={{ selectionStatus, memberStatus }} />);

        await user.keyboard("{Escape}");

        expectGtmCustomEvent(expectedEventDescription);
      },
    );
  });
});

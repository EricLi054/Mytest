import type { Meta, StoryObj } from "@storybook/react";
import type { OneTimePasswordFormValues, VerifyOptionsValue } from "#composites/OneTimePassword/types/internal";
import { useEffect } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Box, Button } from "@mui/material";
import { DEFAULT_RAC_PHONE_NUMBER, OTP_VERIFY_FORM_ID } from "#composites/OneTimePassword/constants";
import { verifyOtpSchema } from "#composites/OneTimePassword/schema";
import {
  NotAuthenticatedStateFlow,
  OneTimePasswordErrorState,
  VerifyOptions,
} from "#composites/OneTimePassword/types/internal";

import type { VerifyOtpDialogProps } from ".";
import VerifyOtpDialog from ".";
import { OtpFlowStateProvider, useOtpFlowState } from "../../contexts/OtpFlowState";

const otpVerificationCode = "000000";

const meta: Meta<typeof Template> = {
  title: "mfa/Composites/One Time Password/Components/Verify OTP Dialog",
  tags: ["@racwa/mfa", "!autodocs"], // Remove autodocs tag for component otherwise the dialog for every story opens on the docs page
  component: Template,
  args: {
    hasSendAttemptsRemaining: true,
    memberStatus: VerifyOptions.HasMobile,
    selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
    oneTimePasswordError: OneTimePasswordErrorState.None,
    isSubmitting: false,
    justVerified: false,
  },
  decorators: [
    (Story) => (
      <OtpFlowStateProvider>
        <Story />
      </OtpFlowStateProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

type TemplateProps = {
  hasSendAttemptsRemaining: boolean;
  memberStatus: VerifyOptionsValue;
  selectionStatus: "ReadyToVerifyWithSMS" | "ReadyToVerifyWithPhoneCall";
} & Pick<VerifyOtpDialogProps, "justVerified" | "isSubmitting" | "oneTimePasswordError" | "helpDisplayPhoneNumber"> &
  Partial<OneTimePasswordFormValues>;

function Template({
  hasSendAttemptsRemaining,
  memberStatus,
  selectionStatus,
  oneTimePasswordError,
  justVerified,
  isSubmitting,
  verificationCode,
}: TemplateProps) {
  const { setFlowState } = useOtpFlowState();

  const [form, fields] = useForm<OneTimePasswordFormValues>({
    id: OTP_VERIFY_FORM_ID,
    shouldValidate: "onSubmit",
    shouldRevalidate: "onSubmit",
    defaultValue: { verificationCode }, // Need to be able to set default value for stories
    onValidate: (context) => {
      console.log("Storybook - OnValidate triggered");
      return parseWithZod(context.formData, { schema: verifyOtpSchema });
    },
    onSubmit: () => console.log("Storybook - OnSubmit triggered"),
  });

  const openDialog = () => {
    setFlowState({
      isAuthenticated: false,
      hasSendAttemptsRemaining,
      memberStatus,
      selectionStatus,
    });
  };

  const closeDialog = () => {
    setFlowState({
      isAuthenticated: true,
      hasSendAttemptsRemaining,
      memberStatus,
      selectionStatus,
    });
  };

  useEffect(
    () => openDialog(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasSendAttemptsRemaining, memberStatus, selectionStatus],
  );

  return (
    <Box p={4}>
      <Button color="primary" onClick={openDialog}>
        Open dialog
      </Button>
      <VerifyOtpDialog
        form={form}
        fields={fields}
        phoneNumberSuffix="132"
        helpDisplayPhoneNumber={DEFAULT_RAC_PHONE_NUMBER}
        faqUrl="about:blank"
        isSubmitting={isSubmitting}
        onClickClose={closeDialog}
        onSubmitVerifyOtp={async () => {
          console.log("Storybook - onSubmitVerifyOtp triggered");
          alert("Valid verification code submitted successfully");
          await Promise.resolve(closeDialog());
        }}
        justVerified={justVerified}
        oneTimePasswordError={oneTimePasswordError}
      />
    </Box>
  );
}

export const WithSmsWithMobile = {} satisfies Story;

export const WithPhoneCallWithLandline = {
  args: {
    memberStatus: VerifyOptions.HasLandline,
    selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
  },
} satisfies Story;

export const WithPhoneCallWithMobile = {
  args: {
    selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
  },
} satisfies Story;

export const WithNoSendAttemptsRemaining = {
  args: {
    hasSendAttemptsRemaining: false,
  },
} satisfies Story;

export const WhileSubmitting = {
  args: {
    isSubmitting: true,
    verificationCode: otpVerificationCode,
  },
} satisfies Story;

export const WhenOneTimePasswordCodeIsSubmitted = {
  args: {
    isSubmitting: true,
    verificationCode: otpVerificationCode,
  },
} satisfies Story;

export const WhenOneTimePasswordCodeVerified = {
  args: {
    justVerified: true,
    verificationCode: otpVerificationCode,
  },
} satisfies Story;

export const WithWrongOneTimePasswordCode = {
  args: {
    oneTimePasswordError: OneTimePasswordErrorState.WrongCode,
    verificationCode: otpVerificationCode,
  },
} satisfies Story;

export const WithExpiredOneTimePasswordCode = {
  args: {
    oneTimePasswordError: OneTimePasswordErrorState.CodeExpired,
    verificationCode: otpVerificationCode,
  },
} satisfies Story;

export const WithCustomHelpPhoneNumber = {
  args: {
    helpDisplayPhoneNumber: "1300 045 617",
  },
} satisfies Story;

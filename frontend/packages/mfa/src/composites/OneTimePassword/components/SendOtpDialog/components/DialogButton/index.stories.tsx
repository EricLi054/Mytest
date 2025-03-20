import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";

import type { DialogButtonProps } from ".";
import { DialogButton } from ".";

const meta: Meta<typeof Template> = {
  title: "mfa/Composites/One Time Password/Components/Send OTP Dialog/Components/Dialog Button",
  tags: ["@racwa/mfa"],
  component: Template,
  args: {
    isSubmitting: false,
    memberStatus: VerifyOptions.HasMobile,
    selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
    onClickReceiveCall: () => console.log("Storybook - onClickReceiveCall triggered"),
    onClickSendSms: () => console.log("Storybook - onClickSendSms triggered"),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function Template(props: DialogButtonProps) {
  return (
    <Box p={4}>
      <DialogButton {...props} />
    </Box>
  );
}

export const SendSms = { args: {} } satisfies Story;

export const SendSmsDisabled = { args: { isSubmitting: true } } satisfies Story;

export const RequestCall = {
  args: { selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption },
} satisfies Story;

export const RequestCallDisabled = {
  args: { isSubmitting: true, selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption },
} satisfies Story;

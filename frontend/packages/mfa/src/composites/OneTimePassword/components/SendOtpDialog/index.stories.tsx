import type { Meta, StoryObj } from "@storybook/react";
import type {
  FlowValues,
  NotAuthenticatedStateFlowValue,
  VerifyOptionsValue,
} from "#composites/OneTimePassword/types/internal";
import { Box, Button } from "@mui/material";
import { DEFAULT_RAC_PHONE_NUMBER } from "#composites/OneTimePassword/constants";
import { NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";

import type { SendOtpDialogProps } from ".";
import SendOtpDialog from ".";
import { OtpFlowStateProvider, useOtpFlowState } from "../../contexts/OtpFlowState";

/**
 * Need to store result of useOtpFlowState like this to be able to set the flow
 * state using the Storybook `play` function that is executed after the story
 * is rendered, otherwise the default story dialog displays as open by default
 * when story is loaded and not changing when selected story changes.
 *
 * Have tried using a useEffect to reset the dialog when the story changes like VerifyOtpDialog, but it doesn't work.
 * The useEffect appears to run, but the "Open dialog" button is behind a hidden storybook-root and cannot be interacted with.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let otpFlowState: any;

const setFlowState = (
  isAuthenticated: boolean,
  memberStatus: VerifyOptionsValue,
  selectionStatus: NotAuthenticatedStateFlowValue,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  otpFlowState.setFlowState({
    isAuthenticated,
    hasSendAttemptsRemaining: true,
    memberStatus,
    selectionStatus,
  });
};

const meta: Meta<typeof Template> = {
  title: "mfa/Composites/One Time Password/Components/Send OTP Dialog",
  tags: ["@racwa/mfa", "!autodocs"], // Remove autodocs tag for component otherwise the dialog for every story opens on the docs page
  component: Template,
  play: ({ args: { memberStatus, selectionStatus } }) => {
    setFlowState(false, memberStatus, selectionStatus);
  },
  decorators: [
    (Story) => (
      <OtpFlowStateProvider>
        <Story />
      </OtpFlowStateProvider>
    ),
  ],
} satisfies Meta<typeof Template>;

export default meta;
type Story = StoryObj<typeof meta>;

type TemplateProps = Pick<FlowValues, "memberStatus" | "selectionStatus"> &
  Pick<SendOtpDialogProps, "isSubmitting" | "helpDisplayPhoneNumber">;

function Template({
  memberStatus,
  selectionStatus,
  isSubmitting,
  helpDisplayPhoneNumber = DEFAULT_RAC_PHONE_NUMBER,
}: TemplateProps) {
  otpFlowState = useOtpFlowState();

  const openDialog = () => setFlowState(false, memberStatus, selectionStatus);
  const closeDialog = () => setFlowState(true, memberStatus, selectionStatus);

  return (
    <Box p={4}>
      <Button color="primary" onClick={openDialog}>
        Open dialog
      </Button>
      <SendOtpDialog
        phoneNumberSuffix="321"
        helpDisplayPhoneNumber={helpDisplayPhoneNumber}
        faqUrl="about:blank"
        isSubmitting={!!isSubmitting}
        onClickReceiveCall={() => {
          alert("OTP code phone call initiated");
          closeDialog();
        }}
        onClickSendSms={() => {
          alert("OTP code sent via SMS");
          closeDialog();
        }}
        onClickClose={closeDialog}
      />
    </Box>
  );
}

export const MemberWithMobile = {
  args: {
    memberStatus: VerifyOptions.HasMobile,
    selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
  },
} satisfies Story;

export const MemberWithLandline = {
  args: {
    memberStatus: VerifyOptions.HasLandline,
    selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
  },
} satisfies Story;

export const MemberWithMobileButWithPhoneCallSelection = {
  args: {
    memberStatus: VerifyOptions.HasMobile,
    selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
  },
} satisfies Story;

export const WhileSubmitting = {
  args: {
    memberStatus: VerifyOptions.HasMobile,
    selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
    isSubmitting: true,
  },
} satisfies Story;

export const WithCustomHelpPhoneNumber = {
  args: {
    memberStatus: VerifyOptions.HasMobile,
    selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
    helpDisplayPhoneNumber: "1300 045 617",
  },
} satisfies Story;

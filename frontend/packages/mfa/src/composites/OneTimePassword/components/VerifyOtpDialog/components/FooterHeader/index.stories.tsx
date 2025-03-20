import type { Meta, StoryObj } from "@storybook/react";
import type {
  FlowValues,
  NotAuthenticatedStateFlowValue,
  VerifyOptionsValue,
} from "#composites/OneTimePassword/types/internal";
import { Box } from "@mui/material";
import { OtpFlowStateProvider, useOtpFlowState } from "#composites/OneTimePassword/contexts/OtpFlowState/index";
import { NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";

import FooterHeader from ".";

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
  title: "mfa/Composites/One Time Password/Components/Verify OTP Dialog/Components/Footer Header",
  tags: ["@racwa/mfa"],
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
};

type TemplateProps = Pick<FlowValues, "memberStatus" | "selectionStatus">;

// eslint-disable-next-line no-empty-pattern
function Template({}: TemplateProps) {
  otpFlowState = useOtpFlowState();

  return (
    <Box p={4}>
      <FooterHeader clearOtpInput={() => console.log("Storybook - ClearOtpInput triggered")} />
    </Box>
  );
}

export default meta;
type Story = StoryObj<typeof meta>;

export const IsSmsAndReadyToVerifyWithMobilePhoneCall = {
  args: {
    memberStatus: VerifyOptions.HasMobile,
    selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
  },
} satisfies Story;

export const IsSmsAndReadyToVerifyWithLandlinePhoneCall = {
  args: {
    memberStatus: VerifyOptions.HasLandline,
    selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
  },
} satisfies Story;

export const IsCallAndReadyToVerifyWithMobilePhoneCall = {
  args: {
    memberStatus: VerifyOptions.HasMobile,
    selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
  },
} satisfies Story;

export const IsCallAndReadyToVerifyWithLandlinePhoneCall = {
  args: {
    memberStatus: VerifyOptions.HasLandline,
    selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
  },
} satisfies Story;

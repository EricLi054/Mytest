"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";

import type { SendCodeViaSmsLinkProps } from ".";
import SendCodeViaSmsLink from ".";
import { OtpFlowStateProvider } from "../../contexts/OtpFlowState";

const meta: Meta<typeof Template> = {
  title: "mfa/Composites/One Time Password/Components/Send Code Via Sms Link",
  tags: ["@racwa/mfa"],
  component: Template,
  args: {
    idPrefix: "storybook",
    clearOtpInput: () => console.log("Storybook - clearOtpInput triggered"),
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

function Template(props: SendCodeViaSmsLinkProps) {
  return (
    <Box p={4}>
      <SendCodeViaSmsLink {...props} />
    </Box>
  );
}

export const Default = { name: "Send Code Via Sms Link" } satisfies Story;

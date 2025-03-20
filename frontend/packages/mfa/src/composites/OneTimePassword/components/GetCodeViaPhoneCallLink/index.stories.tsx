import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";

import type { GetCodeViaPhoneCallLinkProps } from ".";
import GetCodeViaPhoneCallLink from ".";
import { OtpFlowStateProvider } from "../../contexts/OtpFlowState";

const meta: Meta<typeof Template> = {
  title: "mfa/Composites/One Time Password/Components/Get Code Via Phone Call Link",
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

function Template(props: GetCodeViaPhoneCallLinkProps) {
  return (
    <Box p={4}>
      <GetCodeViaPhoneCallLink {...props} />
    </Box>
  );
}

export const Default = { name: "Get Code Via Phone Call Link" } satisfies Story;

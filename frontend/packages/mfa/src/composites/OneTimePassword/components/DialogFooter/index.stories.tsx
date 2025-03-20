import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button } from "@mui/material";

import type { DialogFooterProps } from ".";
import { DialogFooter } from ".";

const meta: Meta<typeof Template> = {
  title: "mfa/Composites/One Time Password/Components/Dialog Footer",
  tags: ["@racwa/mfa"],
  component: Template,
  args: { faqUrl: "about:blank" },
};

export default meta;
type Story = StoryObj<typeof meta>;

function Template(props: DialogFooterProps) {
  return (
    <Box p={4}>
      <DialogFooter {...props} dialogId="test" />
    </Box>
  );
}

export const Default = { args: { header: undefined } } satisfies Story;

export const WithHeader = { args: { header: <Button>Header element</Button> } } satisfies Story;

export const WithCustomHelpPhoneNumber = { args: { helpDisplayPhoneNumber: "1300 045 617" } } satisfies Story;

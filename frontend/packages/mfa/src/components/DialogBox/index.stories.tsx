import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

import type { DialogBoxProps } from ".";
import { DialogBox } from ".";

const meta = {
  title: "mfa/Components/Dialog Box",
  tags: ["@racwa/mfa"],
  component: Template,
} satisfies Meta<typeof Template>;

export default meta;
type Story = StoryObj<typeof meta>;

type TemplateProps = Omit<DialogBoxProps, "showDialog" | "setShowDialog">;

function Template(props: TemplateProps) {
  const [open, setOpen] = useState(false);
  return (
    <Box p={4}>
      <Button color="primary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <DialogBox showDialog={open} setShowDialog={() => setOpen(false)} {...props} />
    </Box>
  );
}

export const Default = {
  name: "Dialog Box",
  args: {
    id: "test",
    title: "Default title",
    content: "Dialog will close if user clicks outside of the dialog",
    buttons: <Button color="primary">Button</Button>,
    footer: (
      <Box mt={2}>
        <Typography>Footer</Typography>
      </Box>
    ),
  },
} satisfies Story;

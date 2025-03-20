import type { Meta, StoryObj } from "@storybook/react";

import DialogButtons from ".";
import { VerifyButtonState } from "../../types";

const meta = {
  title: "mfa/Composites/One Time Password/Components/Verify OTP Dialog/Components/Dialog Buttons",
  tags: ["@racwa/mfa"],
  component: DialogButtons,
} satisfies Meta<typeof DialogButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Verify = { args: { activeState: VerifyButtonState.ToVerify } } satisfies Story;

export const Verifying = { args: { activeState: VerifyButtonState.Verifying } } satisfies Story;

export const Verified = { args: { activeState: VerifyButtonState.Verified } } satisfies Story;

export const Disabled = { args: { activeState: VerifyButtonState.Disabled } } satisfies Story;

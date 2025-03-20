import type { Meta, StoryObj } from "@storybook/react";

import EnterCodeText from ".";

const meta = {
  title: "mfa/Composites/One Time Password/Components/Verify OTP Dialog/Components/Enter Code Text",
  tags: ["@racwa/mfa"],
  component: EnterCodeText,
} satisfies Meta<typeof EnterCodeText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmsWithPhoneNumberSuffix = { args: { isSms: true, phoneNumberSuffix: "321" } } satisfies Story;

export const SmsWithoutPhoneNumberSuffix = { args: { isSms: true } } satisfies Story;

export const NotSms = { args: { isSms: false } } satisfies Story;

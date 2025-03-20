import type { Meta, StoryObj } from "@storybook/react";

import LinkMemberModal from "./LinkMemberModal";

const meta: Meta<typeof LinkMemberModal> = {
  title: "Identity/Components/Link Member Modal",
  component: LinkMemberModal,
  tags: ["@racwa/identity"],
};

export default meta;

type Story = StoryObj<typeof LinkMemberModal>;

export const LinkMember: Story = {};

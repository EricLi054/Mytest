import type { Meta, StoryObj } from "@storybook/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import Signin from "./page";

const mockSession = {
  expires: (new Date().getTime() + 1000).toLocaleString(),
  user: {
    name: "Storybook User",
    email: "storybook@mySite.com",
  },
} as const satisfies Session;

const meta = {
  title: "Motoring/Pages/signIn",
  component: Signin,
  tags: ["@racwa/motoring"],
  decorators: [
    (Story) => (
      <SessionProvider session={mockSession}>
        <Story />
      </SessionProvider>
    ),
  ],
} satisfies Meta<typeof Signin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn = {
  name: "signIn",
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Story;

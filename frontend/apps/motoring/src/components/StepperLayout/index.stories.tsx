import type { Meta, StoryObj } from "@storybook/react";
import { EMPTY_URL } from "#constants";

import Component from ".";

const meta = {
  title: "motoring/Components/StepperLayout",
  component: Component,
  tags: ["@racwa/motoring"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/roadside-assistance/update-your-vehicle/your-vehicle",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StepperLayout = {
  args: {
    racHomepageUrl: EMPTY_URL,
    entitlementsUrl: EMPTY_URL,
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop1",
    },
  },
} satisfies Story;

// These storybook tests only work outside of the CI pipeline (non headless mode)
// TODO: Fix this

// export const ConfirmationPageMobileView = {
//   args: {
//     racHomepageUrl: EMPTY_URL,
//     entitlementsUrl: EMPTY_URL,
//   },
//   parameters: {
//     viewport: {
//       defaultViewport: "mobile1",
//     },
//     nextjs: {
//       appDirectory: true,
//       navigation: {
//         pathname: "/roadside-assistance/update-your-vehicle/confirmation",
//       },
//     },
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const backButton = canvas.queryByTestId("racwaMobileStepper__back");
//     await expect(backButton).not.toBeInTheDocument();
//   },
// } satisfies Story;

// export const NonConfirmationPageMobileView = {
//   args: {
//     racHomepageUrl: EMPTY_URL,
//     entitlementsUrl: EMPTY_URL,
//   },
//   parameters: {
//     viewport: {
//       defaultViewport: "mobile1",
//     },
//     nextjs: {
//       appDirectory: true,
//       navigation: {
//         pathname: "/roadside-assistance/update-your-vehicle/update-vehicle",
//       },
//     },
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const backButton = canvas.getByTestId("racwaMobileStepper__back");
//     await waitFor(() => expect(backButton).toBeVisible());
//   },
// } satisfies Story;

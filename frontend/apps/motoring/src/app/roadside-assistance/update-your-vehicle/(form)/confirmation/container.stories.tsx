import type { Meta, StoryObj } from "@storybook/react";
import { EMPTY_URL } from "#constants";
import { mockConfirmationContentfulData } from "#mocks/contentful";
import StorybookStepperLayout from "#storybook/StorybookerStepperLayout";

import { ConfirmationContainer } from "./container";

const meta = {
  title: "Motoring/Pages/roadside-assistance/update-your-vehicle/confirmation",
  component: ConfirmationContainer,
  tags: ["@racwa/motoring"],
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <StorybookStepperLayout
      pagePath={{ area: "roadside-assistance", flow: "/update-your-vehicle", page: "/confirmation" }}
    >
      <ConfirmationContainer {...args} />
    </StorybookStepperLayout>
  ),
} satisfies Meta<typeof ConfirmationContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation = {
  name: "confirmation",
  args: {
    firstName: "Anurag",
    vehicleType: "CAR",
    myRacUrl: EMPTY_URL,
    contentfulData: mockConfirmationContentfulData,
  },
} satisfies Story;

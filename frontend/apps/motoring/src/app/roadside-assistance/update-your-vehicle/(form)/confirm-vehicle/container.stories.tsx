import type { Meta, StoryObj } from "@storybook/react";
import { mockConfirmVehicleContentfulData } from "#mocks/mockContentful";
import StorybookStepperLayout from "#storybook/StorybookerStepperLayout";

import { ConfirmVehicleContainer } from "./container";

const meta = {
  title: "Motoring/Pages/roadside-assistance/update-your-vehicle/confirm-vehicle",
  component: ConfirmVehicleContainer,
  tags: ["@racwa/motoring"],
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <StorybookStepperLayout
      pagePath={{ area: "roadside-assistance", flow: "/update-your-vehicle", page: "/confirm-vehicle" }}
    >
      <ConfirmVehicleContainer {...args} />
    </StorybookStepperLayout>
  ),
} satisfies Meta<typeof ConfirmVehicleContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmVehicle = {
  name: "confirm-vehicle",
  args: {
    vehicleCardInfo: {
      title: "2022 HONDA",
      subtitle: "CIVIC SPORT SEDAN AUTO PETROL BLUE",
      vehicleType: "CAR",
      isOverweightOrOversize: false,
      registration: "1ABC123",
      colour: "BLUE",
    },
    confirmVehicleAction: () => Promise.resolve({} as never),
    contentfulData: mockConfirmVehicleContentfulData,
  },
} satisfies Story;

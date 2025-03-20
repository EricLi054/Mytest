import type { SubmissionResult } from "@conform-to/react";
import type { Meta, StoryObj } from "@storybook/react";
import { mockUpdateVehicleContentfulData } from "#mocks/mockContentful";
import StorybookStepperLayout from "#storybook/StorybookerStepperLayout";

import type { GetVehicleByRegoAction } from "./actions";
import UpdateVehicleForm from "./form";

const meta = {
  title: "Motoring/Pages/roadside-assistance/update-your-vehicle/update-vehicle",
  tags: ["@racwa/motoring"],
  parameters: { layout: "fullscreen" },
  component: UpdateVehicleForm,
  render: (args) => (
    <StorybookStepperLayout
      pagePath={{ area: "roadside-assistance", flow: "/update-your-vehicle", page: "/update-vehicle" }}
    >
      <UpdateVehicleForm {...args} />
    </StorybookStepperLayout>
  ),
} satisfies Meta<typeof UpdateVehicleForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UpdateVehicle = {
  name: "update-vehicle",
  args: {
    updateVehicleAction: () => Promise.resolve({} satisfies SubmissionResult<string[]>),
    getVehicleByRegoAction: () =>
      Promise.resolve({
        success: true,
        title: "2022 HONDA",
        subtitle: "CIVIC SPORT SEDAN AUTO PETROL BLUE",
        isOverweightOrOversize: true,
      }) satisfies ReturnType<GetVehicleByRegoAction>,
    contentfulData: mockUpdateVehicleContentfulData,
  },
} satisfies Story;

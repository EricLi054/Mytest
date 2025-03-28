import type { SubmissionResult } from "@conform-to/react";
import type { Meta, StoryObj } from "@storybook/react";
import { EMPTY_URL } from "#constants";
import { mockYourVehicleContentfulData } from "#mocks/contentful";
import StorybookStepperLayout from "#storybook/StorybookerStepperLayout";

import YourVehicleForm from "./form";

const meta = {
  title: "Motoring/Pages/roadside-assistance/update-your-vehicle/your-vehicle",
  tags: ["@racwa/motoring"],
  parameters: { layout: "fullscreen" },
  component: YourVehicleForm,
  render: (args) => (
    <StorybookStepperLayout
      pagePath={{ area: "roadside-assistance", flow: "/update-your-vehicle", page: "/your-vehicle" }}
    >
      <YourVehicleForm {...args} />
    </StorybookStepperLayout>
  ),
} satisfies Meta<typeof YourVehicleForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YourVehicle = {
  name: "your-vehicle",
  args: {
    defaultValues: undefined,
    yourVehicleAction: (_, formData: FormData) => {
      console.log({ formData: [...formData.values()] });
      return Promise.resolve({} satisfies SubmissionResult<string[]>);
    },
    myRacUrl: EMPTY_URL,
    contentfulData: mockYourVehicleContentfulData,
  },
} satisfies Story;

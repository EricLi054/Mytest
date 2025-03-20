import type { Meta, StoryObj } from "@storybook/react";

import { ErrorPage } from ".";
import { StyledLink } from "../../styled/StyledLink";

const meta = {
  title: "ui/Components/ErrorPage",
  tags: ["@racwa/ui"],
  component: ErrorPage,
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/gKYmIzj0ayeuxkrtmPx35u/RACI-Sunrise?node-id=8-7670&m=dev",
    },
  },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  name: "Error Page",
  args: {
    heading: "Custom Heading",
    children: (
      <>
        <ErrorPage.Subheading>Custom subheading</ErrorPage.Subheading>
        <ErrorPage.Subtext>Custom subtext for your specific error scenario</ErrorPage.Subtext>
        <ErrorPage.Subtext>These are passed in as children, so you can have as much as you like.</ErrorPage.Subtext>
        <ErrorPage.Subtext>
          Sometimes you need a link in here... <StyledLink>13 17 03</StyledLink>.
        </ErrorPage.Subtext>
        <ErrorPage.Button>Back to Storybook</ErrorPage.Button>
      </>
    ),
  },
} satisfies Story;

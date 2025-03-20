import type { Meta, StoryObj } from "@storybook/react";

import { CldImage } from ".";

const meta = {
  title: "ui/Components/CloudinaryImage",
  tags: ["@racwa/ui"],
  component: CldImage,
} satisfies Meta<typeof CldImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CloudinaryImage = {
  args: {
    src: "https://res.rac.com.au/rac-horizons/image/upload/v1740035397/rac_logo_jvczlw.png",
    alt: "RAC Logo",
    title: "RAC Logo",
    width: 51,
    height: 44,
  },
} satisfies Story;

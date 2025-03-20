import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";
import { TestCategory, TestYouTubeVideo } from "../../../../testing/data/testData";

const meta = {
  title: "common/Horizons/Components/VideoCarouselCard",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VideoCarouselCard = {
  args: {
    video: TestYouTubeVideo,
    category: TestCategory,
  },
} satisfies Story;

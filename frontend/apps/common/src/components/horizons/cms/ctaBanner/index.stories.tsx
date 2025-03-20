import type { Meta, StoryObj } from "@storybook/react";

import Component from "./ctaBannerRendering";

const meta = {
  title: "common/Horizons/Components/CTABanner",
  component: Component,
  tags: ["@racwa/common"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CTABanner = {
  args: {
    ctaBanner: {
      title: "Horizons CTA Banner",
      image: {
        title: "Horizons CTA Banner",
        image: [
          {
            secure_url:
              "https://res.rac.com.au/rac-horizons/image/upload/v1740020666/Banner%20media/hybrids-explained-b_ddmmtb.jpg",
            url: "",
            tags: [],
            type: "",
            bytes: 0,
            width: 0,
            format: "",
            height: 0,
            context: {
              custom: {
                alt: "",
                caption: "",
              },
            },
            version: 0,
            duration: 0,
            metadata: {},
            public_id: "",
            created_at: "",
            original_url: "",
            resource_type: "",
          },
        ],
        image_data: [
          {
            context: {
              custom: {
                alt: "Horizons CTA Banner",
                caption: "Horizons CTA Banner",
              },
            },
          },
        ],
        showCaption: true,
        link: "",
        openLinkInNewTab: false,
        fillContainerWidth: true,
      },
      contentPosition: "Left",
      category: {
        name: "Drive",
        slug: "drive",
        colour: "Red",
      },
      heading: "Welcome to Horizons",
      subtext: "Horizons is your digital subscription",
      buttonText: "Read more",
      buttonUrl: "https://rac.com.au",
    },
  },
} satisfies Story;

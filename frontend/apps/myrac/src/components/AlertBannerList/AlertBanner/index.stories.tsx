import type { Meta } from "@storybook/react";
import { BLOCKS } from "@contentful/rich-text-types";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { EnvironmentVariableProvider } from "#providers/environmentVariables";

import AlertBanner from ".";

library.add(faExclamationTriangle);

export default {
  title: "MyRAC/Components/Client Components/Alert Banner",
  component: AlertBanner,
  tags: ["@racwa/myrac"],
  decorators: [
    (Story) => (
      <EnvironmentVariableProvider
        variables={{ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "", ONLINE_SHOP_URL: "", B2C_URL: "" }}
      >
        <Story />
      </EnvironmentVariableProvider>
    ),
  ],
} satisfies Meta<typeof AlertBanner>;

export const SingleBanner = () => {
  return (
    <AlertBanner
      bannerAlert={{
        title: "Example Banner",
        icon: "exclamation-triangle",
        bodyText: {
          json: {
            nodeType: BLOCKS.DOCUMENT,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                data: {},
                content: [
                  {
                    nodeType: "text",
                    value: "This is an alert banner",
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
        },
      }}
    />
  );
};

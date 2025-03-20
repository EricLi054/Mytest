import type { Meta } from "@storybook/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

import MessageBanner from "./MessageBanner";

library.add(faPhone);

const meta: Meta<typeof MessageBanner> = {
  title: "MyRAC/Components/Server Components/OTPBypassBanner",
  component: MessageBanner,
  tags: ["@racwa/myrac"],
  decorators: [(Story) => <Story />],
};
export default meta;

export const Standard = () => {
  return <MessageBanner text="This is a message Banner" />;
};

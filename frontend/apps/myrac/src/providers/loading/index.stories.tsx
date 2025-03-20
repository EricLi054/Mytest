import type { Meta } from "@storybook/react";
import { Button } from "@mui/material";
import { screen, userEvent } from "@storybook/test";

import { LoadingProvider } from ".";
import { useLoadingContext } from "./context";
import { LoadingScreen } from "./LoadingScreen";

const meta: Meta<typeof LoadingScreen> = {
  title: "MyRAC/Components/Client Components/Loading",
  component: LoadingScreen,
  tags: ["@racwa/myrac"],
  decorators: [
    (Story) => (
      <LoadingProvider>
        <Story />
      </LoadingProvider>
    ),
  ],
};
export default meta;

export const Standard = () => {
  const { openLoadingIndicator } = useLoadingContext();

  const onClick = () => {
    openLoadingIndicator();
  };

  return (
    <Button color="primary" onClick={onClick}>
      Open loading
    </Button>
  );
};

Standard.play = async () => {
  const button = await screen.findByRole("button");
  await userEvent.click(button);
};

export const WithMessage = () => {
  const { openLoadingIndicator } = useLoadingContext();

  const onClick = () => {
    openLoadingIndicator("Loading message");
  };

  return (
    <Button color="primary" onClick={onClick}>
      Open loading
    </Button>
  );
};

WithMessage.play = async () => {
  const button = await screen.findByRole("button");
  await userEvent.click(button);
};

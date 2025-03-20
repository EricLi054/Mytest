import type { Meta } from "@storybook/react";
import type { Session } from "next-auth";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import { expect, screen, userEvent, waitFor } from "@storybook/test";
import { SessionProvider } from "next-auth/react";

import { ModalProvider } from ".";
import { RefreshModalContent } from "../sessionTimeout";
import { useModalContext } from "./context";
import { GlobalModal } from "./GlobalModal";

const tenMinutesInms = 600000;
const mockSession: Session = {
  user: { name: "Test User" },
  expires: (Date.now() + tenMinutesInms).toString(),
};

const meta: Meta<typeof GlobalModal> = {
  title: "MyRAC/Components/Client Components/Modal",
  component: GlobalModal,
  tags: ["@racwa/myrac"],
  parameters: {
    chromatic: { ignoreSelectors: ["h4"] },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", width: "100%" }}>
        <SessionProvider session={mockSession}>
          <ModalProvider>
            <Story />
          </ModalProvider>
        </SessionProvider>
      </div>
    ),
  ],
};
export default meta;

export const Standard = () => {
  const { openModal, closeModal } = useModalContext();

  const onClick = () => {
    openModal(
      "Example",
      <Grid>
        <Typography>Modal Content</Typography>
        <Button color="primary" onClick={closeModal}>
          Close
        </Button>
      </Grid>,
      closeModal,
    );
  };

  return (
    <Button color="primary" onClick={onClick}>
      Open modal
    </Button>
  );
};

Standard.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole("button");
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(screen.getByText("Example")).toBeInTheDocument();
  });
};

export const NoCloseButton = () => {
  const { openModal, closeModal } = useModalContext();

  const onClick = () => {
    openModal(
      "Example",
      <Grid>
        <Typography>Modal Content</Typography>
        <Button color="primary" onClick={closeModal}>
          Close
        </Button>
      </Grid>,
    );
  };

  return (
    <Button color="primary" onClick={onClick}>
      Open modal
    </Button>
  );
};

NoCloseButton.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole("button");
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(screen.getByText("Example")).toBeInTheDocument();
  });
};

export const SessionTimeout = () => {
  const { openModal, closeModal } = useModalContext();

  const onClick = () => {
    openModal(
      "Oh no! Your page will time out soon",
      <RefreshModalContent
        onExpiry={() => {
          closeModal();
        }}
        expiryTime={Date.now() + 2 * 60000}
      />,
      closeModal,
    );
  };

  return (
    <Button color="primary" onClick={onClick}>
      Open modal
    </Button>
  );
};
SessionTimeout.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole("button");
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(screen.getByText("Oh no! Your page will time out soon")).toBeInTheDocument();
  });
};

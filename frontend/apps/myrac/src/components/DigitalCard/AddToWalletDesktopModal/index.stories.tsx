import type { Meta } from "@storybook/react";
import { Button } from "@mui/material";
import { expect, screen, userEvent, waitFor } from "@storybook/test";
import { ModalProvider } from "#providers/modal";
import { useModalContext } from "#providers/modal/context";

import AddToWalletDesktopModal from "./";

export default {
  title: "MyRAC/Components/Digital Card/Add to Wallet Desktop Modal",
  component: AddToWalletDesktopModal,
  tags: ["@racwa/myrac"],
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", width: "100%" }}>
        <ModalProvider>
          <Story />
        </ModalProvider>
      </div>
    ),
  ],
} as Meta<typeof AddToWalletDesktopModal>;

export const Default = () => {
  const { openModal, closeModal } = useModalContext();

  const openMobileModal = () =>
    openModal("Get your digital card now", <AddToWalletDesktopModal digitalCardUrl="https://rac.com.au" />, closeModal);

  return (
    <ModalProvider>
      <Button color="primary" onClick={openMobileModal}>
        Open Modal
      </Button>
    </ModalProvider>
  );
};

Default.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole("button");
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(screen.getByText("Get your digital card now")).toBeInTheDocument();
  });
};

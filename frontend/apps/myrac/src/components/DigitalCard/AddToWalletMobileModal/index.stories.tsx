import type { Meta } from "@storybook/react";
import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { Button } from "@mui/material";
import { expect, screen, userEvent, waitFor } from "@storybook/test";
import { ModalProvider } from "#providers/modal";
import { useModalContext } from "#providers/modal/context";

import AddToWalletMobileModal from "./";

export default {
  title: "MyRAC/Components/Digital Card/Add to Wallet Mobile Modal",
  component: AddToWalletMobileModal,
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
} as Meta<typeof AddToWalletMobileModal>;

const person: z.infer<typeof PersonSchema> = {
  cardColour: "Blue",
  membershipCardNumber: "1234567890123456",
  title: "Mr",
  firstName: "John",
  surname: "Doe",
  tier: "Gold Life",
  racId: "12345678",
  membershipType: "Gold",
};

export const Default = () => {
  const { openModal, closeModal } = useModalContext();
  const openMobileModal = () =>
    openModal("", <AddToWalletMobileModal person={person} addToWalletUrl="https://rac.com.au" />, closeModal, true);

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
    await expect(screen.getByText("Your digital card")).toBeInTheDocument();
  });
};

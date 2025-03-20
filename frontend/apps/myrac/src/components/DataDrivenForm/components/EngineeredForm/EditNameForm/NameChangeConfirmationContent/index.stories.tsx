import type { Meta } from "@storybook/react";
import { Button } from "@mui/material";
import { expect, screen, userEvent, waitFor } from "@storybook/test";
import { ModalProvider } from "#providers/modal";
import { useModalContext } from "#providers/modal/context";

import NameChangeConfirmationContent from ".";

const meta: Meta<typeof NameChangeConfirmationContent> = {
  title: "MyRAC/Components/Data Driven Forms/Name Change Confirmation",
  component: NameChangeConfirmationContent,
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
};
export default meta;

export const Default = () => {
  const { openModal, closeModal } = useModalContext();
  return (
    <Button
      color="primary"
      onClick={() => {
        openModal(
          "Your first name is important",
          <NameChangeConfirmationContent
            onConfirm={async () => {
              await Promise.resolve(() => closeModal());
            }}
            onCancel={closeModal}
            logNameChangeEvent={async (event: string) => {
              await Promise.resolve(() => console.log(event));
            }}
          />,
          closeModal,
        );
      }}
    >
      Open modal
    </Button>
  );
};

Default.play = async () => {
  const button: HTMLButtonElement = await screen.findByRole("button");
  await userEvent.click(button);
  await waitFor(async () => {
    await expect(screen.getByText("Your first name is important")).toBeInTheDocument();
  });
};

import { Button } from "@mui/material";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import { ModalProvider } from ".";
import { useModalContext } from "./context";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

const TestButton = () => {
  const { openModal, closeModal } = useModalContext();

  return (
    <Button
      onClick={() => {
        openModal("Test Modal Title", <div>Test Modal Body</div>, closeModal);
      }}
    >
      Open
    </Button>
  );
};

describe("Global Modal", () => {
  it("should throw an error if used outside of ModalProvider", () => {
    expect(() => render(<TestButton />)).toThrow("useModalContext must be used within a ModalProvider");
  });

  it("should render in a closed state", () => {
    render(
      <ModalProvider>
        <TestButton />
      </ModalProvider>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should open a modal with specific content", async () => {
    render(
      <ModalProvider>
        <TestButton />
      </ModalProvider>,
    );
    await testHelper.clickButton("Open", screen);

    expect(screen.getByRole("dialog", { name: "Test Modal Title" })).toBeInTheDocument();
  });

  it("should open and close a modal", async () => {
    render(
      <ModalProvider>
        <TestButton />
      </ModalProvider>,
    );
    const openButton = screen.getByRole("button", { name: "Open" });
    await userEvent.click(openButton);

    expect(screen.getByRole("dialog", { name: "Test Modal Title" })).toBeInTheDocument();

    await testHelper.clickButton("close", screen);
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Test Modal Title" })).not.toBeInTheDocument();
    });
  });
});

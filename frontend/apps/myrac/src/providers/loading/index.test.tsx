import { Button } from "@mui/material";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LoadingProvider } from ".";
import { useLoadingContext } from "./context";

const TestButton = () => {
  const { openLoadingIndicator, closeLoadingIndicator } = useLoadingContext();
  return (
    <Button
      onClick={() => {
        openLoadingIndicator();
        setTimeout(() => {
          closeLoadingIndicator();
        }, 1000);
      }}
    >
      Open
    </Button>
  );
};

describe("Loading Screen", () => {
  it("should throw an error if used outside of ModalProvider", () => {
    expect(() => render(<TestButton />)).toThrow("useLoadingContext must be used within a LoadingProvider");
  });

  it("should render in a closed state", () => {
    render(
      <LoadingProvider>
        <TestButton />
      </LoadingProvider>,
    );

    expect(screen.queryByTestId("loading-modal")).not.toBeVisible();
  });

  it("should open and close the loading screen", async () => {
    render(
      <LoadingProvider>
        <TestButton />
      </LoadingProvider>,
    );

    const openButton = screen.getByRole("button", { name: "Open" });

    const user = userEvent.setup({ delay: null });
    await user.click(openButton);

    expect(screen.getByTestId("loading-modal")).toBeVisible();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-modal")).not.toBeVisible();
    });
  });
});

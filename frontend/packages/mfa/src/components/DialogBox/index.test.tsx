import { Button, Grid2, Typography } from "@mui/material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { DialogBoxProps } from ".";
import { DialogBox } from ".";

const mockSetShowDialog = vi.fn();

const defaultTitle = "Title";
const defaultContent = "Content...";
const defaultFooter = "Footer";
const defaultProps: DialogBoxProps = {
  id: "test",
  showDialog: true,
  setShowDialog: (show: boolean) => {
    mockSetShowDialog(show);
  },
  title: defaultTitle,
  content: defaultContent,
  footer: <Typography>{defaultFooter}</Typography>,
  onClose: vi.fn(),
  onClickClose: vi.fn(),
};

const getCloseIconButton = () => screen.getByLabelText("close");

describe("DialogBox", () => {
  it("should render", () => {
    render(<DialogBox {...defaultProps} buttons={undefined} />);

    expect(screen.getByText(defaultTitle)).toBeVisible();
    expect(screen.getByText(defaultContent)).toBeVisible();
    expect(screen.getByText(defaultFooter)).toBeVisible();
    expect(getCloseIconButton()).toBeVisible();
    // Dialog close icon button will be first button in array
    expect(screen.queryAllByRole("button").length).toBe(1);
  });

  it("should render with buttons when defined", () => {
    const firstButtonTitle = "First Button";
    const secondButtonTitle = "Second Button";
    render(
      <DialogBox
        {...defaultProps}
        buttons={[
          <Button key={firstButtonTitle} title={firstButtonTitle} />,
          <Button key={secondButtonTitle} title={secondButtonTitle} />,
        ]}
      />,
    );

    const buttons = screen.queryAllByRole("button");

    // Dialog close icon button will be first button in array
    expect(buttons.length).toBe(3);
    expect(buttons[1]).toHaveProperty("title", firstButtonTitle);
    expect(buttons[2]).toHaveProperty("title", secondButtonTitle);
  });

  it("should render with custom content", () => {
    const customContent = "This is the custom content";
    render(
      <DialogBox
        {...defaultProps}
        content={
          <Grid2>
            <Typography>{customContent}</Typography>
            <Button />
          </Grid2>
        }
      />,
    );

    expect(screen.getByText(customContent)).toBeVisible();
  });

  it("should close dialog when close ico is clicked", async () => {
    const user = userEvent.setup();
    render(<DialogBox {...defaultProps} />);

    await user.click(getCloseIconButton());

    expect(mockSetShowDialog).toHaveBeenCalledWith(false);
    expect(defaultProps.onClickClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(0);
  });

  it("should close dialog when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<DialogBox {...defaultProps} />);

    await user.keyboard("{Escape}");

    expect(mockSetShowDialog).toHaveBeenCalledWith(false);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClickClose).toHaveBeenCalledTimes(0);
  });

  it("should not close dialog when backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(<DialogBox {...defaultProps} />);

    // Backdrop is the second presentation in the array
    const backdrop = screen.getAllByRole("presentation")[1];
    if (backdrop) {
      await user.click(backdrop);
    }

    expect(mockSetShowDialog).toHaveBeenCalledTimes(0);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(0);
    expect(defaultProps.onClickClose).toHaveBeenCalledTimes(0);
  });
});

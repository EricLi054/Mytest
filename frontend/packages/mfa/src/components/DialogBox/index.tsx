"use client";

import { Grid2, Typography } from "@mui/material";
import { createId } from "#utils/internal/index";

import type { DetailedDialogProps } from "@racwa/react-components";
import { RacwaDetailedDialog } from "@racwa/react-components";

/**
 * Dialog close event reason when backdrop is clicked/touched.
 * Dialog will be prevented from closing when the backdrop is clicked.
 * User must click the close icon or press the ESC key to close the dialog
 * to avoid an accidental backdrop click/touch causing the dialog to close.
 */
const backdropClickCloseReason = "backdropClick";

export type DialogBoxProps = {
  id: string;
  showDialog: boolean;
  setShowDialog: (open: boolean) => void;
  title: string;
  content: React.ReactNode;
  buttons?: React.ReactNode;
  footer: React.ReactNode;
  /** Fired when user presses the ESC key. */
  onClose?: () => void;
  /** Fired when user clicks the close button at the top of the dialog. */
  onClickClose?: () => void;
} & Omit<DetailedDialogProps, "open" | "title" | "titleId" | "onClick" | "onClickClose" | "content">;

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const DialogBox = ({
  id,
  title,
  content,
  buttons,
  showDialog,
  setShowDialog,
  onClose,
  onClickClose,
  footer,
  ...props
}: DialogBoxProps) => {
  return (
    <RacwaDetailedDialog
      id={id}
      title={title}
      titleId={createId(id, "title")}
      open={showDialog}
      onClose={(_, reason) => {
        if (reason === backdropClickCloseReason) {
          return;
        }
        setShowDialog(false);
        onClose?.();
      }}
      onClickClose={() => {
        setShowDialog(false);
        onClickClose?.();
      }}
      sx={{ h2: { fontSize: 32 } }}
      {...props}
    >
      <Grid2 container spacing={4}>
        <Grid2 id={createId(id, "content-container")} size={{ xs: 12 }}>
          {typeof content === "string" ? <Typography>{content}</Typography> : content}
        </Grid2>
        {buttons && (
          <Grid2 id={createId(id, "buttons-container")} size={{ xs: 12 }}>
            {buttons}
          </Grid2>
        )}
      </Grid2>
      {footer}
    </RacwaDetailedDialog>
  );
};

export default DialogBox;

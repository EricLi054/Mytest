"use client";

import type { ButtonProps } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { OTP_VERIFY_FORM_ID } from "#composites/OneTimePassword/constants";
import { createId } from "#utils/internal/index";

import type { RacwaNotifyButtonProps } from "@racwa/react-components";
import { RacwaNotifyButton } from "@racwa/react-components";

const verifyButtonId = "verify-button";

export type DialogButtonProps = Pick<RacwaNotifyButtonProps, "activeState">;

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const DialogButtons = ({ activeState }: DialogButtonProps) => {
  const defaultButtonProps = {
    id: verifyButtonId,
    form: OTP_VERIFY_FORM_ID,
    fullWidth: true,
  };
  const buttonStates: ButtonProps[] = [
    {
      ...defaultButtonProps,
      children: "Verify",
      color: "primary",
      type: "submit",
      key: "button-state-verify-enabled",
    },
    {
      ...defaultButtonProps,
      children: "Verifying",
      color: "secondary",
      disabled: true,
      key: "button-state-verifying",
    },
    {
      ...defaultButtonProps,
      children: "Verified",
      color: "secondary",
      startIcon: <DoneIcon id={createId(verifyButtonId, "done-icon")} fontSize="large" color="inherit" />,
      key: "button-state-verified",
    },
    {
      ...defaultButtonProps,
      children: "Verify",
      color: "primary",
      type: "submit",
      disabled: true,
      key: "button-state-verify-disabled",
    },
  ];
  return (
    <RacwaNotifyButton
      activeState={activeState}
      buttonStates={buttonStates as React.ComponentProps<typeof RacwaNotifyButton>["buttonStates"]}
    />
  );
};

export default DialogButtons;

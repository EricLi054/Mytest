import type { NotAuthenticatedStateFlowValue, VerifyOptionsValue } from "#composites/OneTimePassword/types/internal";
import { Button } from "@mui/material";
import { NotAuthenticatedStateFlow } from "#composites/OneTimePassword/types/internal";
import { fireMfaOtpEvent } from "#composites/OneTimePassword/utils/index";
import { createId } from "#utils/internal/index";

import { SEND_OTP_DIALOG_ID } from "../../constants";

export type DialogButtonProps = {
  isSubmitting: boolean;
  memberStatus: VerifyOptionsValue;
  selectionStatus: NotAuthenticatedStateFlowValue;
  onClickReceiveCall: () => void;
  onClickSendSms: () => void;
};

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const DialogButton = ({
  isSubmitting,
  memberStatus,
  selectionStatus,
  onClickReceiveCall,
  onClickSendSms,
}: DialogButtonProps) => {
  const isSms = selectionStatus === NotAuthenticatedStateFlow.SMSVerificationOption;
  const buttonText = isSms ? "Send code" : "Request a call";
  const onClick = isSms ? onClickSendSms : onClickReceiveCall;
  return (
    <Button
      id={createId(SEND_OTP_DIALOG_ID, "request-code-button")}
      color="primary"
      fullWidth
      onClick={() => {
        fireMfaOtpEvent({
          description: buttonText,
          selectionStatus: selectionStatus,
          memberStatus: memberStatus,
        });
        onClick();
      }}
      disabled={isSubmitting}
      sx={{ mb: 3 }}
    >
      {buttonText}
    </Button>
  );
};

export default DialogButton;

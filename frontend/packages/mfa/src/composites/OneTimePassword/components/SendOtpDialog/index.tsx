"use client";

import { useEffect, useMemo } from "react";
import { Grid2 } from "@mui/material";
import DialogBox from "#components/DialogBox/index";
import { NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";

import { useOtpFlowState } from "../../contexts/OtpFlowState";
import { fireMfaOtpEvent, getContactMethod, getMaskedMobilePhoneNumber } from "../../utils";
import DialogFooter from "../DialogFooter";
import GetCodeViaPhoneCallLink from "../GetCodeViaPhoneCallLink";
import SendCodeViaSmsLink from "../SendCodeViaSmsLink";
import DialogButton from "./components/DialogButton";
import { SEND_OTP_DIALOG_ID } from "./constants";

export type SendOtpDialogProps = {
  /** Last 3 digits of phone number OTP code is sent to */
  phoneNumberSuffix: string;
  faqUrl: string;
  /** The 'need help' RAC phone number in display format */
  helpDisplayPhoneNumber: string;
  isSubmitting: boolean;
  onClickReceiveCall: () => void;
  onClickSendSms: () => void;
  onClickClose: () => void;
};

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const SendOtpDialog = ({
  phoneNumberSuffix,
  helpDisplayPhoneNumber,
  faqUrl,
  isSubmitting,
  onClickReceiveCall,
  onClickSendSms,
  onClickClose,
}: SendOtpDialogProps) => {
  const { flowState } = useOtpFlowState();

  const isSms = flowState.selectionStatus === NotAuthenticatedStateFlow.SMSVerificationOption;
  const isPhoneCall = flowState.selectionStatus === NotAuthenticatedStateFlow.PhoneCallVerificationOption;
  const showDialog =
    !flowState.isAuthenticated &&
    phoneNumberSuffix !== "" &&
    flowState.memberStatus !== VerifyOptions.None &&
    (isPhoneCall || isSms);

  const contactMethod = getContactMethod({ isSms, memberStatus: flowState.memberStatus });

  useEffect(() => {
    if (showDialog) {
      fireMfaOtpEvent({ description: `${contactMethod} - Lets verify its you` });
    }
  }, [showDialog, contactMethod]);

  const smsOption = useMemo(() => {
    const displaySmsOption = flowState.memberStatus === VerifyOptions.HasMobile && isPhoneCall;
    return displaySmsOption ? (
      <Grid2 size={{ xs: 12 }}>
        <SendCodeViaSmsLink idPrefix={SEND_OTP_DIALOG_ID} />
      </Grid2>
    ) : undefined;
  }, [isPhoneCall, flowState.memberStatus]);

  const phoneCallOption = useMemo(() => {
    const displayPhoneCallOption =
      isSms &&
      (flowState.memberStatus === VerifyOptions.HasMobile || flowState.memberStatus === VerifyOptions.HasLandline);
    return displayPhoneCallOption ? (
      <Grid2 size={{ xs: 12 }}>
        <GetCodeViaPhoneCallLink idPrefix={SEND_OTP_DIALOG_ID} />
      </Grid2>
    ) : undefined;
  }, [isSms, flowState.memberStatus]);

  const dialogContent =
    isSms && flowState.memberStatus === VerifyOptions.HasMobile
      ? `We'll send a verification code to ${getMaskedMobilePhoneNumber(phoneNumberSuffix)}.`
      : `We'll phone you on **** *${phoneNumberSuffix} with a verification code.`;

  const button = (
    <DialogButton
      isSubmitting={isSubmitting}
      memberStatus={flowState.memberStatus}
      selectionStatus={flowState.selectionStatus}
      onClickReceiveCall={onClickReceiveCall}
      onClickSendSms={onClickSendSms}
    />
  );

  const footer = (
    <DialogFooter
      dialogId={SEND_OTP_DIALOG_ID}
      faqUrl={faqUrl}
      helpDisplayPhoneNumber={helpDisplayPhoneNumber}
      memberStatus={flowState.memberStatus}
      selectionStatus={flowState.selectionStatus}
      header={smsOption ?? phoneCallOption}
    />
  );

  const handleClose = () => {
    fireMfaOtpEvent({
      description: "Dialog closed by the user",
      selectionStatus: flowState.selectionStatus,
      memberStatus: flowState.memberStatus,
    });
    onClickClose();
  };

  return (
    <DialogBox
      id={SEND_OTP_DIALOG_ID}
      showDialog={showDialog}
      setShowDialog={() => showDialog}
      onClose={handleClose}
      onClickClose={handleClose}
      title="Let's verify it's you"
      content={dialogContent}
      buttons={button}
      footer={footer}
    />
  );
};

export default SendOtpDialog;

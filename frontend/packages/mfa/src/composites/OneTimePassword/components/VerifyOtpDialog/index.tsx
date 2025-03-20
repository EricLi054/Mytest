"use client";

import type {
  OneTimePasswordErrorStateValue,
  OneTimePasswordFormProps,
} from "#composites/OneTimePassword/types/internal";
import { useEffect, useMemo } from "react";
import { FormProvider, getFormProps, getInputProps, useInputControl } from "@conform-to/react";
import { Box, Grid2 } from "@mui/material";
import DialogBox from "#components/DialogBox/index";
import { OTP_INPUT_LENGTH, OTP_INPUT_NAME } from "#composites/OneTimePassword/constants";
import { NotAuthenticatedStateFlow, OneTimePasswordErrorState } from "#composites/OneTimePassword/types/internal";
import { createId } from "#utils/internal/index";

import { RacwaOtpInput } from "@racwa/react-components";

import { useOtpFlowState } from "../../contexts/OtpFlowState";
import { fireMfaOtpEvent, getContactMethod } from "../../utils";
import DialogFooter from "../DialogFooter";
import DialogButtons from "./components/DialogButtons";
import EnterCodeText from "./components/EnterCodeText";
import FooterHeader from "./components/FooterHeader";
import { VERIFY_OTP_DIALOG_ID } from "./constants";
import { VerifyButtonState } from "./types";

const getErrorMessageToDisplay = ({
  fieldErrors,
  oneTimePasswordError,
}: {
  fieldErrors: string[] | undefined;
  oneTimePasswordError: OneTimePasswordErrorStateValue;
}) => {
  if (fieldErrors) {
    return fieldErrors.join(" ");
  } else if (oneTimePasswordError === OneTimePasswordErrorState.WrongCode) {
    return "Sorry, that code doesn't match. Please try again or request a new code.";
  } else if (oneTimePasswordError === OneTimePasswordErrorState.CodeExpired) {
    return "Sorry, that code has expired. Please request a new code.";
  }
  return undefined;
};

const getVerifyButtonActiveState = (
  oneTimePasswordError: OneTimePasswordErrorStateValue,
  isSubmitting: boolean,
  justVerified: boolean,
) => {
  if (oneTimePasswordError === OneTimePasswordErrorState.CodeExpired) {
    return VerifyButtonState.Disabled;
  } else if (isSubmitting) {
    return VerifyButtonState.Verifying;
  } else if (justVerified) {
    return VerifyButtonState.Verified;
  }
  return VerifyButtonState.ToVerify;
};

export type VerifyOtpDialogProps = OneTimePasswordFormProps & {
  /** Last 3 digits of phone number OTP code is sent to */
  phoneNumberSuffix: string;
  /** The 'need help' RAC phone number in display format */
  helpDisplayPhoneNumber: string;
  faqUrl: string;
  isSubmitting: boolean;
  justVerified: boolean;
  oneTimePasswordError: OneTimePasswordErrorStateValue;
  /**
   * TODO - DED-1295 - Does the otp input need to also be cleared when onClickClose is triggered?
   * If the errors and form value are not cleared when closing the dialog then might need to call clearOtpInput as well.
   */
  onClickClose: () => void;
};

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const VerifyOtpDialog = ({
  form,
  fields,
  phoneNumberSuffix,
  helpDisplayPhoneNumber,
  faqUrl,
  isSubmitting,
  justVerified,
  oneTimePasswordError,
  onClickClose,
  onSubmitVerifyOtp,
}: VerifyOtpDialogProps) => {
  const { flowState } = useOtpFlowState();
  // TODO - DED-1295 - Should the input control be passed in as a prop with the form/fields?
  const otpCodeInputControl = useInputControl(fields.verificationCode);
  const { onSubmit, ...formProps } = getFormProps(form);

  const isSms = flowState.selectionStatus === NotAuthenticatedStateFlow.ReadyToVerifyWithSMS;
  const isCall = flowState.selectionStatus === NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall;
  const showDialog = !flowState.isAuthenticated && (isSms || isCall);

  const contactMethod = getContactMethod({ isSms, memberStatus: flowState.memberStatus });

  useEffect(() => {
    if (showDialog) {
      fireMfaOtpEvent({ description: `${contactMethod} - Enter verification code` });
    }
  }, [showDialog, contactMethod]);

  const verifyButtonActiveState = useMemo(() => {
    return getVerifyButtonActiveState(oneTimePasswordError, isSubmitting, justVerified);
  }, [oneTimePasswordError, isSubmitting, justVerified]);

  /**
   * TODO - DED-1295 - Does action need to be set on the form at all if onSubmit is being used?
   *
   * TODO - DED-1295 - Console warning on dialog open in mfa composite `useInputControl is unable to find form#verify-otp-form and identify if a dummy input is required`.
   * - https://github.com/edmundhung/conform/blob/53990de760c95aae7feae3b4fc8f5c197c9fb58e/packages/conform-react/integrations.ts#L354
   */
  const content = (
    <FormProvider context={form.context}>
      <form
        {...formProps}
        onSubmit={async (event) => {
          // TODO - DED-1295 - Need to prevent default on the events to stop unwanted navigation, otherwise it will nav to iframe with query param of entered verificationCode in storybook
          event.preventDefault();
          // TODO - DED-1295 - Need to prevent default on the nativeEvent as well?
          onSubmit(event);
          if (form.valid === true && fields.verificationCode.value?.length === OTP_INPUT_LENGTH) {
            await onSubmitVerifyOtp({ verificationCode: fields.verificationCode.value });
          }
        }}
      >
        <Grid2 container direction="column">
          <Grid2 size={{ xs: 12 }}>
            <EnterCodeText isSms={isSms} phoneNumberSuffix={phoneNumberSuffix} />
          </Grid2>
          <Grid2 size={{ xs: 12 }} sx={{ mt: 0 }}>
            <RacwaOtpInput
              {...getInputProps(fields.verificationCode, { type: "text" })}
              id={createId(OTP_INPUT_NAME, "input")}
              length={OTP_INPUT_LENGTH}
              value={otpCodeInputControl.value}
              onChange={(value) => {
                if (!otpCodeInputControl.value) {
                  fireMfaOtpEvent({
                    description: "Please enter the code to verify its you",
                    selectionStatus: flowState.selectionStatus,
                    memberStatus: flowState.memberStatus,
                  });
                }
                otpCodeInputControl.change(value);
              }}
              error={getErrorMessageToDisplay({ fieldErrors: fields.verificationCode.errors, oneTimePasswordError })}
              disabled={isSubmitting || justVerified || oneTimePasswordError === OneTimePasswordErrorState.CodeExpired}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }} sx={{ pt: 1, mt: 3 }}>
            <DialogButtons activeState={verifyButtonActiveState} />
          </Grid2>
        </Grid2>
      </form>
    </FormProvider>
  );

  const footerHeader = useMemo(() => {
    return flowState.hasSendAttemptsRemaining ? (
      <FooterHeader clearOtpInput={() => otpCodeInputControl.change(undefined)} />
    ) : undefined;
  }, [flowState.hasSendAttemptsRemaining, otpCodeInputControl]);

  const footer = (
    <Box mt={3}>
      <DialogFooter
        dialogId={VERIFY_OTP_DIALOG_ID}
        faqUrl={faqUrl}
        helpDisplayPhoneNumber={helpDisplayPhoneNumber}
        memberStatus={flowState.memberStatus}
        selectionStatus={flowState.selectionStatus}
        header={footerHeader}
      />
    </Box>
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
      id={VERIFY_OTP_DIALOG_ID}
      showDialog={showDialog}
      setShowDialog={() => showDialog}
      onClose={handleClose}
      onClickClose={handleClose}
      title="Enter verification code"
      content={content}
      footer={footer}
    />
  );
};

export default VerifyOtpDialog;

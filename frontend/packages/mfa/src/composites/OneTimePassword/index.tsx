"use client";

import type { ComponentProps } from "react";
import React, { Suspense } from "react";

import { RacwaLoadingModal } from "@racwa/react-components";

import type { OneTimePasswordProps } from "./types";
import SendOtpDialog from "./components/SendOtpDialog";
import VerifyOtpDialog from "./components/VerifyOtpDialog";
import { DEFAULT_RAC_PHONE_NUMBER } from "./constants";
import { OtpFlowStateProvider } from "./contexts/OtpFlowState";
import useOneTimePassword from "./hooks/useOneTimePassword";

/**
 * The zIndex for the OTP dialog is set to 1400 to
 * ensure it is displayed above any default dialog.
 * The default MUI Dialog zIndex is 1300.
 * This aligns with the OneTimePasswordDialog in raci-react-library.
 */
const zIndex = 1400;
const backdropId = "mfa-otp-backdrop";

/**
 * Dialog to display when a member needs to complete One Time Password (OTP)
 * verification to satisfy Multi Factor Authentication (MFA) security requirements
 * before accessing sensitive data or performing sensitive actions like
 * registering for a myRAC account, updating their myRAC account details or
 * performing an update to their personal/banking details stored with RAC.
 *
 * TODO - DED-1295 - Need to be able to disable the get/send code/call links while displaying RacwaLoadingModal backdrop as they can be still accessed
 * - This was discovered during testing in Storybook on the docs page for the composite
 */
const OneTimePassword: React.FC<OneTimePasswordProps> = ({
  onClickClose,
  showDialog,
  faqUrl,
  helpDisplayPhoneNumber = DEFAULT_RAC_PHONE_NUMBER,
  getVerificationDetails,
  checkAndSendOtp,
  checkAndVerifyOtp,
  onSuccess,
  onError,
  loadingModalMessage,
}) => {
  const { onReceiveOtpViaCall, onReceiveOtpViaSms, backdropState, phoneSuffix, isSubmitting, ...verifyProps } =
    useOneTimePassword({
      getVerificationDetails,
      checkAndSendOtp,
      checkAndVerifyOtp,
      onError,
      onSuccess,
      loadingModalMessage,
    });

  return (
    showDialog && (
      <>
        <RacwaLoadingModal
          id={backdropId}
          data-testid={backdropId}
          open={backdropState.open}
          message={backdropState.message}
          sx={[backdropState.open && { zIndex: zIndex }]}
        />
        <Suspense
          fallback={
            <RacwaLoadingModal
              id={backdropId}
              data-testid={backdropId}
              open={backdropState.open}
              message={backdropState.message}
              sx={[{ zIndex: zIndex }]}
            />
          }
        >
          <SendOtpDialog
            phoneNumberSuffix={phoneSuffix}
            faqUrl={faqUrl}
            helpDisplayPhoneNumber={helpDisplayPhoneNumber}
            isSubmitting={isSubmitting}
            onClickReceiveCall={onReceiveOtpViaCall}
            onClickSendSms={onReceiveOtpViaSms}
            onClickClose={onClickClose}
          />
          <VerifyOtpDialog
            form={verifyProps.form}
            fields={verifyProps.fields}
            phoneNumberSuffix={phoneSuffix}
            faqUrl={faqUrl}
            helpDisplayPhoneNumber={helpDisplayPhoneNumber}
            isSubmitting={isSubmitting}
            justVerified={verifyProps.justVerified}
            oneTimePasswordError={verifyProps.oneTimePasswordError}
            onSubmitVerifyOtp={verifyProps.onSubmitVerifyOtp}
            onClickClose={onClickClose}
          />
        </Suspense>
      </>
    )
  );
};

export type OneTimePasswordDialogProps = ComponentProps<typeof OneTimePassword>;

export const OneTimePasswordDialog: React.FC<OneTimePasswordDialogProps> = (props) => {
  return (
    <OtpFlowStateProvider>
      <OneTimePassword {...props} />
    </OtpFlowStateProvider>
  );
};

export default OneTimePasswordDialog;

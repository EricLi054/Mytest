"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT } from "#utils/constants";
import { getRegistrationErrorPageUrl } from "#utils/routing";

import type {
  MfaModalDialogContextValue,
  OnSuccessCallbackType,
  OtpChannelValue,
  OtpVerificationDetails,
  SendOtpResponse,
  VerifyOtpResponse,
} from "@racwa/mfa";
import { MfaModalDialogContext, OneTimePasswordDialog } from "@racwa/mfa";

export type MfaModalDialogProviderProps = {
  /**
   * Server action to call MFA GetVerificationDetails or
   * GetRegistrationVerificationDetails GQL mutation.
   */
  getVerificationDetailsAction: () => Promise<OtpVerificationDetails>;
  /**
   * Server action to call MFA SendOtp or SendRegistrationOtp
   * GQL mutation to send the code to the member.
   */
  sendOtpAction: (key: string, channel: OtpChannelValue) => Promise<SendOtpResponse>;
  /**
   * Server action to call MFA VerifyOtp or VerifyRegistrationOtp
   * GQL mutation to verify the code the member entered.
   */
  verifyOtpAction: (key: string, verificationCode: string) => Promise<VerifyOtpResponse>;
} & PropsWithChildren;

/**
 * Multi Factor Authentication (MFA) Modal Dialog Provider for "anonymous"
 * users that need to verify their identity using a One Time Password (OTP).
 *
 * The Identity frontend app currently only has a single use case for this provider:
 * - "Anonymous" users that are trying register for a myRAC account
 *
 * But, the Identity frontend app will likely also need to provide MFA to
 * "anonymous" users that need to reset the email address connected to their
 * myRAC account (eg lost access to the email account, like if they used a
 * work email address but are no longer employed there) in the near future.
 * - See https://rac-wa.atlassian.net/browse/DED-2094
 *
 * In the future the Identity frontend app might also need to provide
 * MFA for "logged-in" users to change details like their marketing
 * consent and preferences, so a separate provider would be required
 * for that use case that uses the `{...}Otp` GraphQL mutations that
 * use the ADB2C authorization rather than the `{...}RegistrationOtp`
 * GraphQL mutations ManagedIdentity AD authorization.
 *
 * TODO Items for DED-1296:
 * - Should this provider be moved to the mfa package for reuse across the frontend apps?
 * - Should this provider be moved up to the Providers in the Identity frontend app for reuse?
 * - Figure out how to handle scenario where user has matched but closes the MFA dialog or goes back in browser the link member page. Can form values be saved to session and reloaded?
 * - Can loading modal be implemented to smooth the transition from error when closing MFA and redirecting to the link member page?
 */
export const MfaModalDialogProvider = ({
  getVerificationDetailsAction,
  sendOtpAction,
  verifyOtpAction,
  children,
}: MfaModalDialogProviderProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [onErrorTriggered, setOnErrorTriggered] = useState(false);
  const [onSuccessTriggered, setOnSuccessTriggered] = useState(false);
  const [customLoadingMessage, setCustomLoadingMessage] = useState<string>();
  const [successCallback, setSuccessCallback] = useState<{
    successCallback: OnSuccessCallbackType;
  }>();

  const openMfaModal = (successCallback: OnSuccessCallbackType, customLoadingMessage?: string) => {
    if (customLoadingMessage) {
      setCustomLoadingMessage(customLoadingMessage);
    }
    setSuccessCallback({ successCallback });
    setOpen(true);
  };

  const closeMfaModal = () => setOpen(false);

  const onError = () => {
    setOnErrorTriggered(true);
    closeMfaModal();
    router.push(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  };

  const onSuccess = async () => {
    setOnSuccessTriggered(true);

    if (successCallback) {
      await successCallback.successCallback();
    }

    closeMfaModal();
  };

  const ProviderValues: MfaModalDialogContextValue = {
    openMfaModal,
    closeMfaModal,
    mfaOnErrorTriggered: onErrorTriggered,
    mfaOnSuccessTriggered: onSuccessTriggered,
  };

  return (
    <MfaModalDialogContext.Provider value={ProviderValues}>
      {open && (
        <OneTimePasswordDialog
          showDialog={open}
          faqUrl="/myrac/help"
          helpDisplayPhoneNumber={RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT}
          loadingModalMessage={customLoadingMessage}
          getVerificationDetails={getVerificationDetailsAction}
          sendOtp={sendOtpAction}
          verifyOtp={verifyOtpAction}
          onClickClose={closeMfaModal}
          onError={onError}
          onSuccess={onSuccess}
        />
      )}
      {children}
    </MfaModalDialogContext.Provider>
  );
};

"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT } from "#utils/constants";
import { getRegistrationErrorPageUrl } from "#utils/routing";

import type {
  MfaModalDialogContextValue,
  OneTimePasswordDialogProps,
  OnSuccessCallbackType,
  OtpVerificationDetails,
} from "@racwa/mfa";
import { MfaModalDialogContext, OneTimePasswordDialog } from "@racwa/mfa";

import type { Person } from "../../types";

export type MfaModalDialogProviderProps = {
  /** Get the person with the OTP Verification Details */
  getPerson: () => Promise<Person | undefined>;
  /**
   * Server action to call MFA CheckOtp or CheckRegistrationOtp GQL mutation
   * to check if the member is already authenticated for the session key.
   */
  checkOtp: (key: string, crmId: string) => Promise<boolean>;
} & Pick<OneTimePasswordDialogProps, "checkAndSendOtp" | "checkAndVerifyOtp"> &
  PropsWithChildren;

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
 * for that use case that uses the `Check{...}Otp` GraphQL mutations
 * rather than the `Check{...}RegistrationOtp` GraphQL mutations.
 *
 * TODO Items for DED-1296:
 * - Should this provider be moved to the mfa package for reuse across the frontend apps?
 * - Should this provider be moved up to the Providers in the Identity frontend app for reuse?
 * - Figure out how to handle scenario where user has matched but closes the MFA dialog or goes back in browser the link member page. Can form values be saved to session and reloaded?
 * - Can loading backdrops be implemented to smooth the transition from successful submission to opening MFA and then closing MFA and redirecting to the link member page?
 * - Get a task created to implement integration tests for MFA in the registration flow of the Identity frontend app
 */
export const MfaModalDialogProvider = ({
  getPerson,
  checkOtp,
  checkAndSendOtp,
  checkAndVerifyOtp,
  children,
}: MfaModalDialogProviderProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [customLoadingMessage, setCustomLoadingMessage] = useState<string>();
  const [successCallback, setSuccessCallback] = useState<{
    successCallback: OnSuccessCallbackType;
  }>();

  /**
   * Get the OTP VerificationDetails from the Person and
   * then call CheckOtp GQL mutation again check that the
   * member is not already authenticated for the session key.
   */
  const getOtpVerificationDetailsAndCheckOtp = async (): Promise<OtpVerificationDetails> => {
    const person = await getPerson();
    if (!person) {
      throw new Error("Person is not defined");
    }

    const otpVerificationDetails = person.otpVerificationDetails;
    if (!otpVerificationDetails) {
      throw new Error("OtpVerificationDetails are not defined on the Person");
    }

    const sessionKey = otpVerificationDetails.sessionKey;

    // If the member is already authenticated for the session key, then the
    // shared MFA component will redirect them to the link member page without
    // needing to authenticate again. Letting the MFA component handle this logic
    // is preferred over handling it in the Identity frontend app so that we are
    // always checking the current status of the member's authentication rather
    // than relying on session state in the frontend app that could be out of date.
    const isAuthenticated = await checkOtp(sessionKey, person.personId);

    return {
      sessionKey: sessionKey,
      isAuthenticated: isAuthenticated,
      isMobile: otpVerificationDetails.isMobile,
      phoneNumberSuffix: otpVerificationDetails.phoneNumberSuffix,
    };
  };

  const openMfaModal = (successCallback: OnSuccessCallbackType, customLoadingMessage?: string) => {
    if (customLoadingMessage) {
      setCustomLoadingMessage(customLoadingMessage);
    }
    setSuccessCallback({ successCallback });
    setOpen(true);
  };

  const closeMfaModal = () => setOpen(false);

  const onError = () => {
    closeMfaModal();
    // TODO - Need to remove the matched person from the session, set a property in session to check or terminate the session in the error page so user cannot navigate back to the match page after an error
    return router.push(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  };

  const onSuccess = async () => {
    if (successCallback) {
      await successCallback.successCallback();
    }
    closeMfaModal();
  };

  const ProviderValues: MfaModalDialogContextValue = {
    isMfaModalOpen: open,
    openMfaModal,
    closeMfaModal,
  };

  return (
    <MfaModalDialogContext.Provider value={ProviderValues}>
      {open && (
        <OneTimePasswordDialog
          showDialog={open}
          faqUrl="/myrac/help"
          helpDisplayPhoneNumber={RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT}
          loadingModalMessage={customLoadingMessage}
          getVerificationDetails={getOtpVerificationDetailsAndCheckOtp}
          checkAndSendOtp={checkAndSendOtp}
          checkAndVerifyOtp={checkAndVerifyOtp}
          onClickClose={closeMfaModal}
          onError={onError}
          onSuccess={onSuccess}
        />
      )}
      {children}
    </MfaModalDialogContext.Provider>
  );
};

"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOtpVerificationDetails } from "#graphql/mfa/getOtpVerificationDetails";
import { sendOtp } from "#graphql/mfa/sendOtp";
import { verifyOtp } from "#graphql/mfa/verifyOtp";
import { errorPages } from "#utils/errorPages";

import { OneTimePasswordDialog } from "@racwa/mfa";

import type { OnSuccessCallbackType } from "./context";
import { MFAContext } from "./context";

export type MFAProviderProps = { sessionKey: string } & PropsWithChildren;

export const MFAProvider = ({ sessionKey, children }: MFAProviderProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [successCallback, setSuccessCallback] = useState<{
    successCallback: OnSuccessCallbackType;
  }>();

  const getVerificationDetails = async () => {
    const otpVerificationDetails = await getOtpVerificationDetails(sessionKey);

    return {
      sessionKey,
      ...otpVerificationDetails,
    };
  };

  const onError = () => {
    setOpen(false);
    router.push(errorPages.somethingWentWrong);
  };

  const onSuccess = async () => {
    if (successCallback) {
      await successCallback.successCallback();
    }
    setOpen(false);
  };

  const openMFAModal = (successCallback: OnSuccessCallbackType) => {
    setSuccessCallback({ successCallback });
    setOpen(true);
  };

  const closeMFAModal = () => {
    setOpen(false);
  };

  const ProviderValues: MFAContext = {
    openMFAModal,
    closeMFAModal,
  };

  return (
    <MFAContext.Provider value={ProviderValues}>
      {open && (
        <OneTimePasswordDialog
          showDialog={open}
          getVerificationDetails={getVerificationDetails}
          checkAndSendOtp={sendOtp}
          checkAndVerifyOtp={verifyOtp}
          onClickClose={closeMFAModal}
          onError={onError}
          onSuccess={onSuccess}
          faqUrl="/myrac/help"
        />
      )}
      {children}
    </MFAContext.Provider>
  );
};

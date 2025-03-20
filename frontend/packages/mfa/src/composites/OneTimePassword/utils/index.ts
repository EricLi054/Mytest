import { event, gtm } from "@racwa/analytics";

import type { FlowValues, MfaOtpEventArgs } from "../types/internal";
import { ContactMethod, NotAuthenticatedStateFlow, VerifyOptions } from "../types/internal";

export const getMaskedMobilePhoneNumber = (phoneNumberSuffix: string) => {
  return `04** *** ${phoneNumberSuffix}`;
};

export const getContactMethod = ({ isSms, memberStatus }: { isSms: boolean } & Pick<FlowValues, "memberStatus">) =>
  isSms
    ? ContactMethod.Sms
    : memberStatus === VerifyOptions.HasMobile
      ? ContactMethod.MobileCall
      : ContactMethod.LandlineCall;

export const mfaOtpEvent = ({ description, selectionStatus, memberStatus }: MfaOtpEventArgs) => {
  if (selectionStatus === undefined || memberStatus === undefined) {
    return `MFA - ${description}` as const;
  }

  const isSms =
    selectionStatus === NotAuthenticatedStateFlow.SMSVerificationOption ||
    selectionStatus === NotAuthenticatedStateFlow.ReadyToVerifyWithSMS;

  const isVerifyDialog =
    selectionStatus === NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall ||
    selectionStatus === NotAuthenticatedStateFlow.ReadyToVerifyWithSMS;

  const contactMethod = getContactMethod({ isSms, memberStatus });
  const dialog = isVerifyDialog ? "Enter verification code" : "Lets verify its you";

  return `MFA - ${contactMethod} - ${dialog} - ${description}` as const;
};

export const fireMfaOtpEvent = ({ description, selectionStatus, memberStatus }: MfaOtpEventArgs) => {
  gtm(event(mfaOtpEvent({ description, selectionStatus, memberStatus })));
};

export const wait = (timeout: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

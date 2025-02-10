import { MFAChannel, MFAState, MFAVerificationState } from '../Types/MFAEnums';

export interface MFAModalContentModel {
  // Request Code
  requestCodeModalTitle: string;
  requestCodeSMSBodyText: string;
  requestCodeSMSButtonText: string;
  requestCodePhoneBodyText: string;
  requestCodePhoneButtonText: string;
  requestCodeSMSLoadingText: string;
  requestCodePhoneLoadingText: string;

  // Verify Code
  verifyCodeModalTitle: string;
  verifyCodeButtonText: string;
  verifiedCodeButtonText: string;
  verifyCodeSMSBodyText: string;
  verifyCodePhoneBodyText: string;
  verifyCodeLoadingText: string;

  // Verifcation form error messages
  otpFieldInvalidCodeMessage: string; // Please enter a valid verification code.
  otpFieldFailedVerificationMessage: string; // Sorry, that code doesn't match. Please try again or request a new code.
  otpFieldExpiredCodeMessage: string; // Sorry, that code has expired. Please request a new code.

  // Footer content
  smsAlternateMethodLinkText: string;
  phoneAlternateMethodLinkText: string;
  smsResendCodeButtonText: string;
  phoneResendCodeButtonText: string;

  footerFAQLabel: string;
  footerFAQLinkText: string;
  footerFAQLinkPath: string;

  footerPhoneLabel: string;
  footerPhoneLinkText: string;
  footerPhoneLinkUrl: string;

  // Analytics
  verifyCodeEntryAnalyticsText: string;
  footerFAQAnalyticsText: string;
  footerPhoneAnalyticsText: string;

  serverErrorAnalyticsText: string;
  serverNoContactsAnalyticsText: string;

  otpRequestMaxedAnalyticsText: string;
  otpAttemptsMaxedAnalyticsText: string;
  otpTimeoutAnalyticsText: string;
  otpIncorrectAnalyticsText: string;
}

export const defaultMFAModalContent: MFAModalContentModel = {
  // Request Code
  requestCodeModalTitle: 'Let’s verify it’s you',
  requestCodeSMSBodyText: 'We’ll send a verification code to 04** *** 123.',
  requestCodeSMSButtonText: 'Send code',
  requestCodePhoneBodyText: "We'll phone you on 04** *** 123 with a verification code.",
  requestCodePhoneButtonText: 'Request a call',
  requestCodePhoneLoadingText: 'Triggering a phone call',
  requestCodeSMSLoadingText: 'Sending',

  // Verify Code
  verifyCodeModalTitle: 'Enter verification code',
  verifyCodeSMSBodyText: 'We’ve sent an SMS to 04** *** 123. Please enter the verification code to verify it’s you.',
  verifyCodeButtonText: 'Verify',
  verifiedCodeButtonText: 'Verified',
  verifyCodePhoneBodyText: 'Please enter the code to verify it’s you.',
  verifyCodeLoadingText: 'Submitting',

  // Verification form error messages
  otpFieldInvalidCodeMessage: 'Please enter a valid verification code.',
  otpFieldFailedVerificationMessage: "Sorry, that code doesn't match. Please try again or request a new code.",
  otpFieldExpiredCodeMessage: 'Sorry, that code has expired. Please request a new code.',

  // Footer content
  smsResendCodeButtonText: 'Send new code',
  phoneResendCodeButtonText: 'Get another phone call',
  smsAlternateMethodLinkText: 'Get code via phone call',
  phoneAlternateMethodLinkText: 'Send code via SMS',

  footerFAQLabel: 'Need help?',
  footerFAQLinkText: 'Visit our FAQs',
  footerFAQLinkPath: '/myrac/help',

  footerPhoneLabel: 'Not your number? Call ',
  footerPhoneLinkText: '13 17 03',
  footerPhoneLinkUrl: 'tel:131703',

  // Analytics
  verifyCodeEntryAnalyticsText: 'Please enter the code to verify its you',
  footerFAQAnalyticsText: 'Visit our FAQs',
  footerPhoneAnalyticsText: 'Call 13 17 03',

  serverErrorAnalyticsText: 'MFA - Server error',
  serverNoContactsAnalyticsText: 'MFA - MC contact information missing',

  otpRequestMaxedAnalyticsText: 'OTP request maxed',
  otpAttemptsMaxedAnalyticsText: 'OTP attempts maxed',

  otpTimeoutAnalyticsText: 'OTP timeout',
  otpIncorrectAnalyticsText: 'OTP incorrect'
};

export const getRequestCodeSMSBodyText = (mobilePhone: string): string => {
  return `We’ll send a verification code to ${mobilePhone}.`;
};

export const getRequestCodePhoneBodyText = (phoneNumber: string): string => {
  return `We'll phone you on ${phoneNumber} with a verification code.`;
};

export const getVerifyCodeSMSBodyText = (mobilePhone: string): string => {
  return `We’ve sent an SMS to ${mobilePhone}. Please enter the verification code to verify it’s you.`;
};

export const getMfaChannelString = (channel: MFAChannel, isPhoneOnly: boolean): string => {
  if (channel === MFAChannel.sms) {
    return 'MFA - Sms';
  }

  return isPhoneOnly ? 'MFA - Landline call' : 'MFA - Mobile call';
};

export const getMFAStepString = (mfaState: MFAState, mfaVerificationState: MFAVerificationState) => {
  if (mfaState === MFAState.verifyCode) {
    return mfaVerificationState === MFAVerificationState.Verified ? 'Verified' : 'Enter verification code';
  }

  return 'Lets verify its you';
};

export const getMFASendCodeString = (channel: MFAChannel) =>
  channel === MFAChannel.sms ? 'Send code' : 'Request a call';

export const getMFAChangeChannelString = (channel: MFAChannel) =>
  channel === MFAChannel.sms ? 'Get code via phone call' : 'Send code via SMS';

export const getMFAResendCodeString = (channel: MFAChannel) =>
  channel === MFAChannel.sms ? 'Send new code' : 'Get another phone call';

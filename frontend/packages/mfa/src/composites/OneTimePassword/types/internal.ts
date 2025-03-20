import type { FieldMetadata, FormMetadata } from "@conform-to/react";

export const VerifyOptions = {
  HasMobile: "HasMobile",
  HasLandline: "HasLandline",
  None: "None",
} as const;
export type VerifyOptionsValue = (typeof VerifyOptions)[keyof typeof VerifyOptions];

export const OneTimePasswordErrorState = {
  CodeExpired: "CodeExpired",
  WrongCode: "WrongCode",
  None: "None",
} as const;
export type OneTimePasswordErrorStateValue = (typeof OneTimePasswordErrorState)[keyof typeof OneTimePasswordErrorState];

export const NotAuthenticatedStateFlow = {
  VerificationOptionNotSelected: "VerificationOptionNotSelected",
  SMSVerificationOption: "SMSVerificationOption",
  PhoneCallVerificationOption: "PhoneCallVerificationOption",
  ReadyToVerifyWithSMS: "ReadyToVerifyWithSMS",
  ReadyToVerifyWithPhoneCall: "ReadyToVerifyWithPhoneCall",
} as const;
export type NotAuthenticatedStateFlowValue = (typeof NotAuthenticatedStateFlow)[keyof typeof NotAuthenticatedStateFlow];

export const ContactMethod = {
  Sms: "Sms",
  MobileCall: "Mobile call",
  LandlineCall: "Landline call",
} as const;
export type ContactMethodValue = (typeof ContactMethod)[keyof typeof ContactMethod];

// TODO - DED-1295 - Should this be renamed to OtpFlowValues?
export type FlowValues = {
  isAuthenticated: boolean;
  hasSendAttemptsRemaining: boolean;
  memberStatus: VerifyOptionsValue;
  selectionStatus: NotAuthenticatedStateFlowValue;
};

// TODO - DED-1295 - Should this be renamed to OtpFlowStateContextValue?
export type FlowStateContextValue = {
  flowState: FlowValues;
  setFlowState: (flowState: FlowValues) => void;
};

export type OneTimePasswordFormValues = {
  verificationCode: string;
};

export type OneTimePasswordFormProps = {
  form: FormMetadata<OneTimePasswordFormValues, string[]>;
  fields: Required<{
    verificationCode: FieldMetadata<string, OneTimePasswordFormValues, string[]>;
  }>;
  /** Function to call when form onSubmit is called and the form is valid */
  onSubmitVerifyOtp: (values: OneTimePasswordFormValues) => Promise<void>;
};

export type MfaOtpEventArgs = {
  description: string;
  selectionStatus?: NotAuthenticatedStateFlowValue | undefined;
  memberStatus?: VerifyOptionsValue | undefined;
};

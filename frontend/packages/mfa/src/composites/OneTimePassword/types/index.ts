/** Matches OtpVerificationDetails type(s) in shared @racwa/gql schema */
export type OtpVerificationDetails = {
  sessionKey: string;
  isAuthenticated: boolean;
  isMobile?: boolean | null;
  phoneNumberSuffix?: string | null;
};

/** Matches SendOtpResponse type(s) in shared @racwa/gql schema */
export type CheckAndSendOtpResponse = {
  data?: { hasSendAttemptsRemaining: boolean };
  errorCode?: "TooManyRequestsError";
};

/** Matches VerifyOtpResponse type(s) in shared @racwa/gql schema */
export type CheckAndVerifyOtpResponse = {
  data?: { isVerified: boolean };
  errorCode?: "TooManyRequestsError" | "NotFoundError";
};

/** Matches OtpChannel enum in shared @racwa/gql schema */
export const OtpChannel = {
  SMS: "SMS",
  CALL: "CALL",
} as const;
export type OtpChannelValue = (typeof OtpChannel)[keyof typeof OtpChannel];

export type OneTimePasswordProps = {
  onClickClose: () => void;
  showDialog: boolean;
  faqUrl: string;
  /** The 'need help' RAC phone number in display format */
  helpDisplayPhoneNumber?: string;
} & UseOneTimePasswordProps;

export type UseOneTimePasswordProps = {
  /**
   * Server action to get the OTP verification details for the member.
   *
   * This can be achieved by:
   * - Using the OtpVerificationDetails type extension on the Person or MatchedPerson type
   * - Calling the MFA GetOtpVerificationDetails or GetRegistrationOtpVerificationDetails GQL mutation
   * - Just returning the OtpVerificationDetails if the details have already been obtained from the Person in some other way
   */
  getVerificationDetails: () => Promise<OtpVerificationDetails>;
  /**
   * Server action to call MFA CheckAndSendOtp or CheckAndSendRegistrationOtp GQL mutation.
   *
   * CheckOtp mutation is called first to ensure that the member is not already authenticated.
   * If the member is not already authenticated, then the SendOtp mutation is called to send the code to the member.
   *
   * TODO - DED-2215 - RACI MFA OTP Service performance issues identified on CheckOtp endpoint. Potentially remove the checkOtp call and just call sendOtp.
   */
  checkAndSendOtp: (key: string, channel: OtpChannelValue) => Promise<CheckAndSendOtpResponse>;
  /**
   * Server action to call MFA CheckAndVerifyOtp or CheckAndVerifyRegistrationOtp GQL mutation.
   *
   * CheckOtp mutation is called first to ensure that the member is not already authenticated.
   * If the member is not already authenticated, then the VerifyOtp mutation is called to verify the code the member entered.
   *
   * * TODO - DED-2215 - RACI MFA OTP Service performance issues identified on CheckOtp endpoint. Potentially remove the checkOtp call and just call verifyOtp.
   */
  checkAndVerifyOtp: (key: string, verificationCode: string) => Promise<CheckAndVerifyOtpResponse>;
  /**
   * Callback function to be executed once member is OTP verified.
   *
   * TODO - DED-1295 - What should the correct return types be? RRL OneTimePassword Composite was `unknown | Promise<unknown>`
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onSuccess: () => unknown | Promise<unknown>;
  /**
   * Callback function to redirect to an error page.
   *
   * TODO - DED-1295 - What should the correct return types be? RRL OneTimePassword Composite was `unknown | Promise<unknown>`
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onError: () => unknown | Promise<unknown>;
  /**
   * The loading modal will open when the `onLoad` function in the useEffect
   * triggers with the default message "Loading", but this property can be
   * set to customize the loading messaging shown (eg "We found you!").
   */
  loadingModalMessage?: string;
};

/**
 * NPE Feature Headers provided by the RACI MFA OTP Service.
 * These headers are used to control the behaviour of the
 * OTP service in all non-production environments.
 */
export const NpeOtpFeatureHeaders = {
  BypassOtp: "Feature_BypassOtp",
  OverrideToNumber: "Feature_OverrideToNumber",
} as const;

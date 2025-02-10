export enum MFAVerificationState {
  initial,
  Verifying,
  Verified,
  VerifyFail
}

export enum MFAState {
  requestCode,
  verifyCode
}

export enum MFAChannel {
  sms,
  phone
}

export enum verifyOTPResponse {
  VerifySuccess,
  VerifyFail,
  TokenExpired,
  MaxedOutVerificationAttempts,
  UnhandledError
}

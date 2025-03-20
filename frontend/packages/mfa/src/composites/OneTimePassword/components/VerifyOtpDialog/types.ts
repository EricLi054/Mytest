export const VerifyButtonState = {
  ToVerify: 0,
  Verifying: 1,
  Verified: 2,
  Disabled: 3,
} as const;
export type VerifyButtonStateValue = (typeof VerifyButtonState)[keyof typeof VerifyButtonState];

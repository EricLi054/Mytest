"use client";

import { Typography } from "@mui/material";
import { OTP_INPUT_NAME } from "#composites/OneTimePassword/constants";
import { getMaskedMobilePhoneNumber } from "#composites/OneTimePassword/utils";
import { createId } from "#utils/internal/index";

export type EnterCodeTextProps = {
  /** Was OTP code sent via SMS */
  isSms: boolean;
  /** Last 3 digits of phone number OTP code is sent to */
  phoneNumberSuffix?: string;
};

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const EnterCodeText = ({ isSms, phoneNumberSuffix }: EnterCodeTextProps) => {
  return (
    <Typography id={createId(OTP_INPUT_NAME, "enter-code-text")} variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
      {isSms && phoneNumberSuffix ? `We've sent an SMS to ${getMaskedMobilePhoneNumber(phoneNumberSuffix)}. ` : ""}
      Please enter the code to verify it's you.
    </Typography>
  );
};

export default EnterCodeText;

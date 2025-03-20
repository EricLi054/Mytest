import { z } from "zod";

import { OTP_INPUT_ERROR_MESSAGE, OTP_INPUT_LENGTH } from "./constants";

// TODO - DED-1295 - RacwaOtpInput filters out non-numeric characters, does the schema need to check numeric chars only and trim whitespace etc?
export const verifyOtpSchema = z.object({
  verificationCode: z
    .string({ message: OTP_INPUT_ERROR_MESSAGE })
    .length(OTP_INPUT_LENGTH, { message: OTP_INPUT_ERROR_MESSAGE }),
});

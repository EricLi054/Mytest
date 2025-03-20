import { z } from "zod";

export const VerifyOtpResponseSchema = z.object({
  verifyOtp: z.object({
    isVerified: z.boolean().nullable().optional(),
    errors: z
      .array(
        z.object({
          __typename: z.string(),
        }),
      )
      .nullable()
      .optional(),
  }),
});

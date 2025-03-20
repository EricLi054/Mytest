import { z } from "zod";

export const SendOtpResponseSchema = z.object({
  sendOtp: z.object({
    hasSendAttemptsRemaining: z.boolean().nullable().optional(),
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

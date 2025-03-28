import { z } from "zod";

export const schema = z.object({
  sendRegistrationOtp: z.object({
    sendOtpResponse: z
      .object({
        hasSendAttemptsRemaining: z.boolean(),
      })
      .nullable()
      .optional(),
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

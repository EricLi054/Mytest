import { z } from "zod";

export const schema = z.object({
  verifyRegistrationOtp: z.object({
    verifyOtpResponse: z
      .object({
        isVerified: z.boolean(),
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

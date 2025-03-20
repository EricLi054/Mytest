import { z } from "zod";

export const beforeYouStartSchema = z.object({
  // Marked as optional to prevent a Required error message,
  // but it must be true before you can continue
  hasAcceptedTerms: z
    .boolean()
    .optional()
    .refine((x) => x === true, { message: "Please accept the Terms and Conditions" }),
});

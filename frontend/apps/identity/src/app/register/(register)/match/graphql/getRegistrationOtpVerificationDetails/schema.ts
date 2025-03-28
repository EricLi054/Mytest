import { z } from "zod";

export const schema = z.object({
  isAuthenticated: z.boolean(),
  isMobile: z.boolean().nullable().optional(),
  phoneNumberSuffix: z.string().nullable().optional(),
});

import { z } from "zod";

export const ADB2CSchema = z.object({
  adb2CAccount: z.object({
    id: z.string(),
    crmId: z.string().nullable(),
  }),
});

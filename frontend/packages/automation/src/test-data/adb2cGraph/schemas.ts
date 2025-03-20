import { z } from "zod";

export const ADB2CGraphUserSchema = z.object({
  id: z.string(),
  crmid: z.string().optional(),
  accountEnabled: z.boolean(),
  displayName: z.string(),
  identities: z.array(
    z.object({
      issuer: z.string(),
      issuerAssignedId: z.string(),
      signInType: z.string(),
    }),
  ),
});

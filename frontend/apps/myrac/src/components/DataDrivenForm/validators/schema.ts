import { z } from "zod";

export const ValidationOptionsSchema = z.object({
  message: z.string(),
  nameType: z.string().nullable().optional(),
  phoneType: z.string().nullable().optional(),
});

export const ValidationMetaSchema = z.object({
  initial: z.string().nullable().optional(),
});

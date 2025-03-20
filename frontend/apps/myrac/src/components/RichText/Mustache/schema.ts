import { z } from "zod";

export const MustacheTemplateSchema = z.object({
  template: z.string(),
  textColour: z
    .object({
      hex: z.string(),
    })
    .nullable()
    .optional(),
});

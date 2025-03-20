import { CardSchema } from "#contentful/schema";
import { z } from "zod";

export const ConfirmVehicleContentfulSchema = z.object({
  heading: z.string(),
  subheading: z.string().nullable().optional(),
  cards: z.object({
    importantInformation: CardSchema,
  }),
});

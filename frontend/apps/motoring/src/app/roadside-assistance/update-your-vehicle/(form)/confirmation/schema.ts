import { CardSchema } from "#contentful/schema";
import { z } from "zod";

export const ConfirmationPageSchema = z.object({
  heading: z.string().nullable(),
  subheading: z.string(),
  cards: z.object({
    motorcycleInsuranceCard: CardSchema,
    carInsuranceCard: CardSchema,
  }),
});

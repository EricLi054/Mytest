import type { DigitalCardDetailsSchema, PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";

export type DigitalCardDetails = z.infer<typeof DigitalCardDetailsSchema>;
export type Person = z.infer<typeof PersonSchema>;

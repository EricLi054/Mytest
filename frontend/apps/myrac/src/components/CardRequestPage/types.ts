import type { RequestPhysicalCardSchema } from "#graphql/person/mutations/schema";
import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";

export type Person = z.infer<typeof PersonSchema>;
export type RequestPhysicalCardResponse = z.infer<typeof RequestPhysicalCardSchema>;

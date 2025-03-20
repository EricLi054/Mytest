import type { GraphQLErrorSchema, PartialResultsErrorSchema, SystemKeySchema } from "#graphql/policyDetails/schema";
import type { z } from "zod";

export type ProductSystemKey = z.infer<typeof SystemKeySchema>;
export type GraphQLError = z.infer<typeof GraphQLErrorSchema>;
export type PartialResultsError = z.infer<typeof PartialResultsErrorSchema>;

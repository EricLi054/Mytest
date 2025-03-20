import { z } from "zod";

export const PhysicalCardResponseSchema = z.object({ isSuccess: z.boolean(), value: z.string() });
export const CardAlreadyOrderedErrorSchema = z.object({ __typename: z.literal("PhysicalCardAlreadyOrdered") });

export const RequestPhysicalCardSchema = z
  .object({
    requestPhysicalCard: z
      .object({
        physicalCardResponse: PhysicalCardResponseSchema.nullable(),
        errors: z.array(CardAlreadyOrderedErrorSchema).nullable().optional(),
      })
      .optional(),
  })
  .nullable();

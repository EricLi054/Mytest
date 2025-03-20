import { FieldMetaSchema } from "#components/DataDrivenForm/schema";
import { PersonAddressSchema } from "#graphql/person/queries/schema";
import { z } from "zod";

export const ParsedAddressValue = z.object({
  value: z.string(),
  label: z.string(),
});

export const AddressInputValidatedValue = PersonAddressSchema.extend({
  dpid: z.string().nullable(),
  country: z.string().nullable(),
});

export const AddressInputValueType = z.union([z.string(), AddressInputValidatedValue]);

export const AddressInputProps = z.object({
  value: AddressInputValueType,
  onChange: z.function(),
});

export const FieldSchema = z.object({
  input: AddressInputProps,
  label: z.string(),
  required: z.boolean(),
  notFoundMessage: z.string(),
  refineFurtherMessage: z.string(),
  apiErrorMessage: z.string(),
  tooltipTitle: z.string(),
  tooltipText: z.string(),
  placeholder: z.string(),
  meta: FieldMetaSchema,
});

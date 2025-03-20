import type { UseFieldApiProps } from "@data-driven-forms/react-form-renderer";
import type { SxProps } from "@mui/material";
import { RichTextJsonSchema } from "#graphql/sharedSchema/richTextSchema";
import { z } from "zod";

export const FieldMetaSchema = z.object({
  modified: z.boolean(),
  error: z.string().nullable().optional(),
  initial: z.string().nullable().optional(),
});

export const FieldInputProps: z.ZodType<Pick<UseFieldApiProps<HTMLElement>, "input">> = z.any();

export const SxType: z.ZodType<SxProps> = z.any();

export const ContentfulDataDrivenFormValidatorSchema = z.object({
  validatorType: z.string(),
  message: z.string(),
  pattern: z.string().nullable().optional(),
  nameType: z.string().nullable().optional(),
  phoneType: z.string().nullable().optional(),
  maxAge: z.number().nullable().optional(),
  minAge: z.number().nullable().optional(),
  ageOutOfRangeMessage: z.string().nullable().optional(),
});

export const ContentfulDataDrivenFormFieldSchema = z.object({
  name: z.string(),
  component: z.string(),
  required: z.boolean().nullable().optional(),
  requiredMessage: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  richText: z.object({ json: RichTextJsonSchema }).nullable().optional(),
  fixedLabelWidth: z.string().nullable().optional(),
  helperText: z.string().nullable().optional(),
  placeholder: z.string().nullable().optional(),
  tooltipTitle: z.string().nullable().optional(),
  tooltipText: z.string().nullable().optional(),
  selectOptions: z.array(z.string()).nullable().optional(),
  initialValue: z.string().nullable().optional(),
  successText: z.object({ json: RichTextJsonSchema }).nullable().optional(),
  errorText: z.object({ json: RichTextJsonSchema }).nullable().optional(),
  validators: z
    .object({
      items: z.array(ContentfulDataDrivenFormValidatorSchema),
    })
    .nullable()
    .optional(),
  conditionalLogic: z.string().nullable().optional(),
  extraData: z
    .object({
      sx: SxType.optional(),
      link: z.string().optional(),
      content: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export const ContentfulDataDrivenFormPageSchema = z.object({
  name: z.string(),
  fields: z.object({
    items: z.array(ContentfulDataDrivenFormFieldSchema),
  }),
  nextStep: z
    .object({
      name: z.string(),
    })
    .nullable(),
});

export const ContentfulDataDrivenFormSchema = z.object({
  title: z.string(),
  pages: z.object({
    items: z.array(ContentfulDataDrivenFormPageSchema),
  }),
});

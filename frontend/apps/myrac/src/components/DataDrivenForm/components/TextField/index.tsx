"use client";

import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import { useState } from "react";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { useGTMFormEvents } from "#components/DataDrivenForm/hooks";
import { FieldInputProps, FieldMetaSchema } from "#components/DataDrivenForm/schema";
import { z } from "zod";

import { RacwaTextInput } from "@racwa/react-components";

const FieldSchema = z.object({
  input: FieldInputProps,
  label: z.string(),
  required: z.boolean(),
  helperText: z.string().nullable().optional(),
  tooltipTitle: z.string().nullable().optional(),
  tooltipText: z.string().nullable().optional(),
  placeholder: z.string(),
  meta: FieldMetaSchema,
});

export const TextField = (props: UseFieldApiConfig) => {
  const fieldProps = useFieldApi(props);

  const { input, label, required, helperText, tooltipTitle, tooltipText, placeholder, meta } =
    FieldSchema.parse(fieldProps);

  const { logFormFieldTouched, logFormFieldValidation } = useGTMFormEvents(props);
  const [open, setOpen] = useState(false);

  const tooltipProps =
    tooltipTitle || tooltipText
      ? {
          open,
          title: tooltipTitle,
          message: tooltipText,
          onClickClose: () => {
            setOpen(false);
          },
          onClick: () => {
            setOpen(true);
          },
        }
      : undefined;

  return (
    <RacwaTextInput
      {...input}
      label={label}
      required={required}
      sublabel={helperText ?? undefined}
      error={meta.modified && meta.error !== undefined}
      helperText={meta.modified ? (meta.error ?? undefined) : undefined}
      tooltipProps={tooltipProps}
      placeholder={placeholder}
      onBlur={logFormFieldValidation}
      onFocus={logFormFieldTouched}
    />
  );
};

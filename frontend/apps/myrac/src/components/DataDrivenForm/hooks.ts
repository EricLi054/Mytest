import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { logFieldCleared, logFieldTouched, logFieldValidationError } from "#utils/analyticsTagging";
import { z } from "zod";

import { AddressInputValidatedValue } from "./components/AddressInput/schema";

const MetaSchema = z.object({
  error: z.string().nullable().optional(),
  initial: z.string().nullable().optional(),
});

const InputSchema = z.object({
  value: z.union([z.string().nullable(), AddressInputValidatedValue]),
});

const FieldSchema = z.object({
  input: InputSchema,
  meta: MetaSchema,
  label: z.string(),
  disableGTM: z.boolean().optional(),
});

export const useGTMFormEvents = (controlProps: UseFieldApiConfig) => {
  const fieldProps = useFieldApi(controlProps);
  const { input, meta, label, disableGTM } = FieldSchema.parse(fieldProps);

  const logFormFieldValidation = () => {
    if (disableGTM) return;
    const currentError = meta.error;
    const initialValue = meta.initial;
    const newValue = input.value;

    if (currentError) {
      logFieldValidationError(label);
    }

    if (
      typeof newValue === "string" &&
      initialValue &&
      initialValue.trim().length > 0 &&
      newValue.trim().length === 0
    ) {
      logFieldCleared(label);
    }
  };

  const logFormFieldTouched = () => {
    if (disableGTM) return;

    logFieldTouched(label);
  };

  return { logFormFieldValidation, logFormFieldTouched };
};

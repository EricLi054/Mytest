"use client";

import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer/use-field-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";
import { Grid2 as Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useGTMFormEvents } from "#components/DataDrivenForm/hooks";
import { FieldInputProps, FieldMetaSchema } from "#components/DataDrivenForm/schema";
import { z } from "zod";

import { RacwaFormControl } from "@racwa/react-components";
import { colors } from "@racwa/styles";

const FieldSchema = z.object({
  input: FieldInputProps,
  meta: FieldMetaSchema,
  options: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  label: z.string(),
  helperText: z.string().optional(),
  required: z.boolean(),
});

export const RacwaButtonSelect = (props: UseFieldApiConfig) => {
  const fieldProps = useFieldApi(props);
  const { input, meta, options, label, helperText, required } = FieldSchema.parse(fieldProps);

  const { logFormFieldTouched } = useGTMFormEvents(props);

  return (
    <div
      style={{
        width: "100%",
        marginLeft: "4px",
        marginBottom: "1rem",
      }}
    >
      <Grid container>
        <RacwaFormControl
          label={label}
          sublabel={helperText}
          error={meta.modified && meta.error !== undefined}
          helperText={meta.modified ? (meta.error ?? undefined) : undefined}
          required={required}
          margin="normal"
          passDownErrorProp={false}
        >
          <ToggleButtonGroup
            {...input}
            exclusive
            aria-label={label}
            sx={{
              border: meta.modified && meta.error !== undefined ? `1px solid ${colors.brandDangerNew}` : "",
            }}
          >
            {options.map((opt) => (
              <ToggleButton value={opt.value} aria-label={opt.value} key={opt.value} onClick={logFormFieldTouched}>
                {opt.value}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </RacwaFormControl>
      </Grid>
    </div>
  );
};

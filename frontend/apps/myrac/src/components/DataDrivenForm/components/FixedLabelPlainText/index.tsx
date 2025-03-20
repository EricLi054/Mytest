"use client";

import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import { useMemo } from "react";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { Grid2 as Grid, Typography } from "@mui/material";
import { FieldInputProps, SxType } from "#components/DataDrivenForm/schema";
import { z } from "zod";

import { useFormDataContext } from "../../FormDataProvider";

const FieldSchema = z.object({
  label: z.string(),
  fixedLabelWidth: z.string(),
  input: FieldInputProps,
  sx: SxType,
});

export const RacwaFixedLabelPlainText = (props: UseFieldApiConfig) => {
  const fieldProps = useFieldApi(props);
  const { label, fixedLabelWidth, input, sx } = FieldSchema.parse(fieldProps);
  const { mustacheReplace } = useFormDataContext();

  const { fixedLabel, rest } = useMemo(() => {
    let fixedLabel;
    let rest = label;
    if (typeof label === "string" && fixedLabelWidth) {
      const splitLabel = label.split(" ");
      fixedLabel = splitLabel[0];
      rest = splitLabel.slice(1).join(" ");
    }
    return { fixedLabel, rest: mustacheReplace(rest) };
  }, [mustacheReplace, label, fixedLabelWidth]);

  return (
    <Grid container>
      {fixedLabel && (
        <Typography width={fixedLabelWidth} sx={sx}>
          {fixedLabel}
        </Typography>
      )}
      <Typography {...input} sx={sx}>
        {rest}
      </Typography>
    </Grid>
  );
};

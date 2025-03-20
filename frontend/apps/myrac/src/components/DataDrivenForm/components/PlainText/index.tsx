"use client";

import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import { useMemo } from "react";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { Typography } from "@mui/material";
import { FieldInputProps, SxType } from "#components/DataDrivenForm/schema";
import { z } from "zod";

import { useFormDataContext } from "../../FormDataProvider";

const FieldSchema = z.object({
  label: z.string(),
  input: FieldInputProps,
  sx: SxType,
});

export const RacwaPlainText = (props: UseFieldApiConfig) => {
  const fieldProps = useFieldApi(props);
  const { label, input, sx } = FieldSchema.parse(fieldProps);
  const { mustacheReplace } = useFormDataContext();

  const replacedLabel = useMemo(() => {
    return mustacheReplace(label);
  }, [mustacheReplace, label]);

  return (
    <Typography {...input} sx={sx}>
      {replacedLabel}
    </Typography>
  );
};

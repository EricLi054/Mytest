"use client";

import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer/use-field-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";
import InternalRichTextRenderer from "#components/RichText/InternalRichTextRenderer";
import { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import { z } from "zod";

import { RacwaCardNotification } from "@racwa/react-components";

const FieldSchema = z.object({
  label: z.string().nullable().optional(),
  richText: RichTextSchema.nullable().optional(),
  helperText: z.string(),
});

export const RacwaInfoAlert = (props: UseFieldApiConfig) => {
  const fieldProps = useFieldApi(props);
  const { label, richText, helperText } = FieldSchema.parse(fieldProps);

  return (
    <RacwaCardNotification
      style={{ width: "100%", marginBottom: "1rem" }}
      title={richText ? <InternalRichTextRenderer text={richText} /> : label}
      severity="info"
    >
      {helperText}
    </RacwaCardNotification>
  );
};

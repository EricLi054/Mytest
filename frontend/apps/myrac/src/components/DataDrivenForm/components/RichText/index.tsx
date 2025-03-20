"use client";

import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import InternalRichTextRenderer from "#components/RichText/InternalRichTextRenderer";
import { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";

export const RacwaRichText = (props: UseFieldApiConfig) => {
  const { richText } = useFieldApi(props);
  const validatedRichText = RichTextSchema.parse(richText);

  return <InternalRichTextRenderer text={validatedRichText} />;
};

import type { Document } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

export const getPlainTextFromRichText = (richTextDocument: Document): string => {
  return documentToPlainTextString(richTextDocument);
};

import type { Document } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

export const calculateReadingTime = (richTextDocument: Document, wordsPerMinute = 200): string => {
  const plainText = documentToPlainTextString(richTextDocument);
  const wordCount = plainText.split(/\s+/).filter((word) => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
};

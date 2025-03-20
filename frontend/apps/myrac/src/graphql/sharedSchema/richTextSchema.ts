import type { Document } from "@contentful/rich-text-types";
import { z } from "zod";

export const RichTextJsonSchema: z.ZodType<Document> = z.any();

export const RichTextEmbeddedEntry = z.object({
  __typename: z.string(),
  sys: z.object({ id: z.string() }),
});

export const RichTextEmbeddedEntryNodeType = z.object({
  target: RichTextEmbeddedEntry.pick({ sys: true }),
});

export const RichTextLinkSchema = z
  .object({
    entries: z.object({
      inline: z.array(RichTextEmbeddedEntry),
    }),
  })
  .optional();

export const RichTextSchema = z.object({
  json: RichTextJsonSchema,
  links: RichTextLinkSchema,
});

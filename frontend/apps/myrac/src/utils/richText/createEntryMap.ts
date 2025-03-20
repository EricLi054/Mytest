import type { RichTextEmbeddedEntry, RichTextLinkSchema } from "#graphql/sharedSchema/richTextSchema";
import type { z } from "zod";

export const createEntryMap = (links: z.infer<typeof RichTextLinkSchema>) => {
  const entryMap = new Map<string, z.infer<typeof RichTextEmbeddedEntry>>();

  if (links?.entries !== undefined) {
    for (const entry of links.entries.inline) {
      entryMap.set(entry.sys.id, entry);
    }
  }
  return entryMap;
};

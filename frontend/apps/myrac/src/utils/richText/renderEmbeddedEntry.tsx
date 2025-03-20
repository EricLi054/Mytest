import type { Node } from "@contentful/rich-text-types";
import type { RichTextEmbeddedEntry } from "#graphql/sharedSchema/richTextSchema";
import type { ReactNode } from "react";
import type { z } from "zod";
import { RichTextEmbeddedEntryNodeType } from "#graphql/sharedSchema/richTextSchema";

export const renderEmbeddedEntry = (
  node: Node,
  entryMap: Map<string, z.infer<typeof RichTextEmbeddedEntry>>,
  componentMap: Record<string, ({ id }: { id: string }) => ReactNode>,
) => {
  const validatedNode = RichTextEmbeddedEntryNodeType.safeParse(node.data);

  if (validatedNode.success) {
    const entry = entryMap.get(validatedNode.data.target.sys.id);

    if (entry) {
      const Component = componentMap[entry.__typename.replace("rac_", "")];

      if (Component) {
        return <Component id={entry.sys.id} />;
      } else {
        return `Missing Rich Text Component: ${entry.__typename.replace("rac_", "")}`;
      }
    }
  }

  return "";
};

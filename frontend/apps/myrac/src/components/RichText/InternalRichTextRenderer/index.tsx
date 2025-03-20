import type { Options } from "@contentful/rich-text-react-renderer";
import type { Node } from "@contentful/rich-text-types";
import type { RichTextLinkSchema, RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import type { ComponentMapperType } from "#types/ComponentMapperType";
import type { z } from "zod";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { INLINES } from "@contentful/rich-text-types";
import ContentfulButton from "#components/Buttons/ContentfulButton";
import ContentfulLink from "#components/Links/ContentfulLink";
import { baseOptions, createEntryMap, renderEmbeddedEntry } from "#utils/richText";

import ContentfulGALink from "../ContentfulGALink";

const componentMap: ComponentMapperType = {
  Link: ContentfulLink,
  Button: ContentfulButton,
};

function renderOptions(
  links?: z.infer<typeof RichTextLinkSchema>,
  serverSideComponents?: ComponentMapperType,
): Options {
  const entryMap = createEntryMap(links);

  return {
    renderNode: {
      ...baseOptions,
      [INLINES.ENTRY_HYPERLINK]: (node: Node) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        return <ContentfulGALink id={node.data.target.sys.id} />;
      },
      [INLINES.EMBEDDED_ENTRY]: (node: Node) => {
        return renderEmbeddedEntry(node, entryMap, { ...componentMap, ...serverSideComponents });
      },
    },
  };
}

// We must pass in any server side components so they aren't imported into the client side renderer
export default function InternalRichTextRenderer({
  text,
  serverSideComponents,
}: {
  text: z.infer<typeof RichTextSchema>;
  serverSideComponents?: ComponentMapperType;
}) {
  try {
    return <>{documentToReactComponents(text.json, renderOptions(text.links, serverSideComponents))}</>;
  } catch (error) {
    console.error("Error: ContentfulRichTextRenderer.tsx - Error rendering rich text", error);
    return null;
  }
}

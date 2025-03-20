import type { Node } from "@contentful/rich-text-types";
import type { TypographyVariant } from "@mui/material";
import type { ContentfulRichTextRendererProps } from "#types/common/contentfulRichTextRendererProps";
import type { Entry } from "#types/common/richTextEntry";
import type { Links } from "#types/common/richTextLinks";
import type { ReactNode } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Typography } from "@mui/material";

import { StyledLink } from "@racwa/ui";

import { styles } from "./styles";

function renderOptions(links: Links | undefined, typographyVariant: TypographyVariant) {
  const entryMap = new Map<string, Entry>();
  if (links?.entries !== undefined) {
    // loop through the inline linked entries and add them to the map
    for (const entry of links.entries.inline) {
      entryMap.set(entry.sys.id, entry);
    }
  }

  return {
    renderNode: {
      [BLOCKS.HEADING_1]: (node: Node, children: ReactNode) => (
        <>
          <Typography variant="h1">{children}</Typography>
        </>
      ),
      [BLOCKS.HEADING_2]: (node: Node, children: ReactNode) => (
        <>
          <Typography variant="h2">{children}</Typography>
        </>
      ),
      [BLOCKS.HEADING_3]: (node: Node, children: ReactNode) => (
        <>
          <Typography variant="h3">{children}</Typography>
        </>
      ),
      [BLOCKS.HEADING_4]: (node: Node, children: ReactNode) => (
        <>
          <Typography variant="h4">{children}</Typography>
        </>
      ),
      [BLOCKS.HEADING_5]: (node: Node, children: ReactNode) => <Typography variant="h5">{children}</Typography>,
      [BLOCKS.HEADING_6]: (node: Node, children: ReactNode) => (
        <Typography variant="h6" mt={0}>
          {children}
        </Typography>
      ),
      [INLINES.HYPERLINK]: (node: Node, children: ReactNode) => (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        <StyledLink href={node.data.uri ?? ""}>{children}</StyledLink>
      ),
      [BLOCKS.PARAGRAPH]: (node: Node, children: ReactNode) => {
        if (Array.isArray(children) && children.length === 1 && typeof children[0] === "string") {
          if (children[0].trim() === "") {
            return <br />;
          }
        }
        return (
          <Typography variant={typographyVariant} component="p" sx={styles.paragraphStyle}>
            {children}
          </Typography>
        );
      },
    },
  };
}

function ContentfulRichTextRenderer({ text, typographyVariant }: ContentfulRichTextRendererProps) {
  try {
    if (text?.json !== undefined) {
      return <>{documentToReactComponents(text.json, renderOptions(text.links, typographyVariant ?? "body1"))}</>;
    } else {
      throw new Error("Invalid text prop");
    }
  } catch (error) {
    console.error("Error: ContentfulRichTextRenderer.tsx - Error rendering rich text", error);
    return null;
  }
}

export default ContentfulRichTextRenderer;

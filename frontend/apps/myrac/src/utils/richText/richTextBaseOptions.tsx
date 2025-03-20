import type { Node } from "@contentful/rich-text-types";
import type { ReactNode } from "react";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Typography } from "@mui/material";
import { StyledNextLink } from "#components/Links/StyledNextLink";

type HyperlinkNode = {
  data: {
    uri: string;
  };
} & Node;

export const baseOptions = {
  [BLOCKS.HEADING_1]: (_: Node, children: ReactNode) => (
    <Typography variant="h1" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_2]: (_: Node, children: ReactNode) => (
    <Typography variant="h2" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_3]: (_: Node, children: ReactNode) => (
    <Typography variant="h3" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_4]: (_: Node, children: ReactNode) => (
    <Typography variant="h4" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_5]: (_: Node, children: ReactNode) => (
    <Typography variant="h5" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_6]: (_: Node, children: ReactNode) => (
    <Typography variant="h6" color="inherit">
      {children}
    </Typography>
  ),
  // Renders typography embedded hyperlink
  [INLINES.HYPERLINK]: (node: Node, children: ReactNode) => {
    const typedNode = node as HyperlinkNode;
    return <StyledNextLink href={typedNode.data.uri}>{children}</StyledNextLink>;
  },
  [BLOCKS.PARAGRAPH]: (_: Node, children: ReactNode) => (
    <Typography variant="body1" color="inherit">
      {children}
    </Typography>
  ),
};

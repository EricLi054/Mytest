import type { Block, Inline } from "@contentful/rich-text-types";
import type { TypographyProps } from "@mui/material";
import type { ReactNode } from "react";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Typography } from "@mui/material";

import { colors } from "@racwa/styles";

export const baseOptions = (paragraphProps?: TypographyProps) => ({
  [BLOCKS.HEADING_1]: (node: Block | Inline, children: ReactNode) => (
    <Typography variant="h1" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_2]: (node: Block | Inline, children: ReactNode) => (
    <Typography variant="h2" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_3]: (node: Block | Inline, children: ReactNode) => (
    <Typography variant="h3" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_4]: (node: Block | Inline, children: ReactNode) => (
    <Typography variant="h4" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_5]: (node: Block | Inline, children: ReactNode) => (
    <Typography variant="h5" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_6]: (node: Block | Inline, children: ReactNode) => (
    <Typography variant="h6" color="inherit">
      {children}
    </Typography>
  ),
  [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: ReactNode) => (
    <Typography variant="body1" color={colors.dieselDeep} {...paragraphProps}>
      {children}
    </Typography>
  ),
  [BLOCKS.OL_LIST]: (node: Block | Inline, children: ReactNode) => <ol style={{ paddingLeft: "24px" }}>{children}</ol>,
  [INLINES.HYPERLINK]: (node: Block | Inline, children: ReactNode) => (
    <a
      href={node.data.uri as string}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontWeight: 400, color: colors.linkBlue }}
    >
      {children}
    </a>
  ),
});

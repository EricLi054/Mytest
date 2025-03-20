import type { TypographyVariant } from "@mui/material";
import type { Category } from "#types/horizons/category";

import type { RichTextProps } from "./richTextProps";

export type ContentfulRichTextRendererProps = {
  text: RichTextProps | null;
  isArticlePage?: boolean;
  category?: Category;
  typographyVariant?: TypographyVariant;
  relatedArticleVariant?: "simple" | "advanced";
};

import type { RichTextProps } from "#types/common/richTextProps";

import type { CloudinaryAsset } from "@racwa/ui";

export type ContentfulPageHeader = {
  data: {
    horizons_pageHeader: PageHeaderProps;
  };
} | null;

export type PageHeaderProps = {
  title: string;
  image: CloudinaryAsset;
  sectionColour: "White" | "Grey";
  parentBreadcrumb: string;
  leftContent: RichTextProps;
  rightContent: RichTextProps;
};

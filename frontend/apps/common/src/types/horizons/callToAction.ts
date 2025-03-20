import type { RichTextProps } from "#types/common/richTextProps";

import type { CloudinaryAsset } from "@racwa/ui";

export type ContentfulCallToAction = {
  data: {
    horizons_callToAction: CallToActionProps;
  };
} | null;

export type CallToActionProps = {
  title: string;
  link: string;
  linkText: string;
  image: CloudinaryAsset | null;
  detailedDescription: RichTextProps;
  finePrint: string;
  mode: string;
};
